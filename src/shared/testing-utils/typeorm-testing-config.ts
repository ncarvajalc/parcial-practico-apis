import { ClubEntity } from '../../clubs/clubs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from '../../members/members.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([MemberEntity, ClubEntity]),
];
