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
import { ElectionService } from "./election.service";
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { addElection } from "./dto/addElection.dto";
import { Roles, RolesGuard } from "src/auth/guards/roles.guard";
import { roles } from "@prisma/client";
import { addvotes } from "./dto/addVotes.dto";

@ApiTags("election")
@Controller("election")
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @ApiQuery({
    name: "skip",
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "take",
    type: String,
    required: false,
  })
  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/past")
  async pastElections(
    @Req() req,
    @Res() res,
    @Query()
    query: {
      skip?: string;
      take?: string;
    }
  ) {
    return this.electionService.pastElections(req, res, query);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/upcomming")
  async upcommingElections(
    @Req() req,
    @Res() res,
    @Query()
    query: {
      skip?: string;
      take?: string;
    }
  ) {
    return this.electionService.upcommingElections(req, res, query);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/current")
  async currentElections(@Req() req, @Res() res) {
    return this.electionService.currentElections(req, res);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(roles.ADMIN)
  @Post("/")
  async addElection(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) addElection: addElection
  ) {
    return this.electionService.addElection(req, res, addElection);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(roles.ADMIN)
  @Patch("/:electionId")
  async editElection(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) addElection: addElection,
    @Param("electionId") electionId: string
  ) {
    return this.electionService.editElection(req, res, addElection, electionId);
  }
  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:electionId/vote")
  async getVote(
    @Req() req,
    @Res() res,
    @Param("electionId") electionId: string
  ) {
    return this.electionService.getVote(req, res, electionId);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(roles.ADMIN)
  @Delete("/:electionId")
  async deleteElection(
    @Req() req,
    @Res() res,
    @Param("electionId") electionId: string
  ) {
    return this.electionService.deleteElection(req, res, electionId);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Post("/:electionId/vote")
  async addVotes(
    @Req() req,
    @Res() res,
    @Body(ValidationPipe) addvotes: addvotes,
    @Param("electionId") electionId: string
  ) {
    return this.electionService.addVotes(req, res, addvotes, electionId);
  }

  @ApiBearerAuth("Access Token")
  @UseGuards(AuthGuard("jwt"))
  @Get("/:electionId")
  async getElection(
    @Req() req,
    @Res() res,
    @Param("electionId") electionId: string
  ) {
    return this.electionService.getElection(req, res, electionId);
  }
}
