import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { writeFile } from 'fs/promises';

@Injectable()
export class UploadService {
  async uploadFile(logo: any): Promise<string> {
    // Navigate out of src folder and into the company_logos folder
    console.log('Reached', logo);

    const uploadPath = join(__dirname, '..', '..', 'company_logos', logo);
    await writeFile(uploadPath, logo.buffer);
    return uploadPath;
  }
}
