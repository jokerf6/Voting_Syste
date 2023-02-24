import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async getUser(req, res) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.userObject.id,
      },
      select: {
        name: true,
        Gender: true,
        age: true,
        Email: true,
        IDNumber: true,
        Mobile: true,
        image: true,
      },
    });
    return ResponseController.success(res, "Get User Data Successfully", user);
  }
  async editUser(req, res, editUser) {
    const { name, Gender, age, Email, Mobile, image } = editUser;
    if (age <= 0) {
      return ResponseController.badRequest(
        res,
        "Age Mustbe Positive",
        "Age Mustbe Positive"
      );
    }
    await this.prisma.user.update({
      where: {
        id: req.user.userObject.id,
      },
      data: {
        name,
        Gender,
        age,
        Email,
        Mobile,
        image,
      },
    });
    return ResponseController.success(res, "User Edit Successfully", null);
  }
}
