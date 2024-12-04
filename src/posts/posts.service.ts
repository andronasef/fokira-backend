import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private getWordCount(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  private calculateDuration(content: string): number {
    const wordCount = this.getWordCount(content);
    return Math.ceil(wordCount / 5) * 2000; // duration in milliseconds
  }

  private validateSlideContent(content: string, index: number) {
    const wordCount = this.getWordCount(content);
    if (wordCount === 0) {
      throw new BadRequestException(
        `Slide ${index + 1} content must contain at least 1 word`,
      );
    }
    if (wordCount > 30) {
      throw new BadRequestException(
        `Slide ${index + 1} content must not exceed 30 words`,
      );
    }
  }

  async create(userId: string, createPostDto: CreatePostDto) {
    // Validate title
    if (!createPostDto.title?.trim()) {
      throw new BadRequestException('Title is required');
    }

    if (createPostDto.title.length > 100) {
      throw new BadRequestException('Title must not exceed 100 characters');
    }

    // Validate slides
    if (!createPostDto.slides?.length) {
      throw new BadRequestException('At least one slide is required');
    }

    // Validate each slide's content
    createPostDto.slides.forEach((slide, index) => {
      this.validateSlideContent(slide.content, index);
    });

    return this.prisma.post.create({
      data: {
        title: createPostDto.title.trim(),
        authorId: userId,
        slides: {
          create: createPostDto.slides.map((slide, index) => ({
            content: slide.content.trim(),
            order: index,
            duration: this.calculateDuration(slide.content),
          })),
        },
      },
      include: {
        slides: {
          orderBy: {
            order: 'asc',
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        slides: {
          orderBy: {
            order: 'asc',
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: {
            order: 'asc',
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async findUserPosts(userId: string) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        slides: {
          orderBy: {
            order: 'asc',
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        id,
        authorId: userId,
      },
    });

    if (!post) {
      throw new BadRequestException(
        'Post not found or you do not have permission to delete it',
      );
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
