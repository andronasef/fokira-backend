import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get user public profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user public profile',
    type: UserResponseDto,
  })
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.findPublicProfile(id);
  }

  @Get('latest')
  async getLatestUsers() {
    return this.usersService.getLatestUsers();
  }
}
