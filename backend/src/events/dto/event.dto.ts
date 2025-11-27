import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsEnum(['meeting', 'interview'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  stakeholder?: string;

  @IsString()
  @IsOptional()
  recruiterName?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
