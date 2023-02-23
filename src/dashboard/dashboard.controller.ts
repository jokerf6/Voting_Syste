import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { editUser } from "./dto/editUser.dto";

@ApiTags("dashboard")
@Controller("user")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/")
  async getUser(@Req() req, @Res() res) {
    return this.dashboardService.getUser(req, res);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Patch("/")
  async editUser(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) editUser: editUser
  ) {
    return this.dashboardService.editUser(req, res, editUser);
  }
}
