import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './members.entity';
import { MembersController } from './members.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  providers: [MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
