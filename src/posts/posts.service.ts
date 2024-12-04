import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // Calculate duration based on word count (approximately 2 seconds per 5 words)
  private calculateDuration(content: string): number {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 5) * 2000; // duration in milliseconds
  }

  async create(userId: string, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        authorId: userId,
        slides: {
          create: createPostDto.slides.map((slide, index) => ({
            content: slide.content,
            order: index,
            duration: this.calculateDuration(slide.content),
          })),
        },
      },
      include: {
        slides: true,
        author: true,
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
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        slides: {
          orderBy: {
            order: 'asc',
          },
        },
        author: true,
      },
    });
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
        author: true,
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
      return null;
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }
}
