import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "z3r0c00l" })
  @IsString()
  username!: string;

  @ApiProperty({ example: "h4ck-the-planet" })
  @IsString()
  password!: string;
}
