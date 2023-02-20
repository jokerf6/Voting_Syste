import { Controller, Post, Body, Res, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { createUser } from "./dto/create-auth.dto";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { loginDto } from "./dto/login.dto";
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
}
