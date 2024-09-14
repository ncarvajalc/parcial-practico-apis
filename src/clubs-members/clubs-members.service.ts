import { ClubEntity } from '../clubs/clubs.entity';
import { Injectable } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import { MemberEntity } from '../members/members.entity';
import { MembersService } from '../members/members.service';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ClubsMembersService {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly membersService: MembersService,
  ) {}

  async addMemberToClub(clubId: string, memberId: string): Promise<ClubEntity> {
    const club = await this.clubsService.findOne(clubId);
    const member = await this.membersService.findOne(memberId);

    club.members = [...club.members, member];

    return await this.clubsService.update(clubId, club);
  }

  async findMembersFromClub(clubId: string): Promise<MemberEntity[]> {
    const club = await this.clubsService.findOne(clubId);
    return club.members;
  }

  async findMemberFromClub(
    clubId: string,
    memberId: string,
  ): Promise<MemberEntity> {
    const club = await this.clubsService.findOne(clubId);
    const member = await this.membersService.findOne(memberId);

    const foundMember = club.members.find(
      (memberEntity) => memberEntity.id === member.id,
    );

    if (!foundMember) {
      throw new BusinessLogicException(
        'The member with the given id is not associated to the club',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return member;
  }

  async updateMembersFromClub(
    clubId: string,
    members: MemberEntity[],
  ): Promise<ClubEntity> {
    const club = await this.clubsService.findOne(clubId);
    for (const member of members) {
      await this.membersService.findOne(member.id);
    }
    club.members = members;
    return await this.clubsService.update(clubId, club);
  }

  async deleteMemberFromClub(clubId: string, memberId: string): Promise<void> {
    const club = await this.clubsService.findOne(clubId);
    const member = await this.membersService.findOne(memberId);

    const foundMember = club.members.find(
      (memberEntity) => memberEntity.id === member.id,
    );

    if (!foundMember) {
      throw new BusinessLogicException(
        'The member with the given id is not associated to the club',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    club.members = club.members.filter(
      (memberEntity) => memberEntity.id !== member.id,
    );
    await this.clubsService.update(clubId, club);
  }
}
