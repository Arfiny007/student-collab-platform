import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  IsBoolean,
  IsNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";

const emptyToUndefined = ({ value }: { value: unknown }) =>
  value === "" || value === null ? undefined : value;

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(120)
  university?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(120)
  department?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(2000)
  skills?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsUrl({}, { message: "github must be a valid URL" })
  github?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsUrl({}, { message: "linkedin must be a valid URL" })
  linkedin?: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsUrl({}, { message: "portfolio must be a valid URL" })
  portfolio?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
