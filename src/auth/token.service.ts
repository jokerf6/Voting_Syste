import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import * as jwt from "jsonwebtoken";

@Injectable()
export class tokenService {
  constructor(private prisma: PrismaService) {}
  async createAccess(user: User) {
    const tokenId = await this.prisma.token.create({
      data: {
        userId: user.id,
      },
    });
    const accessToken = jwt.sign(
      { userId: user.id, id: tokenId.id, role: user.Role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 1 * 24 * 60 * 60 }
    );
    return accessToken;
  }
}
