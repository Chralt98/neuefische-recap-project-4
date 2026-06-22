import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class OfferResponseDto {
  @ApiProperty({ format: "uuid" })
  @Expose()
  id!: string;

  @ApiProperty({ example: 320.0 })
  @Expose()
  amount!: number;

  @ApiProperty({ type: String, format: "date-time" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: "ac1dburn", description: "Username of the bidder." })
  @Expose()
  bidder!: string;

  @ApiProperty({ format: "uuid", description: "Auction this bid belongs to." })
  @Expose()
  auctionId!: string;
}
