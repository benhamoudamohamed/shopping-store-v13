import { ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { AuthDto } from '../shared/authDto.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivatePayload } from '../shared/activate-payload';
import { sendEmail } from '../shared/sendEmail';
import { v4 as uuidv4 } from 'uuid';
import { CustomJwtPayload } from '../shared/jwt-payload';
import * as bcryptjs from 'bcryptjs';
import { Activatetoken, AuthType, ResetPasswordType, Tokens } from '@shoppingstore/api-interfaces';

@Injectable()
export class UserService {

  private logger = new Logger('UserService')

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService) {

  }

  // Start findAllUsers
  async findAllUsers(data): Promise<User[]> {
    const {role} = data
    const users = await this.userRepository
      .createQueryBuilder("user")
      .where("user.userRole IN(:...ids)", { ids: [role] })
      .orderBy('user.created', 'DESC')
      .getMany()

    try {
      this.logger.log(`🟩 findAllUsers successfully`);
      return users;
    }
    catch (error) {
      this.logger.error(`🟥 findAllUsers catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // Start findAllUsers

 // Start findAllbyPagination
  async findAllbyPagination(options: IPaginationOptions, roles: any): Promise<Pagination<User>> {
  const {role} = roles
  const queryBuilder = this.userRepository
  .createQueryBuilder("user")
  .where("user.userRole IN(:...id)", { id: [role] })
  .orderBy('user.created', 'DESC')

  try {
    this.logger.log(`🟩 findAllUsers byPagination successfully`);
    return paginate<User>(queryBuilder, options);

  } catch (error) {
    this.logger.error(`🟥 findAllUsers byPagination catch Error: ${error}`)
    throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }
  // End findAllbyPagination

  // Start findbyId
  async findbyId(id: string): Promise<User>  {
    const user = await this.userRepository.findOne({where: {id}});
    if(!user) {
      this.logger.error(`🟥 user not found with id: ${id}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findOne user successfully with id: ${id}`);
      return user;
    }
    catch (error) {
      this.logger.error(`🟥 findOne user catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // End findbyId

  // Start findByName
  async findByName(fullname: string): Promise<User>  {
    const user = await this.userRepository.findOne({where: {fullname}});

    if(!user) {
      this.logger.error(`user not found with firstname: ${fullname}`);
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findByName user successfully with: ${fullname}`);
      return user;
    }
    catch (error) {
      this.logger.error(`🟥 findByName user catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // End findByName

  // Start findbyMail
  async findbyMail(email: string): Promise<User>  {
    const user = await this.userRepository.findOne({where: {email}});
    if(!user) {
      this.logger.error(`🟥 user not found with email: ${email}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findbyMail user successfully with email: ${email}`);
      return user;
    }
    catch (error) {
      this.logger.error(`🟥 findbyMail user catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // End findbyMail

  // Start login + refreshTokens
  async login(data: AuthType): Promise<Tokens> {
    const user: User = await this.userRepository
      .createQueryBuilder("user")
      .where("user.email like :email", { email:`%${data.email}%` })
      .addSelect("user.password")
      .getOne()

    if (!user) {
      this.logger.error(`login call: Invalid credentials: email: ${data.email}, userPass: ${data.password}`);
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcryptjs.compare(data.password, user.password);

    if (!isMatch) {
      this.logger.error(`login call: Invalid credentials: email: ${data.email}, userPass: ${data.password}`);
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    if(user.isActivated) {
      const payload: CustomJwtPayload = { id: user.id, email: user.email, fullname: user.fullname, userRole: user.userRole };

      try {
        const subject = 'تسجيل الدخول';
        const header = 'تسجيل الدخول';
        const title = 'تم تسجيل الدخول إلى حسابك على مقرأة تحفيظ القرأن بهذا البريد. نرسل إليك هذا البريد للتحقق من هويتك';
        const subtitle = 'إذا كنت تعتقد أن هذا خطأ، يرجى التحقق أو مراسلة الإدارة';
        const buttonTitle = 'مراسلة الإدارة';
        const origin = this.configService.get('ORIGIN');
        const link = 'api/contactadmin/'
        const userId = ''
        const verificationCode = ''

        const tokens = await this.getTokens(payload)
        await this.updateRthash(user.id, tokens.refreshToken)
        await sendEmail(subject, user.email, user.fullname, header, title, subtitle, verificationCode, origin, link, userId, buttonTitle)
        this.logger.log(`✅ Login Successfully from user: ${user.email}`);
        return tokens;
      }
      catch(error) {
        this.logger.error(`login catch error: ${error}`);
        throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    else {
      this.logger.error(`login call: Email Not Activated: ${data.email}, userPass: ${data.password}`);
      throw new HttpException({status: HttpStatus.NOT_ACCEPTABLE, error: 'البريد الإلكتروني غير مفعّل', }, HttpStatus.NOT_ACCEPTABLE);
    }
  }
  async refreshTokens(id: string, rt: string): Promise<Tokens> {
    const user: User = await this.userRepository
      .createQueryBuilder("user")
      .where("id IN(:...ids)", { ids: [id] })
      .addSelect("user.refreshToken")
      .getOne()

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const isMatch = await bcryptjs.compare(rt, user.refreshToken);

    if(!isMatch) {
      this.logger.error(`refreshTokens call error, isMatch: ${isMatch}`);
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    const payload: CustomJwtPayload = { id: user.id, email: user.email, fullname: user.fullname, userRole: user.userRole };
    const tokens = await this.getTokens(payload)
    await this.updateRthash(user.id, tokens.refreshToken)

    try {
      this.logger.log(`✅ refreshTokens call Successfully from user: ${user.email}`);
      return {accessToken: '', refreshToken: tokens.refreshToken} ;
    }
    catch(error) {
      this.logger.error(`🟥 refreshTokens call catch error: ${error}`);
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getTokens(payload: CustomJwtPayload): Promise<Tokens> {
    const atoptions = {secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('EXPIRES_IN_T')}
    const rtoptions = {secret: this.configService.get('JWT_SECRET'), expiresIn: this.configService.get('EXPIRES_IN_RT')}

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, atoptions),
      this.jwtService.signAsync(payload, rtoptions)
    ])

    return {
      accessToken: at,
      refreshToken: rt
    }
  }
  async updateRthash(id: string, rt: string) {
    const user = await this.findbyId(id)
    const newUser = new User();
    newUser.refreshToken = await this.hashData(rt);

    try {
      await this.userRepository.update(user.id, {...newUser});
      Logger.log(`🟩 updateRthash called successfully for ${user.email}`);
    }
    catch(error) {
      this.logger.error(`updateRthash error for ${user.email}: ${error}`);
    }
  }
  // End login + refreshTokens

  // Start register
  async register(data: CreateUserDto): Promise<User> {
    const { fullname, email, password, userRole } = data;
    let user = new User();
    user.fullname = fullname;
    user.email = email;
    user.password = await this.hashData(password);
    user.userRole = userRole;

    const payload = {email: user.email};
    const token = await this.getActivationToken(payload)

    const subject = 'تسجيل المستخدم';
    const header = 'تسجيل المستخدم';
    const title = 'يرجى تفعيل بريدك الإلكتروني من خلال النقر على الرابط أدناه';
    const subtitle = 'مدة صلاحية الرابط 48 ساعة بعد فتحه على المتصفح، عند انتهاء المدة يلغى الحساب وعليك التسجيل من جديد';
    const buttonTitle = 'إضغط';
    const origin = this.configService.get('ORIGIN');
    const link = `activation/${token.activatetoken}`
    const userId = ''
    const verificationCode = ''

    try {
      await this.userRepository.save(user);
      try {
        await sendEmail(subject, user.email, user.fullname, header, title, subtitle, verificationCode, origin, link, userId, buttonTitle)
      }catch(error) {
        throw new HttpException({status: HttpStatus.NOT_ACCEPTABLE, error: 'mail sent rejected',}, HttpStatus.NOT_ACCEPTABLE);
      }
      this.logger.log(`✅ register user successfully with ${user.email}`);
      const id = user.id
      user = await this.userRepository.findOne({ where: {id}});
      return user;
    } catch(error) {
      this.logger.error(`🟥 register user catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'البريد الإلكتروني موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }
  async getActivationToken(payload: ActivatePayload): Promise<Activatetoken> {
    const activateOption = {secret: this.configService.get('JWT_SECRET_ACTIVATION'), expiresIn: this.configService.get('EXPIRES_IN_ACTIVATION')}
    return {
      activatetoken: this.jwtService.sign(payload, activateOption),
    };
  }
  // End register

  // Start activate Email
  async activateEmail(token: Activatetoken): Promise<User> {
    const email = await this.decodeConfirmationToken(token)
    if(email === 'Expired' || email === 'Deleted') {
      this.logger.error(`🟥 user is deleted after token expiration time`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'انتهت صلاحية هذا الرابط، الرجاء إعادة التسجيل وتفعيل الرابط قبل إنتهاء الوقت المخصص(48 ساعة)',}, HttpStatus.NOT_FOUND);
    }
    const activation = await this.markEmailAsActivated(email.email);
    return activation;
  }
  async decodeConfirmationToken(token: Activatetoken) {
    try {
      const payload = await this.jwtService.verify(token.activatetoken, {secret: this.configService.get('JWT_SECRET_ACTIVATION')});
      const email = payload.email
      const user = await this.userRepository.findOne({ where: {email}});
      if(!user) {
        this.logger.error(`decodeConfirmationToken; user is deleted for activation timeout`);
        return 'Deleted';
      } else {
        this.logger.log(`🟩 decodeConfirmationToken successfully`);
        return payload;
      }
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        this.logger.error(`🟥 decodeConfirmationToken catch token expired: ${error}`)
        return 'Expired';
      }
      this.logger.error(`🟥 decodeConfirmationToken catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: `خطأ داخلي حاول لاحقا`,}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async markEmailAsActivated(email: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: {email}});
    if(user.isActivated) {
      this.logger.error(`🟥 Email already activated: ${user.email}`)
      throw new HttpException({status: HttpStatus.FORBIDDEN, error: `لقد تم تفعيل البريد الإلكتروني الخاص بك`,}, HttpStatus.FORBIDDEN);
    }
    else {
      const user1 = new User();
      user1.isActivated = true;

      const subject = 'تفعيل البريد الإلكتروني';
      const header = 'تفعيل البريد الإلكتروني';
      const title = 'لقد تم تفعيل البريد الإلكتروني الخاص بك';
      const subtitle = '';
      const buttonTitle = 'تسجيل الدخول';
      const origin = this.configService.get('ORIGIN');
      const link = 'login'
      const userId = ''
      const verificationCode = ''

      try {
        await this.userRepository.update({ email }, {...user1});
        await sendEmail(subject, user.email, user.fullname, header, title, subtitle, verificationCode, origin, link, userId, buttonTitle)
        this.logger.log(`🟩 markEmailAsActivated successfully for: ${user.email}`);
        user = await this.userRepository.findOne({ where: {email}});
        return user;
      }
      catch (error) {
        this.logger.error(`🟥 markEmailAsActivated catch Error: ${error}`)
        throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  // End activate Email

  // Start updateName
  async updateName(id: string, fullname: string): Promise<User> {
    const user = await this.findbyId(id)
    const newUser = new User();
    newUser.fullname = fullname;

    const subject = 'تحديث المعطيات';
    const header = 'تحديث المعطيات';
    const title = "لقد قمت بتحديث ملف المعطيات الخاص بك";
    const subtitle = 'إذا كنت تعتقد أن هذا خطأ، يرجى التحقق أو مراسلة الإدارة';
    const buttonTitle = 'تسجيل الدخول';
    const origin = this.configService.get('ORIGIN');
    const link = 'login'
    const userId = ''
    const verificationCode = ''

    try {
      await this.userRepository.update(user.id, {...newUser});
      await sendEmail(subject, user.email, fullname, header, title, subtitle, verificationCode, origin, link, userId, buttonTitle)
      this.logger.log(`🟩 update user successfully for: ${user.email}`);
      return await this.findbyId(id);
    }
    catch (error) {
      this.logger.error(`🟥 update user catch Error: ${error}`)
      throw new InternalServerErrorException(error)
    }
  }
  // End updateName

  // Start resetPassowrd
  async sendVerificationCode(email: string): Promise<User> {
    const user = await this.userRepository.findOne({where: {email}});
    if(!user) {
      this.logger.error(`user not found with email: ${email}`);
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    if(user.isActivated) {
      const verificationCode = uuidv4();
      const newUser = new User();
      newUser.verificationCode = await this.hashData(verificationCode);

      const subject = 'محاولة تغيير كلمة المرور';
      const header = 'محاولة تغيير كلمة المرور';
      const title = 'لقد أرسلنا لك رمز التحقق هذا لمتابعة تغيير كلمة المرور الخاصة بك';
      const subtitle = 'إذا كنت تعتقد أن هذا خطأ، يرجى التحقق أو مراسلة الإدارة';
      const buttonTitle = 'إضغط';
      const origin = this.configService.get('ORIGIN');
      const link = 'api/contactadmin/'
      const userId = ''

      try {
        await this.userRepository.update({ email }, {...newUser});
        await sendEmail(subject, user.email, user.fullname, header, title, subtitle, verificationCode, origin, link, userId, buttonTitle)
        this.logger.log(`🟩 sendVerificationCode user successfully with: ${email}`);
        return user;
      }
      catch (error) {
        this.logger.error(`🟥 sendVerificationCode user catch Error: ${error}`)
        throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    else {
      this.logger.error(`sendVerificationCode call: Email Not Activated: ${user.email}, userPass: ${user.password}`);
      throw new HttpException({status: HttpStatus.NOT_ACCEPTABLE, error: 'البريد الإلكتروني غير مفعّل', }, HttpStatus.NOT_ACCEPTABLE);
    }
  }
  async verifyCode(data: ResetPasswordType): Promise<User> {
    const {email, code} = data
    const user: User = await this.userRepository
      .createQueryBuilder("user")
      .where("user.email like :email", { email:`%${email}%` })
      .addSelect("user.verificationCode")
      .getOne()

    if(!user) {
      this.logger.error(`🟥 user not found with email: ${email}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcryptjs.compare(code, user.verificationCode);

    if (!isMatch) {
      this.logger.error(`resetPassowrd call: Invalid credentials: user: ${email}`);
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    try {
      this.logger.log(`✅ verifyCode Successfully from user: ${user.email}`);
      return user;
    }
    catch(error) {
      this.logger.error(`verifyCode catch error: ${error}`);
      throw new InternalServerErrorException(error)
    }
  }
  async resetPassowrd(data: AuthDto): Promise<User> {
    const { email, password } = data;

    let user: User = await this.userRepository
      .createQueryBuilder("user")
      .where("email IN(:...ids)", { ids: [email] })
      .addSelect("user.verificationCode")
      .addSelect("user.password")
      .getOne()

    if(!user) {
      this.logger.error(`🟥 user not found with email: ${email}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    const user1 = new User();
    user1.password = await this.hashData(password);

    const subject = 'تغيير كلمة السر';
    const header = 'تم تغيير كلمة السر';
    const title = 'تم تغيير كلمة مرور تسجيل الدخول الخاصة بك';
    const subtitle = 'إذا كنت تعتقد أن هذا خطأ، يرجى التحقق أو مراسلة الإدارة';
    const buttonTitle = 'مراسلة الإدارة';
    const origin = this.configService.get('ORIGIN');
    const link = 'api/contactadmin/'
    const userId = ''
    const verificationCode = ''

    try {
      await this.userRepository.update({ email }, {...user1});
      await sendEmail(subject, email, user.fullname, header, title, subtitle, verificationCode, origin, link, userId, buttonTitle)
      user = await this.userRepository.findOne({ where: {email}});
      this.logger.log(`🟩 resetPassowrd successfully for: ${email}`);
      return user;
    }
    catch (error) {
      this.logger.error(`🟥 resetPassowrd catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // End resetPassowrd

  // Start logout
  async logout(id: string) {
    const user = await this.findbyId(id)
    const newUser = new User();
    newUser.refreshToken = null
    try {
      await this.userRepository.update(user.id, {...newUser});
      Logger.log(`🟩 logout called successfully from ${user.email}`);
    }
    catch(error) {
      this.logger.error(`logout catch error: ${error}`);
      throw new InternalServerErrorException(error)
    }
  }
  // End logout

  // Start delete
  async delete(id: string): Promise<User> {
    const user = await this.findbyId(id)
    try {
      await this.userRepository.delete(user.id)
      this.logger.log(`🟩 delete user successfully with email: ${user.email}`);
      return user;
    }
    catch (error) {
      this.logger.error(`🟥 delete catch Error: ${error}`)
      throw new InternalServerErrorException(error)
    }
  }
  // End delete

  // Helper Method
  async hashData(data: string) {
    return bcryptjs.hash(data, await bcryptjs.genSalt());
  }
}
