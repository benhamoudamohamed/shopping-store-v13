import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Param, Delete, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '../shared/user.decorator';
import { CurrentRefreshToken } from '../shared/currentRT.decorator';
import { RequestWithUser } from '../shared/requestWithUser.interface';
import { User } from './entities/user.entity';
import { RolesGuard } from '../shared/rolesGuard';
import { Roles } from '../shared/roles.decorator';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthDto } from '../shared/authDto.model';
import { CustomAuthGuard } from '../shared/auth.guard';
import { Activatetoken, AuthType, ResetPasswordType, Tokens, UserRole } from '@shoppingstore/api-interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CustomAuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  findAllUsers(@Query() data) {
    return this.userService.findAllUsers(data);
  }

  // @UseGuards(CustomAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAllbyPagination(@Query('page') page = 1, @Query('size') limit = 20, @Query() roles): Promise<Pagination<User>> {
    return this.userService.findAllbyPagination({page, limit, route: 'http://localhost:3333/api/user'}, roles);
  }

  // @UseGuards(CustomAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findbyId(@Param('id') id: string) {
    return this.userService.findbyId(id);
  }

  @Post('findByName')
  @HttpCode(HttpStatus.OK)
  findByName(@Body() user: User): Promise<User> {
    return this.userService.findByName(user.fullname);
  }

  @Post('findbyemail')
  @HttpCode(HttpStatus.OK)
  findbyMail(@Body() user: User): Promise<User> {
    return this.userService.findbyMail(user.email);
  }

  @UseGuards(CustomAuthGuard)
  @Get('find/whoami')
  @HttpCode(HttpStatus.OK)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  // @UseGuards(CustomAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: AuthType): Promise<Tokens>  {
    return this.userService.login(data);
  }

  @Post('activation')
  @HttpCode(HttpStatus.CREATED)
  activateEmail(@Body() activatetoken: Activatetoken)  {
   return this.userService.activateEmail(activatetoken);
  }

  @UseGuards(CustomAuthGuard)
  @Put('updatename/:id')
  @HttpCode(HttpStatus.CREATED)
  updateName(@Param('id') id: string, @Body() data: User): Promise<User> {
    return this.userService.updateName(id, data.fullname);
  }

  @Post('sendVerificationCode')
  @HttpCode(HttpStatus.OK)
  sendVerificationCode(@Body() user: User): Promise<User> {
    return this.userService.sendVerificationCode(user.email);
  }

  @Post('verifyCode')
  @HttpCode(HttpStatus.CREATED)
  verifyCode(@Body() data: ResetPasswordType): Promise<User> {
    return this.userService.verifyCode(data);
  }

  @Post('resetPassowrd')
  @HttpCode(HttpStatus.CREATED)
  resetPassowrd(@Body() data: AuthDto): Promise<User> {
    return this.userService.resetPassowrd(data);
  }

  @UseGuards(CustomAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  refreshTokens(@CurrentUser('id') userId: string, @CurrentRefreshToken('refreshToken') refreshToken: string) {
   return this.userService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(CustomAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() request: RequestWithUser) {
    return this.userService.logout(request.user.id);
  }

  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }
}
