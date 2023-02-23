import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";
import { addvotes } from "./dto/addVotes.dto";

@Injectable()
export class ElectionService {
  constructor(private prisma: PrismaService) {}

  async getElection(req, res, electionId) {
    const exist = await this.prisma.election.findUnique({
      where: {
        id: electionId,
      },
      include: {
        electionCandidates: {
          include: {
            candidate: {
              include: {
                _count: {
                  select: {
                    voting: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            voting: true,
          },
        },
      },
    });
    if (!exist) {
      return ResponseController.badRequest(
        res,
        "Election donot exist",
        "Election donot exist"
      );
    }
    const candidates = [];
    for (let i = 0; i < exist.electionCandidates.length; i += 1) {
      candidates.push({
        id: exist.electionCandidates[i].candidate.id,
        name: exist.electionCandidates[i].candidate.name,
        image: exist.electionCandidates[i].candidate.image,
        age: exist.electionCandidates[i].candidate.age,
        party: exist.electionCandidates[i].candidate.party,
        education: exist.electionCandidates[i].candidate.education,
        percent:
          (exist.electionCandidates[i].candidate._count.voting / 100) *
          exist._count.voting,
      });
    }
    return ResponseController.success(res, "Get data Successfully", candidates);
  }

  async upcommingElections(req, res, query) {
    const count = await this.prisma.election.count({
      where: {
        start: {
          gt: new Date(),
        },
      },
    });
    if (req.user.userObject.role === "USER") {
      query.skip = "0";
      query.take = "3";
    }
    const upComming = await this.prisma.election.findMany({
      skip: (parseInt(query.skip) - 1) * parseInt(query.take || 3) || 0,
      take: +query.take || 3,
      where: {
        start: {
          gt: new Date(),
        },
      },
      orderBy: { start: "asc" },
    });
    return ResponseController.success(res, "Get Data Successfully", {
      count,
      upComming,
    });
  }

  async currentElections(req, res) {
    const current = await this.prisma.election.findMany({
      where: {
        start: {
          lte: new Date(),
        },
        end: {
          gte: new Date(),
        },
      },
      orderBy: { start: "asc" },
    });

    return ResponseController.success(
      res,
      "Get Elections Successfully",
      current
    );
  }

  async pastElections(req, res, query) {
    const count = await this.prisma.election.count({
      where: {
        end: {
          lt: new Date(),
        },
      },
    });
    const pastElections = await this.prisma.election.findMany({
      skip: (parseInt(query.skip) - 1) * parseInt(query.take || 3) || 0,
      take: +query.take || 3,
      where: {
        end: {
          lt: new Date(),
        },
      },
      orderBy: { start: "asc" },
    });
    return ResponseController.success(res, "Get Data Successfully", {
      count,
      pastElections,
    });
  }

  async addElection(req, res, addElection) {
    const { name, start, end, numberOfCandidates } = addElection;
    if (numberOfCandidates <= 0) {
      return ResponseController.badRequest(
        res,
        "number of candidates must be greater than 0",
        "number of candidates must be greater than 0"
      );
    }
    await this.prisma.election.create({
      data: {
        name,
        start,
        end,
        numberOfCandidates,
      },
    });
    return ResponseController.success(res, "Add Election Successfully", null);
  }
  async editElection(req, res, addElection, electionId) {
    const { name, start, end, numberOfCandidates } = addElection;
    if (numberOfCandidates <= 0) {
      return ResponseController.badRequest(
        res,
        "number of candidates must be greater than 0",
        "number of candidates must be greater than 0"
      );
    }
    const exist = await this.prisma.election.findUnique({
      where: {
        id: electionId,
      },
    });
    if (!exist) {
      return ResponseController.badRequest(
        res,
        "Election not found",
        "Election not found"
      );
    }
    if (exist.end < new Date()) {
      return ResponseController.badRequest(
        res,
        "You cannot edit this Election",
        "You cannot edit this Election"
      );
    }
    await this.prisma.election.update({
      where: {
        id: electionId,
      },
      data: {
        name,
        start,
        end,
        numberOfCandidates,
      },
    });
    return ResponseController.success(res, "edit Election Successfully", null);
  }
  async deleteElection(req, res, electionId) {
    const exist = await this.prisma.election.findUnique({
      where: {
        id: electionId,
      },
    });
    if (!exist) {
      return ResponseController.badRequest(
        res,
        "Election not found",
        "Election not found"
      );
    }
    await this.prisma.election.delete({
      where: {
        id: electionId,
      },
    });
    return ResponseController.success(
      res,
      "Delete Election Successfully",
      null
    );
  }

  async getVote(req, res, electionId) {
    const exist = await this.prisma.election.findUnique({
      where: {
        id: electionId,
      },
    });
    if (!exist) {
      return ResponseController.badRequest(
        res,
        "Election not found",
        "Election not found"
      );
    }
    const votes = await this.prisma.voting.findMany({
      where: {
        electionId: electionId,
        userId: req.user.userObject.id,
      },
    });
    return ResponseController.success(
      res,
      "Get Your Votes Successfully",
      votes
    );
  }

  async addVotes(req, res, addvotes, electionId) {
    const { candidateId } = addvotes;
    const exist = await this.prisma.election.findUnique({
      where: {
        id: electionId,
      },
    });
    if (!exist) {
      return ResponseController.badRequest(
        res,
        "Election not found",
        "Election not found"
      );
    }
    const alreadyVotes = await this.prisma.voting.findFirst({
      where: {
        electionId,
        userId: req.user.userObject.id,
      },
    });
    if (alreadyVotes) {
      return ResponseController.conflict(res, "You already voted Before");
    }
    for (let i = 0; i < candidateId.length; i += 1) {
      const exs = await this.prisma.candidate.findUnique({
        where: {
          id: candidateId[i],
        },
      });
      if (!exs) {
        return ResponseController.badRequest(
          res,
          "candidate not found",
          "candidate not found"
        );
      }
      await this.prisma.voting.create({
        data: {
          userId: req.user.userObject.id,
          electionId,
          candidateId: candidateId[i],
        },
      });
    }
    return ResponseController.success(res, "add Vote Successfully", null);
  }
}
//
