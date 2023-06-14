import { ApiProperty } from "@nestjs/swagger";
import {
  Equals,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  NotEquals,
  isNotEmpty,
} from "class-validator";
import { min } from "rxjs";

export enum gender {
  Male = "Male",
  Female = "Female",
}

export class editUser {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  Email: string;

  @ApiProperty()
  @IsNotEmpty()
  age: number;

  @ApiProperty()
  Gender: gender;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(11)
  @MinLength(11)
  Mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  image: string;
}
