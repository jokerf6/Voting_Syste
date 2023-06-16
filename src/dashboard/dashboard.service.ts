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
  async votingHistory(req, res) {
    const votings = await this.prisma.voting.findMany({
      where: {
        userId: req.user.userObject.id,
      },
      select: {
        election: {
          select: {
            id: true,
            name: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    for (let i = 0; i < votings.length; i += 1) {
      const allCandidates = await this.prisma.electionCandidates.findMany({
        where: {
          electionId: votings[i].election.id,
        },
      });
      const candidateVoting = await this.prisma.voting.count({
        where: {
          candidateId: votings[i].candidate.id,
          electionId: votings[i].election.id,
        },
      });
      let ix = 1;
      let percent = 0;
      for (let j = 0; j < allCandidates.length; j += 1) {
        if (allCandidates[j].id === votings[i].candidate.id) continue;
        const votes = await this.prisma.voting.count({
          where: {
            candidateId: allCandidates[j].id,
            electionId: allCandidates[j].electionId,
          },
        });
        if (votes > candidateVoting) ix += 1;
        percent += votes;
      }
      percent += candidateVoting;
      percent = (candidateVoting / percent) * 100;
      votings[i]["percent"] = percent;
      votings[i]["rank"] = ix;
    }
    return ResponseController.success(res, "Get Data Successfully", votings);
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
