import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentResolver } from './documents.resolver';
import { DocumentService } from './documents.service';
import { DocumentFiles } from './entities/document-files.entity';
import { Documents } from './entities/documents.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documents, DocumentFiles])],
  providers: [DocumentResolver, DocumentService],
})
export class DocumentsModule {}
