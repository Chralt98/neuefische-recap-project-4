import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { plainToInstance } from "class-transformer";
import { Auction } from "./auction.entity";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { AuctionStatus, QueryAuctionsDto } from "./dto/query-auctions.dto";
import { AuctionResponseDto } from "./dto/auction-response.dto";
import { PaginatedAuctionsDto } from "./dto/paginated-auctions.dto";

const DEFAULT_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // three days

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctions: Repository<Auction>,
  ) {}

  async create(
    dto: CreateAuctionDto,
    sellerId: string,
  ): Promise<AuctionResponseDto> {
    const endDate = dto.endDate
      ? new Date(dto.endDate)
      : new Date(Date.now() + DEFAULT_DURATION_MS);

    const auction = this.auctions.create({
      title: dto.title,
      description: dto.description,
      startingPrice: dto.startingPrice,
      currentPrice: dto.startingPrice,
      endDate,
      sellerId,
    });

    const saved = await this.auctions.save(auction);
    return this.findOne(saved.id);
  }

  async findAll(query: QueryAuctionsDto): Promise<PaginatedAuctionsDto> {
    const { page, limit, status, minPrice, maxPrice } = query;

    const where: FindOptionsWhere<Auction> = {};

    if (status === AuctionStatus.OPEN) {
      where.endDate = MoreThan(new Date());
    } else if (status === AuctionStatus.CLOSED) {
      where.endDate = LessThanOrEqual(new Date());
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.currentPrice = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.currentPrice = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.currentPrice = LessThanOrEqual(maxPrice);
    }

    const [items, total] = await this.auctions.findAndCount({
      where,
      order: { endDate: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return plainToInstance(
      PaginatedAuctionsDto,
      {
        data: items.map((auction) => this.toPlain(auction)),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { excludeExtraneousValues: true },
    );
  }

  async update(
    id: string,
    partial: Partial<Auction>,
  ): Promise<AuctionResponseDto> {
    const auction = await this.getEntityOrFail(id);
    const updated = this.auctions.merge(auction, partial);
    await this.auctions.save(updated);

    return this.findOne(id);
  }

  async findOne(id: string): Promise<AuctionResponseDto> {
    const auction = await this.getEntityOrFail(id);
    return plainToInstance(AuctionResponseDto, this.toPlain(auction), {
      excludeExtraneousValues: true,
    });
  }

  async getEntityOrFail(id: string): Promise<Auction> {
    const auction = await this.auctions.findOneBy({ id });
    if (!auction) {
      throw new NotFoundException(`Auction with ID "${id}" not found`);
    }
    return auction;
  }

  private isOpen(endDate: Date): boolean {
    return new Date(endDate).getTime() > Date.now();
  }

  private toPlain(auction: Auction) {
    return {
      id: auction.id,
      title: auction.title,
      description: auction.description,
      startingPrice: Number(auction.startingPrice),
      currentPrice: Number(auction.currentPrice),
      endDate: auction.endDate,
      createdAt: auction.createdAt,
      seller: auction.seller?.username,
      status: this.isOpen(auction.endDate)
        ? AuctionStatus.OPEN
        : AuctionStatus.CLOSED,
    };
  }
}
