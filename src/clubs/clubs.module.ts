import { Module } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './clubs.entity';
import { ClubsController } from './clubs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity])],
  providers: [ClubsService],
  controllers: [ClubsController],
})
export class ClubsModule {}
