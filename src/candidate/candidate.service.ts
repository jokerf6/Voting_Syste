import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ResponseController } from "src/static/responses";

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}
  async getCandidate(req, res, candidateId) {
    const candidate = await this.prisma.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });
    return ResponseController.success(
      res,
      "Add Candidate Successfully",
      candidate
    );
  }
  async addCandidate(req, res, createCandidate, electionId) {
    const { name, age, party, education, image } = createCandidate;
    if (age <= 0) {
      return ResponseController.badRequest(
        res,
        "Age Must be Positive",
        "Age Must be Positive"
      );
    }
    const user = await this.prisma.candidate.create({
      data: {
        name,
        age,
        party,
        education,
        image,
      },
    });
    await this.prisma.electionCandidates.create({
      data: {
        candidateId: user.id,
        electionId: electionId,
      },
    });
    return ResponseController.success(res, "Add Candidate Successfully", null);
  }
  async editCandidate(req, res, createCandidate, candidateId) {
    const { name, age, party, education, image } = createCandidate;
    if (age <= 0) {
      return ResponseController.badRequest(
        res,
        "Age Must be Positive",
        "Age Must be Positive"
      );
    }
    await this.prisma.candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        name,
        age,
        party,
        education,
        image,
      },
    });
    return ResponseController.success(res, "edit Candidate Successfully", null);
  }

  async deleteCandidate(req, res, candidateId) {
    await this.prisma.electionCandidates.deleteMany({
      where: {
        candidateId: candidateId,
      },
    });
    await this.prisma.candidate.delete({
      where: {
        id: candidateId,
      },
    });
    return ResponseController.success(res, "Delete Data Successfully", null);
  }
}
