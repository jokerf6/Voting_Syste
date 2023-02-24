import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class createCandidate {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  age: number;

  @ApiProperty()
  @IsNotEmpty()
  party: string;

  @ApiProperty()
  @IsNotEmpty()
  education: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  image: string;
}
