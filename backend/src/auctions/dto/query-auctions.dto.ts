import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsPositive, Max, Min } from "class-validator";

export enum AuctionStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export class QueryAuctionsDto {
  @ApiPropertyOptional({
    enum: AuctionStatus,
    description: "Filter by lifecycle state, derived from the end date.",
  })
  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;

  @ApiPropertyOptional({
    name: "min-price",
    description: "Only auctions whose current price is at least this value.",
    example: 100,
  })
  @Expose({ name: "min-price" })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  minPrice?: number;

  @ApiPropertyOptional({
    name: "max-price",
    description: "Only auctions whose current price is at most this value.",
    example: 1000,
  })
  @Expose({ name: "max-price" })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  maxPrice?: number;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
