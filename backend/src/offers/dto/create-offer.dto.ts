import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";

export class CreateOfferDto {
  @ApiProperty({
    description:
      "Bid amount. Must meet the starting price on the first bid, or strictly " +
      "exceed the current price afterwards.",
    example: 320.0,
  })
  @IsPositive()
  amount!: number;
}
