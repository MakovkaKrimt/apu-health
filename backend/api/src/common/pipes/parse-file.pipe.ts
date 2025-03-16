import { ParseFilePipe, PipeTransform } from '@nestjs/common';

export class ParseFilesPipe
  extends ParseFilePipe
  implements PipeTransform<Express.Multer.File[]>
{
  async transform(
    files: Express.Multer.File[] | { [key: string]: Express.Multer.File[] },
  ) {
    for (const file of Object.values(files).flat()) await super.transform(file);

    return files;
  }
}
