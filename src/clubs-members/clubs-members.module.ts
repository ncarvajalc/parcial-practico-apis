import { MemberEntity } from '../members/members.entity';
import { ClubEntity } from '../clubs/clubs.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsMembersService } from './clubs-members.service';
import { ClubsService } from '../clubs/clubs.service';
import { MembersService } from '../members/members.service';
import { ClubsMembersController } from './clubs-members.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity, MemberEntity])],
  providers: [ClubsMembersService, ClubsService, MembersService],
  controllers: [ClubsMembersController],
})
export class ClubsMembersModule {}
