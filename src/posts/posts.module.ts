import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeNotice } from './entities/home-notice.entity';
import { PostResolver } from './posts.resolver';
import { PostService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([HomeNotice])],
  providers: [PostResolver, PostService],
})
export class PostsModule {}
