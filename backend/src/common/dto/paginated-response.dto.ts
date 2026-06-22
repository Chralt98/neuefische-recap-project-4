import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  @Expose()
  page!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  limit!: number;

  @ApiProperty({ example: 247, description: "Total matching items." })
  @Expose()
  total!: number;

  @ApiProperty({ example: 25, description: "Total pages at this page size." })
  @Expose()
  totalPages!: number;
}
