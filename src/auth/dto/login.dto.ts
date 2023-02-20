import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty } from "class-validator";

export class loginDto {
  @IsNotEmpty()
  @ApiProperty()
  Email: string;

  @IsNotEmpty()
  @ApiProperty()
  Password: string;
}
