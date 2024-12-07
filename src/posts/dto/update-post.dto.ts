import {
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UpdateSlideDto {
  @ApiProperty()
  @IsString()
  content: string;
}

export class UpdatePostDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({ type: [UpdateSlideDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSlideDto)
  slides?: UpdateSlideDto[];
}
