import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { AuctionStatus } from "./query-auctions.dto";

export class AuctionResponseDto {
  @ApiProperty({ format: "uuid" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Vintage cyberdeck" })
  @Expose()
  title!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty({ example: 250.0 })
  @Expose()
  startingPrice!: number;

  @ApiProperty({
    example: 320.0,
    description: "Highest accepted bid so far, or the starting price if none.",
  })
  @Expose()
  currentPrice!: number;

  @ApiProperty({ type: String, format: "date-time" })
  @Expose()
  endDate!: Date;

  @ApiProperty({ type: String, format: "date-time" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: "z3r0c00l", description: "Username of the seller." })
  @Expose()
  seller!: string;

  @ApiProperty({ enum: AuctionStatus })
  @Expose()
  status!: AuctionStatus;
}
