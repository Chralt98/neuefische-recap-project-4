import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { AuctionResponseDto } from "./auction-response.dto";
import { PaginationMetaDto } from "../../common/dto/paginated-response.dto";

export class PaginatedAuctionsDto {
  @ApiProperty({ type: [AuctionResponseDto] })
  @Expose()
  @Type(() => AuctionResponseDto)
  data!: AuctionResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  @Expose()
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}
