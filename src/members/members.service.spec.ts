import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberEntity } from './members.entity';
import { MembersService } from './members.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('MembersService', () => {
  let service: MembersService;
  let repository: Repository<MemberEntity>;
  let membersList: MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MembersService],
    }).compile();

    service = module.get<MembersService>(MembersService);
    repository = module.get<Repository<MemberEntity>>(
      getRepositoryToken(MemberEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    membersList = [];
    for (let i = 0; i < 5; i++) {
      const member: MemberEntity = await repository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.past(),
      });
      membersList.push(member);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new member', async () => {
    const member: MemberEntity = {
      id: '',
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past(),
      clubs: [],
    };

    const newMember: MemberEntity = await service.create(member);
    expect(newMember).not.toBeNull();

    const storedMember: MemberEntity = await repository.findOneBy({
      id: newMember.id,
    });
    expect(storedMember).not.toBeNull();
    expect(storedMember.username).toEqual(newMember.username);
  });

  it('create should throw an exception for invalid email', async () => {
    const member: MemberEntity = {
      id: '',
      username: faker.internet.userName(),
      email: 'invalidemail.com',
      birthdate: faker.date.past(),
      clubs: [],
    };

    await expect(service.create(member)).rejects.toHaveProperty(
      'message',
      'The email is invalid',
    );
  });

  it('update should modify a member', async () => {
    const member: MemberEntity = membersList[0];
    member.username = 'NewUsername';

    const updatedMember: MemberEntity = await service.update(member.id, member);
    expect(updatedMember).not.toBeNull();

    const storedMember: MemberEntity = await repository.findOneBy({
      id: member.id,
    });
    expect(storedMember).not.toBeNull();
    expect(storedMember.username).toEqual('NewUsername');
  });

  it('update should throw an exception for invalid email', async () => {
    const member: MemberEntity = membersList[0];
    member.email = 'invalidemail.com';

    await expect(service.update(member.id, member)).rejects.toHaveProperty(
      'message',
      'The email is invalid',
    );
  });

  it('update should throw an exception for an invalid member', async () => {
    let member: MemberEntity = membersList[0];
    member = {
      ...member,
      username: 'New name',
    };
    await expect(() => service.update('0', member)).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('findOne should return a member by id', async () => {
    const member: MemberEntity = membersList[0];
    const foundMember: MemberEntity = await service.findOne(member.id);
    expect(foundMember).not.toBeNull();
    expect(foundMember.username).toEqual(member.username);
  });

  it('findOne should throw an exception for an invalid member id', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });

  it('findAll should return all members', async () => {
    const members: MemberEntity[] = await service.findAll();
    expect(members).not.toBeNull();
    expect(members).toHaveLength(membersList.length);
  });

  it('delete should remove a member', async () => {
    const member: MemberEntity = membersList[0];
    await service.delete(member.id);

    const deletedMember: MemberEntity = await repository.findOneBy({
      id: member.id,
    });
    expect(deletedMember).toBeNull();
  });

  it('delete should throw an exception for an invalid member id', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'The member with the given id was not found',
    );
  });
});
