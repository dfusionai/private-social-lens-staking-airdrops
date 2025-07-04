import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RewardJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
