import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class GeneralService {
  constructor(private prisma: PrismaService) {}
  async feedBack(res, feedback) {
    const { feedBackData } = feedback;
    await this.prisma.feedback.create({
      data: {
        feedBackData,
      },
    });
  }
}
