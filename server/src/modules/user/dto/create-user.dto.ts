import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(
    6,
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()

  @Matches(
    /^[0-9+\-\s()]+$/,
  )
  phone?: string;
}