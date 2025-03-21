import { IsString } from 'class-validator';

export class GeneratePresentationDto {
  @IsString()
  extent: string;

  @IsString()
  projectSite: string;

  @IsString()
  projectSiteData: string;

  @IsString()
  analysisData: string;
}
