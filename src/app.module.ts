import { Module } from '@nestjs/common';
// @ts-ignore 
import {UserModule} from './user/User.Module'

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
