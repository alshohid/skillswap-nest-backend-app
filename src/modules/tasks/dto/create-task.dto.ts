import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Need help with Next.js styling',
    description: 'Title of the task/skill request',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'I need someone to help me style my Next.js dashboard with Tailwind CSS. Must have experience with responsive design.',
    description: 'Detailed description of what help is needed',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 30,
    description: 'Skill points offered as reward for completing the task',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  pointsOffered: number;
}
