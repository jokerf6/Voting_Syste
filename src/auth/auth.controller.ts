import {
  Controller,
  Post,
  Body,
  Res,
  ValidationPipe,
  Param,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { createUser } from "./dto/create-auth.dto";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { loginDto } from "./dto/login.dto";
import { verifyDto } from "./dto/verify.dto";
import { forgetDto } from "./dto/forget.dto";
import { changePasswordDto } from "./dto/changePassword.dto";
@ApiTags("auth")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  signup(
    @Res() res: Response,
    @Body(ValidationPipe) createAuthDto: createUser
  ) {
    return this.authService.signup(res, createAuthDto);
  }
  // signin
  @Post("/signin")
  signin(@Res() res: Response, @Body(ValidationPipe) loginDto: loginDto) {
    return this.authService.signin(res, loginDto);
  }
  @Post("/verify-email/:id")
  async verifyEmail(
    @Param("id") id: string,
    @Res() res,
    @Body(ValidationPipe) verifyDto: verifyDto
  ) {
    return this.authService.verify(id, res, verifyDto);
  }

  @Post("/forgetPassword")
  async forgetPassword(@Res() res, @Body(ValidationPipe) forgetDto: forgetDto) {
    return this.authService.forgetPassword(res, forgetDto);
  }

  @Post("/reset-password/:id")
  async resetPassword(
    @Param("id") id: string,
    @Res() res,
    @Body(ValidationPipe) verifyDto: verifyDto
  ) {
    return this.authService.resetPassword(id, res, verifyDto);
  }
  @Post("/change_password/:id")
  async changePassword(
    @Param("id") id: string,
    @Res() res,
    @Body(ValidationPipe) changePasswordDto: changePasswordDto
  ) {
    return this.authService.changePassword(id, res, changePasswordDto);
  }
}
