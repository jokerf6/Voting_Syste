import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";

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
    return ResponseController.success(res, "add Data Successfully", null);
  }
}
//
//
//
//
