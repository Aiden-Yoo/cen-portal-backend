import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './uploads.utils';

@Controller('uploads')
export class UploadsController {
  // @Post('')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: editFileName,
  //     }),
  //     // fileFilter: imageFileFilter,
  //   }),
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   const response = {
  //     originalname: file.originalname,
  //     filename: file.filename,
  //   };
  //   return response;
  // }

  @Post('firmwares')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './uploads/firmwares',
        filename: editFileName,
      }),
    }),
  )
  uploadFirmwareFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const response = [];
    files.forEach(file => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileResponse);
    });
    return response;
  }

  @Post('documents')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: editFileName,
      }),
    }),
  )
  uploadDocumentFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const response = [];
    files.forEach(file => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileResponse);
    });
    return response;
  }

  @Post('issues')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './uploads/issues',
        filename: editFileName,
      }),
      // fileFilter: imageFileFilter,
    }),
  )
  uploadIssueFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const response = [];
    files.forEach(file => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileResponse);
    });
    return response;
  }

  @Get('firmwares/:path')
  seeFirmwareFile(@Param('path') file, @Res() res) {
    return res.sendFile(file, { root: './uploads/firmwares' });
  }

  @Get('documents/:path')
  seeDocumentFile(@Param('path') file, @Res() res) {
    return res.sendFile(file, { root: './uploads/documents' });
  }

  @Get('issues/:path')
  seeIssueFile(@Param('path') file, @Res() res) {
    return res.sendFile(file, { root: './uploads/issues' });
    // try {
    //   if (file.match(/\.(jpg|jpeg|png|gif)$/)) {
    //     return res.sendFile(file, { root: './uploads' });
    //   }
    //   return res.status(500).json({
    //     statusCode: 400,
    //     message: `Cannot GET /uploads/${file}`,
    //     error: 'Not Found',
    //   });
    // } catch (error) {
    //   return res.status(500).json({ error });
    // }
  }
}
