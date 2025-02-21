import { UploadService } from './upload.service';
import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth-guard';

@ApiTags('Upload Image')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const publicUrl = await this.uploadService.uploadFile(file);
    await this.uploadService.updateProfileImage(req.user.userId, publicUrl);
    return { imageUrl: publicUrl };
  }
}
