// clubs-members.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ClubsMembersService } from './clubs-members.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ClubEntity } from '../clubs/clubs.entity';
import { MemberEntity } from '../members/members.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ClubsService } from '../clubs/clubs.service';
import { MembersService } from '../members/members.service';

describe('ClubsMembersService', () => {
  let service: ClubsMembersService;
  let clubsRepository: Repository<ClubEntity>;
  let membersRepository: Repository<MemberEntity>;
  let club: ClubEntity;
  let membersList: MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubsMembersService, ClubsService, MembersService],
    }).compile();

    service = module.get<ClubsMembersService>(ClubsMembersService);
    clubsRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    membersRepository = module.get<Repository<MemberEntity>>(
      getRepositoryToken(MemberEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await membersRepository.clear();
    await clubsRepository.clear();

    membersList = [];
    for (let i = 0; i < 5; i++) {
      const member: MemberEntity = await membersRepository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.past(),
      });
      membersList.push(member);
    }

    club = await clubsRepository.save({
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
      members: membersList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a member to a club', async () => {
    const newMember: MemberEntity = await membersRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
    });

    const updatedClub = await service.addMemberToClub(club.id, newMember.id);
    expect(updatedClub.members.length).toBe(6);
    expect(updatedClub.members.find((m) => m.id === newMember.id)).toBeTruthy();
  });

  it('addMemberToClub should throw an exception for an invalid member', async () => {
    await expect(service.addMemberToClub(club.id, '0')).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newMember: MemberEntity = membersList[0];
    await expect(
      service.addMemberToClub('0', newMember.id),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('findMemberFromClub should return a member by club', async () => {
    const member: MemberEntity = membersList[0];
    const storedMember = await service.findMemberFromClub(club.id, member.id);
    expect(storedMember).not.toBeNull();
    expect(storedMember.username).toEqual(member.username);
    expect(storedMember.email).toEqual(member.email);
  });

  it('findMemberFromClub should throw an exception for an invalid member', async () => {
    await expect(
      service.findMemberFromClub(club.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('findMemberFromClub should throw an exception for a member not associated with the club', async () => {
    const newMember: MemberEntity = await membersRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
    });
    await expect(() =>
      service.findMemberFromClub(club.id, newMember.id),
    ).rejects.toHaveProperty(
      'message',
      'The member with the given id is not associated to the club',
    );
  });

  it('findMembersFromClub should return all members of a club', async () => {
    const members = await service.findMembersFromClub(club.id);
    expect(members.length).toBe(5);
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(service.findMembersFromClub('0')).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('updateMembersFromClub should update members list for a club', async () => {
    const newMember: MemberEntity = await membersRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
    });

    const updatedClub: ClubEntity = await service.updateMembersFromClub(
      club.id,
      [newMember],
    );
    expect(updatedClub.members.length).toBe(1);
    expect(updatedClub.members[0].username).toBe(newMember.username);
    expect(updatedClub.members[0].email).toBe(newMember.email);
    expect(updatedClub.members[0].birthdate).toBe(newMember.birthdate);
  });

  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const newMember: MemberEntity = await membersRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
    });

    await expect(() =>
      service.updateMembersFromClub('0', [newMember]),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('updateMembersFromClub should throw an exception for an invalid member', async () => {
    const newMember: MemberEntity = membersList[0];
    newMember.id = '0';

    await expect(() =>
      service.updateMembersFromClub(club.id, [newMember]),
    ).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('deleteMemberFromClub should delete a member from a club', async () => {
    const member: MemberEntity = membersList[0];

    await service.deleteMemberFromClub(club.id, member.id);

    const storedClub = await clubsRepository.findOne({
      where: { id: club.id },
      relations: ['members'],
    });
    const deletedMember = storedClub.members.find((m) => m.id === member.id);

    expect(deletedMember).toBeUndefined();
  });

  it('deleteMemberFromClub should throw an exception for an invalid member', async () => {
    await expect(
      service.deleteMemberFromClub(club.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('deleteMemberFromClub should throw an exception for an invalid club', async () => {
    const member: MemberEntity = membersList[0];
    await expect(
      service.deleteMemberFromClub('0', member.id),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('deleteMemberFromClub should throw an exception for a non-associated member', async () => {
    const newMember: MemberEntity = await membersRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
    });

    await expect(() =>
      service.deleteMemberFromClub(club.id, newMember.id),
    ).rejects.toHaveProperty(
      'message',
      'The member with the given id is not associated to the club',
    );
  });
});
