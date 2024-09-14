import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './clubs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  providers: [ClubsService],
})
export class ClubsModule {}
