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

export enum gender {
  Male = "Male",
  Female = "Female",
}

export class createUser {
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

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      "password must have atleast 8 chars which should be between uppercase characters, lowercase characters, special characters, and numbers",
  })
  Password: string;

  @ApiProperty()
  @IsNotEmpty()
  DateOfBirth: Date;

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
  IDNumber: string;
}
