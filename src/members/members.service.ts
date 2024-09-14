import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from './members.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async findAll(): Promise<MemberEntity[]> {
    return await this.memberRepository.find({ relations: ['clubs'] });
  }

  async findOne(id: string): Promise<MemberEntity> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['clubs'],
    });
    if (!member) {
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return member;
  }

  async create(member: MemberEntity): Promise<MemberEntity> {
    if (!member.email.includes('@')) {
      throw new BusinessLogicException(
        'The email is invalid',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.memberRepository.save(member);
  }

  async update(id: string, member: MemberEntity): Promise<MemberEntity> {
    const persistedMember = await this.memberRepository.findOne({
      where: { id },
    });
    if (!persistedMember) {
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (!member.email.includes('@')) {
      throw new BusinessLogicException(
        'The email is invalid',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.memberRepository.save({ ...persistedMember, ...member });
  }

  async delete(id: string): Promise<void> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.memberRepository.delete(id);
  }
}
