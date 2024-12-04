import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, ValidateNested, ArrayMaxSize } from 'class-validator';

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
    description: 'The title of the post (max 100 characters)',
    maxLength: 100,
    example: 'This is a sample post title.',
  })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Array of slides for the post',
    type: [CreateSlideDto],
  })
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateSlideDto)
  slides: CreateSlideDto[];
}
