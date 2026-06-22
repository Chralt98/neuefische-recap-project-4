import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";
import { Auction } from "./auctions/auction.entity";
import { Offer } from "./offers/offer.entity";
import { User } from "./users/user.entity";
import { AuctionsModule } from "./auctions/auctions.module";
import { OffersModule } from "./offers/offers.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "better-sqlite3",
      database: "darkbay.sqlite",
      entities: [Auction, Offer, User],
      synchronize: true,
      logging: false,
      enableWAL: true,
    }),
    UsersModule,
    AuthModule,
    AuctionsModule,
    OffersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
