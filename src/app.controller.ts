import { Controller, Get, Req, Res, Param } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiTags()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get("/api/v1/uploads/:id")
  sendFile(@Res() res, @Param("id") id: string) {
    return this.appService.sendFile(res, id);
  }
}
