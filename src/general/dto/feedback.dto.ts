import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class feedback {
  @IsNotEmpty()
  @ApiProperty()
  feedBackData: string;
}
