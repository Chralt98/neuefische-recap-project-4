import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "Unique handle the user logs in with.",
    example: "z3r0c00l",
  })
  @IsString()
  @MaxLength(60)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      "username may only contain letters, numbers, hyphens and underscores",
  })
  username!: string;

  @ApiProperty({
    description: "Plaintext password. Hashed with bcrypt before storage.",
    example: "h4ck-the-planet",
    minLength: 8,
  })
  @IsString()
  @MaxLength(72)
  password!: string;
}
