import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsModule } from './clubs/clubs.module';
import { MembersModule } from './members/members.module';
import { ClubsMembersModule } from './clubs-members/clubs-members.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'clubs',
      entities: ['dist/**/*.entity{.ts,.js}'],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ClubsModule,
    MembersModule,
    ClubsMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
