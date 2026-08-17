import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Alice Smith', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;
}
