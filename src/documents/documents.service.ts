import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AllDocumentsInput,
  AllDocumentsOutput,
} from '../documents/dtos/all-documents.dto';
import {
  CreateDocumentInput,
  CreateDocumentOutput,
} from './dtos/create-document.dto';
import {
  DeleteDocumentInput,
  DeleteDocumentOutput,
} from './dtos/delete-document.dto';
import {
  EditDocumentInput,
  EditDocumentOutput,
} from './dtos/edit-document.dto';
import { GetDocumentInput, GetDocumentOutput } from './dtos/get-document.dto';
import { DocumentFiles } from './entities/document-files.entity';
import { Documents } from './entities/documents.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Documents)
    private readonly documents: Repository<Documents>,
    @InjectRepository(DocumentFiles)
    private readonly documentFiles: Repository<DocumentFiles>,
  ) {}

  canWriter(user: User, document: Documents): boolean {
    let canSee = false;
    if (user.role === UserRole.CENSE || document.writerId === user.id) {
      canSee = true;
    }
    return canSee;
  }

  canCompany(user: User, document: Documents): boolean {
    let canSee = false;
    if (
      user.role === UserRole.CENSE ||
      document.writer.company === user.company
    ) {
      canSee = true;
    }
    return canSee;
  }

  async allDocuments(
    user: User,
    { page, take }: AllDocumentsInput,
  ): Promise<AllDocumentsOutput> {
    try {
      let documents: Documents[];
      let totalResults: number;
      if (user.role === UserRole.CENSE) {
        [documents, totalResults] = await this.documents.findAndCount({
          // where: {
          //   locked: false,
          // },
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['writer', 'files'],
        });
      } else {
        [documents, totalResults] = await this.documents.findAndCount({
          where: {
            // locked: false,
            writer: user,
          },
          skip: (page - 1) * take,
          take,
          order: { id: 'DESC' },
          relations: ['writer', 'files'],
        });
      }
      return {
        ok: true,
        documents,
        totalPages: Math.ceil(totalResults / take),
        totalResults,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 불러올 수 없습니다.',
      };
    }
  }

  async getDocument(
    user: User,
    { id: documentId }: GetDocumentInput,
  ): Promise<GetDocumentOutput> {
    try {
      const document = await this.documents.findOne(documentId, {
        relations: ['writer', 'files'],
      });
      if (!document) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      // if (!this.canCompany(user, document) || user.role !== UserRole.CENSE) {
      //   return {
      //     ok: false,
      //     error: '소속 포스트만 볼 수 있습니다.',
      //   };
      // }
      return {
        ok: true,
        document,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 불러올 수 없습니다.',
      };
    }
  }

  async createDocument(
    writer: User,
    createDocumentInput: CreateDocumentInput,
  ): Promise<CreateDocumentOutput> {
    try {
      const document = await this.documents.save(
        this.documents.create({
          writer,
          ...createDocumentInput,
        }),
      );
      if (createDocumentInput.files.length !== 0) {
        createDocumentInput.files.map(async file => {
          console.log(file);
          await this.documentFiles.save(
            this.documentFiles.create({
              document,
              path: file.path,
            }),
          );
        });
      }

      return {
        document,
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '포스트를 생성할 수 없습니다.',
      };
    }
  }

  async deleteDocument(
    user: User,
    { documentId }: DeleteDocumentInput,
  ): Promise<DeleteDocumentOutput> {
    try {
      const document = await this.documents.findOne(documentId);
      if (!document) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (user.role !== UserRole.CENSE) {
        if (document.writerId !== user.id) {
          return {
            ok: false,
            error: '본인이 작성한 포스트만 삭제할 수 있습니다.',
          };
        }
      }
      await this.documents.softDelete(documentId);
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '포스트를 삭제할 수 없습니다.',
      };
    }
  }

  async editDocument(
    user: User,
    { documentId, content, files, kind, locked, title }: EditDocumentInput,
  ): Promise<EditDocumentOutput> {
    try {
      const document = await this.documents.findOne(documentId);
      if (!document) {
        return {
          ok: false,
          error: '포스트를 찾을 수 없습니다.',
        };
      }
      if (!this.canWriter(user, document)) {
        return {
          ok: false,
          error: '작성자만 수정할 수 있습니다.',
        };
      }
      if (files) {
        await this.documentFiles.delete({ document });
        files.map(async file => {
          await this.documentFiles.save(
            this.documentFiles.create({
              document,
              path: file.path,
            }),
          );
        });
      }
      await this.documents.save({
        id: documentId,
        content,
        kind,
        locked,
        title,
      });
      return { ok: true };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '포스트를 수정할 수 없습니다.',
      };
    }
  }
}
