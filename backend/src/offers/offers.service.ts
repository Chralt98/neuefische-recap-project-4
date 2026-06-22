import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { Offer } from "./offer.entity";
import { Auction } from "../auctions/auction.entity";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { OfferResponseDto } from "./dto/offer-response.dto";
import { AuctionsService } from "src/auctions/auctions.service";
import { AuctionResponseDto } from "src/auctions/dto/auction-response.dto";

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offers: Repository<Offer>,
    private readonly auctionsService: AuctionsService,
  ) {}

  async placeOffer(
    auctionId: string,
    dto: CreateOfferDto,
    bidderId: string,
  ): Promise<OfferResponseDto> {
    const auction = await this.auctionsService.getEntityOrFail(auctionId);

    if (new Date(auction.endDate).getTime() <= Date.now()) {
      throw new ConflictException("This auction has already closed");
    }

    const offerCount = await this.offers.countBy({ auctionId });
    const startingPrice = Number(auction.startingPrice);
    const currentPrice = Number(auction.currentPrice);

    if (offerCount === 0) {
      if (dto.amount < startingPrice) {
        throw new ConflictException(
          `Bid must be at least the starting price of ${startingPrice}`,
        );
      }
    } else if (dto.amount <= currentPrice) {
      throw new ConflictException(
        `Bid must be greater than the current price of ${currentPrice}`,
      );
    }

    const offer = this.offers.create({
      amount: dto.amount,
      auctionId,
      bidderId,
    });
    const saved = await this.offers.save(offer);

    await this.auctionsService.update(auction.id, { currentPrice: dto.amount });

    return this.findOne(saved.id);
  }

  async findForAuction(auctionId: string): Promise<OfferResponseDto[]> {
    await this.auctionsService.getEntityOrFail(auctionId);

    const offers = await this.offers.find({
      where: { auctionId },
      order: { amount: "DESC" },
    });

    return offers.map((offer) =>
      plainToInstance(OfferResponseDto, this.toPlain(offer), {
        excludeExtraneousValues: true,
      }),
    );
  }

  private async findOne(id: string): Promise<OfferResponseDto> {
    const offer = await this.getEntityOrFail(id);

    return plainToInstance(OfferResponseDto, this.toPlain(offer), {
      excludeExtraneousValues: true,
    });
  }

  private async getEntityOrFail(id: string): Promise<Offer> {
    const offer = await this.offers.findOneBy({ id });
    if (!offer) {
      throw new NotFoundException(`Offer with ID "${id}" not found`);
    }
    return offer;
  }

  private toPlain(offer: Offer) {
    return {
      id: offer.id,
      amount: Number(offer.amount),
      createdAt: offer.createdAt,
      bidder: offer.bidder?.username,
      auctionId: offer.auctionId,
    };
  }
}
