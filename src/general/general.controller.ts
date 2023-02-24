import { Body, Controller, Post, Res, ValidationPipe } from "@nestjs/common";
import { GeneralService } from "./general.service";
import { ApiTags } from "@nestjs/swagger";
import { feedback } from "./dto/feedback.dto";

@Controller("general")
@ApiTags("general")
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @Post("/feedback")
  feedBack(@Res() res, @Body(ValidationPipe) feedback: feedback) {
    return this.generalService.feedBack(res, feedback);
  }
}
