import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MemberDto } from './member.dto';
import { MemberEntity } from './members.entity';
import { MembersService } from './members.service';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @Get()
  async findAll() {
    return await this.memberService.findAll();
  }

  @Get(':memberId')
  async findOne(@Param('memberId') memberId: string) {
    return await this.memberService.findOne(memberId);
  }

  @Post()
  async create(@Body() memberDto: MemberDto) {
    const member = plainToInstance(MemberEntity, memberDto);
    return await this.memberService.create(member);
  }

  @Put(':memberId')
  async update(
    @Param('memberId') memberId: string,
    @Body() memberDto: MemberDto,
  ) {
    const member = plainToInstance(MemberEntity, memberDto);
    return await this.memberService.update(memberId, member);
  }

  @Delete(':memberId')
  @HttpCode(204)
  async delete(@Param('memberId') memberId: string) {
    return await this.memberService.delete(memberId);
  }
}
