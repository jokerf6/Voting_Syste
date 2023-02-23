import { Module } from "@nestjs/common";
import { GeneralService } from "./general.service";
import { GeneralController } from "./general.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [GeneralController],
  providers: [GeneralService, PrismaService],
})
export class GeneralModule {}
