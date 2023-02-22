import { Injectable } from "@nestjs/common";
import { createUser } from "./dto/create-auth.dto";
import { ResponseController } from "src/static/responses";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";
import { loginDto } from "./dto/login.dto";
import { tokenService } from "./token.service";
import * as speakeasy from "speakeasy";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenServices: tokenService,
    private mail: MailService
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
    const secret = speakeasy.generateSecret().base32;
    //console.log(secret);
    const code = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    await this.mail.sendUserConfirmation(
      name,
      Email,
      `${process.env.BASE_URL}/auth/verify-email/${secret}`,
      code.toString(),
      "confirmation"
    );

    await this.prisma.secret.create({
      data: {
        userId: newUser.id,
        url: secret,
        code: code.toString(),
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
  async verify(id, res, verifyDto) {
    const { code } = verifyDto;
    let secret = speakeasy.generateSecret().base32;
    const exist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
    });
    if (!exist) {
      return ResponseController.notFound(res, "page not Found");
    }

    const userExist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
      select: { user: true, code: true },
    });

    if (!userExist) {
      return ResponseController.badRequest(
        res,
        "user not found",
        "user not found"
      );
    }
    if (exist.code !== code) {
      return ResponseController.badRequest(res, "Invalid Code", "Invalid Code");
    }

    await this.prisma.user.update({
      where: {
        id: userExist.user.id,
      },
      data: {
        emailVerified: true,
      },
    });
    await this.prisma.secret.deleteMany({
      where: {
        userId: userExist.user.id,
      },
    });
    return ResponseController.success(res, "Email Verified Successfully", null);
  }

  async forgetPassword(res, forgetDto) {
    const { email } = forgetDto;
    const emailExist = await this.prisma.user.findFirst({
      where: {
        Email: email,
      },
    });
    if (!emailExist) {
      return ResponseController.badRequest(
        res,
        "Email not found",
        "Email not found"
      );
    }
    if (!emailExist.emailVerified) {
      return ResponseController.badRequest(
        res,
        "Email not verified",
        "Email not verified"
      );
    }

    const secret = speakeasy.generateSecret().base32;
    const code = speakeasy.totp({
      secret: secret,
      digits: 5,
      encoding: "base32",
      step: 300,
    });
    await this.prisma.secret.create({
      data: {
        userId: emailExist.id,
        code: code,
        url: secret,
        type: "PASSWORD_RESET",
      },
    });
    //
    await this.mail.sendUserConfirmation(
      emailExist.name,
      email,
      `${process.env.BASE_URL}/auth/reset-password/${secret}`,
      code.toString(),
      "confirmation"
    );

    return ResponseController.success(res, "code sent Successfully", null);
  }

  async resetPassword(id, res, verifyDto) {
    const { code } = verifyDto;
    let secret = speakeasy.generateSecret().base32;
    const exist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
    });
    if (!exist) {
      return ResponseController.notFound(res, "page not Found");
    }

    const userExist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
      select: { user: true, code: true },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        "user not found",
        "user not found"
      );
    }
    if (userExist.code !== code) {
      return ResponseController.badRequest(res, "Invalid Code", "Invalid Code");
    }
    await this.prisma.secret.deleteMany({
      where: {
        userId: userExist.user.id,
      },
    });
    const url = process.env.BASE_URL + "/auth/change_password/" + secret;
    await this.prisma.secret.create({
      data: {
        code: code,
        url: secret,
        userId: userExist.user.id,
        type: "PASSWORD_RESET",
      },
    });
    return ResponseController.success(res, "Email Verified Successfully", {
      url,
    });
  }
  async changePassword(id, res, changePasswordDto) {
    const { password } = changePasswordDto;
    let secret = speakeasy.generateSecret().base32;
    const exist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
    });
    if (!exist) {
      return ResponseController.notFound(res, "page not Found");
    }

    const userExist = await this.prisma.secret.findFirst({
      where: {
        url: id,
      },
      select: { user: true, code: true },
    });
    if (!userExist) {
      return ResponseController.badRequest(
        res,
        "user not found",
        "user not found"
      );
    }

    await this.prisma.secret.deleteMany({
      where: {
        userId: userExist.user.id,
      },
    });
    const hashPassword = await bcrypt.hash(password, 8);

    await this.prisma.user.update({
      where: {
        id: userExist.user.id,
      },
      data: {
        Password: hashPassword,
      },
    });
    return ResponseController.success(
      res,
      "Password Change Successfully",
      null
    );
  }
  async logout(req, res) {
    const user = req.user.userObject.id;
    const token = req.user.jti;
    const found = await this.prisma.token.findFirst({
      where: { id: token, userId: user },
    });
    if (!found) return ResponseController.notFound(res, "token not found");
    await this.prisma.token.delete({
      where: { id: found.id },
    });
    return ResponseController.success(res, "Session destroyed successfully");
  }
}
