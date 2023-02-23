import {
  Controller,
  UseGuards,
  Get,
  Req,
  Res,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/auth/guards/roles.guard";
import { roles } from "@prisma/client";
import { query } from "express";

import { CandidateService } from "./candidate.service";
import { createCandidate } from "./dto/createCandidate.dto";

@ApiTags("candidate")
@Controller("candidate")
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Roles(roles.ADMIN)
  @Post("/:electionId")
  async addCandidate(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) createCandidate: createCandidate,
    @Param("electionId") electionId: string
  ) {
    return this.candidateService.addCandidate(
      req,
      res,
      createCandidate,
      electionId
    );
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Roles(roles.ADMIN)
  @Patch("/:candidateId")
  async editCandidate(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) createCandidate: createCandidate,
    @Param("candidateId") candidateId: string
  ) {
    return this.candidateService.editCandidate(
      req,
      res,
      createCandidate,
      candidateId
    );
  }
}
