import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class addElection {
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(5)
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  start: Date;

  @IsNotEmpty()
  @ApiProperty()
  end: Date;

  @IsNotEmpty()
  @ApiProperty()
  numberOfCandidates: number;
}
