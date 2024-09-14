import { plainToInstance } from 'class-transformer';
import { ClubsMembersService } from './clubs-members.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { MemberEntity } from '../members/members.entity';
import { MemberDto } from '../members/member.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubsMembersController {
  constructor(
    private readonly gastronomicClubMemberService: ClubsMembersService,
  ) {}

  @Get(':clubId/members')
  async findMembersFromClub(@Param('clubId') clubId: string) {
    return await this.gastronomicClubMemberService.findMembersFromClub(clubId);
  }

  @Get(':clubId/members/:memberId')
  async findMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ) {
    return await this.gastronomicClubMemberService.findMemberFromClub(
      clubId,
      memberId,
    );
  }

  @Post(':clubId/members/:memberId')
  async addMemberToClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ) {
    return await this.gastronomicClubMemberService.addMemberToClub(
      clubId,
      memberId,
    );
  }

  @Put(':clubId/members')
  async updateMembersFromClub(
    @Param('clubId') clubId: string,
    @Body() memberDto: MemberDto[],
  ) {
    const members = plainToInstance(MemberEntity, memberDto);
    return await this.gastronomicClubMemberService.updateMembersFromClub(
      clubId,
      members,
    );
  }

  @Delete(':clubId/members/:memberId')
  @HttpCode(204)
  async deleteMemberFromClub(
    @Param('clubId') clubId: string,
    @Param('memberId') memberId: string,
  ) {
    return await this.gastronomicClubMemberService.deleteMemberFromClub(
      clubId,
      memberId,
    );
  }
}
