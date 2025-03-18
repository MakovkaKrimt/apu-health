import { IsString } from 'class-validator';

export class CreateAnalysisDto {
  @IsString()
  projectAreaIsochrone: string;

  @IsString()
  polyclinicsIsochrone: string;
}
