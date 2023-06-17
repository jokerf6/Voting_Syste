import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { join } from "path";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.titan.email",
        port: 587,
        secure: false,
        auth: {
          user: "no-reply@voting.prefectjob.com",
          pass: "Fahdhakem123*",
        },
      },
    }),
  ],
  //
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
