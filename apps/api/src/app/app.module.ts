import { MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from '../../config/config';
import { DatabaseConfig } from '../../config/database.config';
import { UserModule } from './user/user.module';
import { ContactusModule } from './contactus/contactus.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';
import { ProductModule } from './product/product.module';
import { CouponModule } from './coupon/coupon.module';
import { PurchaseModule } from './purchase/purchase.module';
import { FrontendMiddleware } from './shared/frontend.middleware';
const ENV = process.env.NODE_ENV;
import { ServeStaticModule } from '@nestjs/serve-static'; // <- INSERT LINE
import { join } from 'path'; // <- INSERT LINE

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Config],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*']
    }),
    UserModule,
    FileModule,
    CategoryModule,
    ProductModule,
    ContactusModule,
    CouponModule,
    PurchaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FrontendMiddleware)
      .forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
  }
}
