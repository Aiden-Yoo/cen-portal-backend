import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoResolver } from './demos.resolver';
import { DemoService } from './demos.service';
import { Demo } from './entities/demo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Demo])],
  providers: [DemoService, DemoResolver],
})
export class DemosModule {}
