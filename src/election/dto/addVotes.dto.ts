import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class addvotes {
  @IsNotEmpty()
  @ApiProperty({
    isArray: true,
  })
  candidateId: string;
}
