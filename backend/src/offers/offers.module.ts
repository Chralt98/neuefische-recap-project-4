import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Offer } from "./offer.entity";
import { Auction } from "../auctions/auction.entity";
import { OffersService } from "./offers.service";
import { OffersController } from "./offers.controller";
import { AuctionsModule } from "src/auctions/auctions.module";

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), AuctionsModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
