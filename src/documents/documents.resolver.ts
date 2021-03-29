import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DocumentService } from './documents.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { Documents } from './entities/documents.entity';
import {
  CreateDocumentInput,
  CreateDocumentOutput,
} from './dtos/create-document.dto';
import {
  AllDocumentsInput,
  AllDocumentsOutput,
} from '../documents/dtos/all-documents.dto';
import {
  DeleteDocumentInput,
  DeleteDocumentOutput,
} from './dtos/delete-document.dto';
import {
  EditDocumentInput,
  EditDocumentOutput,
} from './dtos/edit-document.dto';
import { GetDocumentInput, GetDocumentOutput } from './dtos/get-document.dto';

@Resolver(of => Documents)
export class DocumentResolver {
  constructor(private readonly documentsService: DocumentService) {}

  @Query(returns => AllDocumentsOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async allDocuments(
    @AuthUser() user: User,
    @Args('input') allDocumentsInput: AllDocumentsInput,
  ): Promise<AllDocumentsOutput> {
    return this.documentsService.allDocuments(user, allDocumentsInput);
  }

  @Query(returns => GetDocumentOutput)
  @Role(['CENSE', 'CEN', 'Distributor', 'Partner'])
  async getDocument(
    @AuthUser() user: User,
    @Args('input') getDocumentsInput: GetDocumentInput,
  ): Promise<GetDocumentOutput> {
    return this.documentsService.getDocument(user, getDocumentsInput);
  }

  @Mutation(returns => CreateDocumentOutput)
  @Role(['CENSE'])
  async createDocument(
    @AuthUser() writer: User,
    @Args('input') createDocumentInput: CreateDocumentInput,
  ): Promise<CreateDocumentOutput> {
    return this.documentsService.createDocument(writer, createDocumentInput);
  }

  @Mutation(returns => DeleteDocumentOutput)
  @Role(['CENSE'])
  async deleteDocument(
    @AuthUser() user: User,
    @Args('input') deleteDocumentInput: DeleteDocumentInput,
  ): Promise<DeleteDocumentOutput> {
    return this.documentsService.deleteDocument(user, deleteDocumentInput);
  }

  @Mutation(returns => EditDocumentOutput)
  @Role(['CENSE'])
  async editDocument(
    @AuthUser() user: User,
    @Args('input') editDocumentInput: EditDocumentInput,
  ): Promise<EditDocumentOutput> {
    return this.documentsService.editDocument(user, editDocumentInput);
  }
}
