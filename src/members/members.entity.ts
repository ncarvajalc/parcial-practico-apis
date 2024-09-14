import { ClubEntity } from '../clubs/clubs.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class MemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  birthdate: Date;

  @ManyToMany(() => ClubEntity, (club) => club.members)
  @JoinTable()
  clubs: ClubEntity[];
}
