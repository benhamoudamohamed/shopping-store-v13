import { Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { unlinkSync, existsSync,  } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Roles } from '../shared/roles.decorator';
import { RolesGuard } from '../shared/rolesGuard';
import { CustomAuthGuard } from '../shared/auth.guard';
import { UserRole } from '@shoppingstore/api-interfaces';

@Controller('upload')
export class FileController {
  private logger = new Logger('FileController')

  @Get(':fileName')
  async getOneFile(@Param('fileName') file: Express.Multer.File, @Res() res: any) {
    try {
      this.logger.log(`🟩 get UploadedFile successfully`);
      return await res.sendFile(file, { root: './upload' });
    } catch (error) {
      this.logger.error(`🟥 get UploadedFile catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('single')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
      filename: function (req, file, cb) {
        const existingFile = existsSync(`./upload/${file.originalname}`)
        if(existingFile) {
          cb(new HttpException(`${file.originalname} :الصورة موجودة في قاعدة البيانات`, HttpStatus.BAD_REQUEST), null);
          return null;
        }
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          cb(new HttpException(`${extname(file.originalname)} :نوع الملف خاطئ`, HttpStatus.BAD_REQUEST), null);
          return null;
        }
        cb(null, uuidv4() + '_' + file.originalname)
      }
    }),
    limits: { fileSize: 1 * 1024 * 1024}
  }))
  async uploadSingleFile(@UploadedFile() file: Express.Multer.File, @Res() res: any) {
    try {
      this.logger.log(`🟩 Post uploadedFile successfully`);
      return await res.send(file)
    } catch (error) {
      this.logger.error(`🟥 Post uploadedFile catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('multiple')
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'High', maxCount: 1 },
      { name: 'Low', maxCount: 1 }
    ],
    {
      storage: diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          const existingFile = existsSync(`./upload/${file.originalname}`)
          if(existingFile) {
            cb(new HttpException(`${file.originalname} :الصورة موجودة في قاعدة البيانات`, HttpStatus.BAD_REQUEST), null);
            return null;
          }
          if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new HttpException(`${extname(file.originalname)} :نوع الملف خاطئ`, HttpStatus.BAD_REQUEST), null);
            return null;
          }
          cb(null, uuidv4() + '_' + file.originalname)
        }
      }),
      limits: { fileSize: 1 * 1024 * 1024}
    }
  ))
  async uploadMultipleFiles(@UploadedFiles() files: {High?: Express.Multer.File[], Low?: Express.Multer.File[]}, @Res() res: any) {
    try {
      this.logger.log(`🟩 Post uploadedFile successfully`);
      return await res.send(files)
    } catch (error) {
      this.logger.error(`🟥 Post uploadedFile catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':fileName')
  deleteSingleFile(@Param('fileName') file: Express.Multer.File, @Res() res: any) {
    try {
      this.logger.log(`🟩 delete UploadedFile successfully`);
      unlinkSync(`./upload/${file}`);
      res.status(200);
      return res.send('تم حذف الملف بنجاح');
    } catch (error) {
      this.logger.error(`🟥 delete UploadedFile catch Error: ${error}`)
      res.status(404);
      return res.send('الملف غير موجود');
    }
  }

  @UseGuards(CustomAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':High/:Low')
  deleteMultipleFiles(@Param('High') High: Express.Multer.File, @Param('Low') Low: Express.Multer.File, @Res() res: any) {
    try {
      this.logger.log(`🟩 delete Uploaded File successfully`);
      unlinkSync(`./upload/${High}`);
      unlinkSync(`./upload/${Low}`);
      res.status(200);
      return res.send('تم حذف الملف بنجاح');
    } catch (error) {
      this.logger.error(`🟥 delete UploadedFile catch Error: ${error}`)
      res.status(404);
      return res.send('الملف غير موجود');
    }
  }
}
