import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
  MinLength,
} from 'class-validator';

export class CreateSlideDto {
  @ApiProperty({
    description: 'The content of the slide (min 1 word, max 30 words)',
    minLength: 1,
    maxLength: 150,
    example: 'This is a sample slide content with less than 30 words.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  content: string;
}

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post (required, max 100 characters)',
    maxLength: 100,
    example: 'This is a sample post title',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Array of slides for the post (at least 1 slide required)',
    type: [CreateSlideDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateSlideDto)
  slides: CreateSlideDto[];
}
