import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ApplyTaskDto {
  @ApiProperty({
    example:
      'I have 3 years of experience with Tailwind CSS and would love to help you with this task.',
    description: 'Cover letter explaining why you are a good fit for the task',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  coverLetter: string;
}