import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET;

  constructor(private prisma: PrismaService) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileKey = `uploads/${uuid()}${fileExtension}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    };

    await this.s3.send(
      new PutObjectCommand({ ...uploadParams, ACL: 'public-read-write' }),
    );

    // Return the **public URL** instead of file key
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  async updateProfileImage(userId: string, imageUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar_url: imageUrl },
    });
  }
}
