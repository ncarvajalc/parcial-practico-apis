import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { ClubEntity } from './clubs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubsRepository: Repository<ClubEntity>,
  ) {}

  async findAll(): Promise<ClubEntity[]> {
    return await this.clubsRepository.find({ relations: ['members'] });
  }

  async findOne(id: string): Promise<ClubEntity> {
    const club = await this.clubsRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!club) {
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return club;
  }

  async create(club: ClubEntity): Promise<ClubEntity> {
    if (club.description.length > 100) {
      throw new BusinessLogicException(
        'The description surpasses the maximum length of 100 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.clubsRepository.save(club);
  }

  async update(id: string, club: ClubEntity): Promise<ClubEntity> {
    const persistedClub = await this.clubsRepository.findOne({
      where: { id },
    });
    if (!persistedClub) {
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (club.description.length > 100) {
      throw new BusinessLogicException(
        'The description surpasses the maximum length of 100 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.clubsRepository.save({ ...persistedClub, ...club });
  }

  async delete(id: string): Promise<void> {
    const club = await this.clubsRepository.findOne({
      where: { id },
    });
    if (!club) {
      throw new BusinessLogicException(
        'The club with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.clubsRepository.delete(id);
  }
}
