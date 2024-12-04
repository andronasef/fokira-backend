import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, ValidateNested } from 'class-validator';

export class CreateSlideDto {
  @ApiProperty({
    description: 'The content of the slide (max 30 words)',
    maxLength: 150,
    example: 'This is a sample slide content with less than 30 words.',
  })
  @IsString()
  @MaxLength(150)
  content: string;
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Array of slides for the post',
    type: [CreateSlideDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlideDto)
  slides: CreateSlideDto[];
}
