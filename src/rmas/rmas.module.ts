import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rma } from './entities/rma.entity';
import { RmaResolver } from './rmas.resolver';
import { RmaService } from './rmas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rma])],
  providers: [RmaService, RmaResolver],
})
export class RmasModule {}
