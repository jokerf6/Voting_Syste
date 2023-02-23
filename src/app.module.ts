import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service";
import { LoggerMiddleware } from "./Middlewares/Logger";
import { AuthModule } from "./auth/auth.module";
import { UploadModule } from "./upload/upload.module";
import { MailModule } from "./mail/mail.module";
import { GeneralModule } from './general/general.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ElectionModule } from './election/election.module';
import { CandidateModule } from './candidate/candidate.module';

@Module({
  imports: [AuthModule, UploadModule, MailModule, GeneralModule, DashboardModule, ElectionModule, CandidateModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
