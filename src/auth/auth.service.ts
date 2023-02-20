import { Injectable } from "@nestjs/common";
import { createUser } from "./dto/create-auth.dto";
import { ResponseController } from "src/static/responses";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { loginDto } from "./dto/login.dto";
import { tokenService } from "./token.service";
import * as sgMail from "@sendgrid/mail";
import fetch from "node-fetch";
import { gender } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenServices: tokenService
  ) {}
  async calculateAge(birthday) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    const currentDate = new Date().getUTCFullYear();
    return Math.abs(ageDate.getUTCFullYear() - currentDate);
  }
  // signip
  async signup(res, createUser: createUser) {
    const { name, Email, Password, IDNumber, Mobile, Gender, DateOfBirth } =
      createUser;
    const emailExist = await this.prisma.user.findFirst({
      where: {
        Email,
      },
    });
    if (emailExist)
      return ResponseController.conflict(res, "Email already exist");

    const idExist = await this.prisma.usersId.findUnique({
      where: {
        id: IDNumber,
      },
    });

    if (!idExist) return ResponseController.conflict(res, "id not exist");
    if (idExist.used)
      return ResponseController.conflict(res, "id alraedy exist");

    const hashPassword = await bcrypt.hash(Password, 8);
    const age = await this.calculateAge(DateOfBirth);
    const newUser = await this.prisma.user.create({
      data: {
        name: name,
        Email: Email,
        Password: hashPassword,
        age,
        Mobile: Mobile,
        Gender: Gender,
        IDNumber,
      },
    });
    return ResponseController.success(res, "User Created SuccessFully", null);
  }
  // signin
  async signin(res, loginDto: loginDto) {
    const { Email, Password } = loginDto;
    const emailExist = await this.prisma.user.findFirst({
      where: {
        Email,
      },
    });
    if (!emailExist)
      return ResponseController.badRequest(
        res,
        "IncorrectCredentials",
        "Incorrect email or password"
      );
    const validPassword = await bcrypt.compare(Password, emailExist.Password);
    if (!validPassword) {
      return ResponseController.badRequest(
        res,
        "IncorrectCredentials",
        "Incorrect Email or Password"
      );
    }
    if (!emailExist.emailVerified) {
      return ResponseController.badRequest(
        res,
        "EmailNotVerified",
        "Email not Verified"
      );
    }
    const accessToken = await this.tokenServices.createAccess(emailExist);
    return ResponseController.success(res, "Login successfully", {
      user: emailExist,
      accessToken,
    });
  }
}
