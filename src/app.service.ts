import { Injectable } from "@nestjs/common";
import path, { join } from "path";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
  async sendFile(res, id) {
    console.log(id.split("uploads/")[0]);

    const filePath = join(
      __dirname,
      "..",
      `/uploads/${id.split("uploads/")[0]}`
    );

    res.sendFile(filePath, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:", "fileName");
      }
    });
  }
}
