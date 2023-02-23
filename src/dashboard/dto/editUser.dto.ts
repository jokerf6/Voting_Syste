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
  @Matches(/^[a-zA-Z - \s]*$/, {
    message: "name must be characters only ",
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: "email not valid" })
  Email: string;

  @ApiProperty()
  @IsNotEmpty()
  age: number;

  @ApiProperty()
  @IsEnum(gender)
  @Equals(gender[gender.Male] || gender[gender.Female])
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
