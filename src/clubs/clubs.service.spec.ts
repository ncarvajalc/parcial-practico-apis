import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEntity } from './clubs.entity';
import { ClubsService } from './clubs.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ClubsService', () => {
  let service: ClubsService;
  let clubsRepository: Repository<ClubEntity>;
  let clubsList: ClubEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubsService],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    clubsRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await clubsRepository.clear();
    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: ClubEntity = await clubsRepository.save({
        name: faker.company.name(),
        foundationDate: faker.date.past(),
        image: faker.image.url(),
        description: faker.lorem.sentence(10),
      });
      clubsList.push(club);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: '',
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.url(),
      description: faker.lorem.sentence(10),
      members: [],
    };

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await clubsRepository.findOneBy({
      id: newClub.id,
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(newClub.name);
  });

  it('create should throw an exception for description exceeding 100 characters', async () => {
    const club: ClubEntity = {
      id: '',
      name: faker.company.name(),
      foundationDate: faker.date.past(),
      image: faker.image.url(),
      description: faker.lorem.sentence(50),
      members: [],
    };

    await expect(service.create(club)).rejects.toHaveProperty(
      'message',
      'The description surpasses the maximum length of 100 characters',
    );
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubsList[0];
    club.name = 'New Club Name';

    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: ClubEntity = await clubsRepository.findOneBy({
      id: club.id,
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual('New Club Name');
  });

  it('update should throw an exception for description exceeding 100 characters', async () => {
    const club: ClubEntity = clubsList[0];
    club.description = faker.lorem.sentence(50);

    await expect(service.update(club.id, club)).rejects.toHaveProperty(
      'message',
      'The description surpasses the maximum length of 100 characters',
    );
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubsList[0];
    club = {
      ...club,
      name: 'New name',
      description: 'New description',
    };
    await expect(() => service.update('0', club)).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('findAll should return all clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const club: ClubEntity = clubsList[0];
    const foundClub: ClubEntity = await service.findOne(club.id);
    expect(foundClub).not.toBeNull();
    expect(foundClub.name).toEqual(club.name);
  });

  it('findOne should throw an exception for an invalid club id', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubsList[0];
    await service.delete(club.id);

    const deletedClub: ClubEntity = await clubsRepository.findOneBy({
      id: club.id,
    });
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club id', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'The club with the given id was not found',
    );
  });
});
