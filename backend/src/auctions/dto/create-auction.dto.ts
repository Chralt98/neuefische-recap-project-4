import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateAuctionDto {
  @ApiProperty({ example: "Vintage cyberdeck", maxLength: 120 })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title!: string;

  @ApiProperty({
    example: "A rare deck, lightly used. Ono-Sendai cyberspace 7.",
  })
  @IsString()
  @MinLength(3)
  description!: string;

  @ApiProperty({
    description: "Opening price. Bids must meet or exceed this value.",
    example: 250.0,
  })
  @IsPositive()
  startingPrice!: number;

  @ApiPropertyOptional({
    description:
      "ISO 8601 date-time when the auction closes. Defaults to three days " +
      "from creation when omitted.",
    example: "2026-07-01T18:00:00.000Z",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
