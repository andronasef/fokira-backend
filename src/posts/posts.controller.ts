import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetUserPostsDto } from './dto/get-user-posts.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.id, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get('my-posts')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user posts' })
  @ApiResponse({ status: 200, description: 'Return user posts.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findUserPosts(@Req() req) {
    return this.postsService.findUserPosts(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({ status: 200, description: 'Return the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user posts with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated user posts',
  })
  async getUserPosts(
    @Param('userId') userId: string,
    @Query() query: GetUserPostsDto,
  ) {
    return this.postsService.getUserPosts(userId, query);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.postsService.remove(id, req.user.id);
  }
}
