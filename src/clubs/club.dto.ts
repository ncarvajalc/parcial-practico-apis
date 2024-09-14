import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class ClubDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsISO8601()
  readonly foundationDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly image: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
