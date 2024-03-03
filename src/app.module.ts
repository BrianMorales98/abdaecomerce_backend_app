import { Module } from '@nestjs/common';
import {UserModule} from '../src/user/user.Module'

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
