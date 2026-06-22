import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserResponseDto {
  @ApiProperty({ format: "uuid" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "z3r0c00l" })
  @Expose()
  username!: string;

  @ApiProperty({ type: String, format: "date-time" })
  @Expose()
  createdAt!: Date;
}
