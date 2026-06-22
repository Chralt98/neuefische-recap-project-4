import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AuthResponseDto {
  @ApiProperty({
    description: "Signed JWT. Send it as `Authorization: Bearer <token>`.",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @Expose()
  access_token!: string;
}
