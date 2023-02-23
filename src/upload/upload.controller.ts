import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Observable, max, of } from "rxjs";
import { ApiAssetFile } from "./decorator/api-file.decorator";
import { ParseFile } from "./pipes/parse-file.pip";
import { AuthGuard } from "@nestjs/passport";
import * as pdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import * as pdfText from "pdf-text";
import * as pdf from "pdf-text-extract";
import * as fs from "fs";
//
@ApiTags("Upload")
@Controller("upload")
export class UploadController {
  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Post("file")
  @ApiAssetFile("file", true)
  uploadFile(@UploadedFile(ParseFile) file): Observable<{ url: string }> {
    const getPDF = async (file) => {
      let readFileSync = fs.readFileSync(file);
      try {
        let pdfExtract = await pdfParse(readFileSync);
        console.log(
          "File content: ",
          pdfExtract.text.toLowerCase().split("skills")[1].split("education" || "projects" || "languages"|| "language")
        );
      } catch (error) {
        throw new Error(error);
      }
    };
    getPDF(`./${file.path}`);
    return of({
      url: `${process.env.BASE_URL}/api/v1/${file.path
        .replace("uploads\\", "")
        .replace("\\", "/")}`,
    });
  }
}

//// Extract text from pdf in nestjs?
