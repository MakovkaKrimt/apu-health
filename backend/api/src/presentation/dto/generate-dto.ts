import { IsString } from 'class-validator';

export class GenerateDto {
  @IsString()
  extent: string;

  @IsString()
  projectAreaIsochrone: string;

  @IsString()
  polyclinicsIsochrone: string;

  @IsString()
  projectArea?: string;
}
