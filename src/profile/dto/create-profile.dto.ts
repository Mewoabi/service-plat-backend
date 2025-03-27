import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsMongoId, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateProfileDto implements Prisma.ProfileUncheckedCreateInput {
  @IsString({ message: "User ID must be a string" })
  @IsNotEmpty({ message: "User ID is required" })
  @IsMongoId({ message: "User ID must be a valid user ID" })
  userId: string;

  @IsOptional()
  @IsString({ message: "Bio must be a string" })
  @IsNotEmpty({ message: "Bio is required" })
  bio?: string;

  @IsOptional()
  @IsString({ message: "Mobile money number must be a string" })
  @IsNotEmpty({ message: "Mobile money number is required" })
  mobileMoneyNumber?: string;

  @IsOptional()
  @IsString({ message: "Bank account number must be a string" })
  @IsNotEmpty({ message: "Bank account number is required" })
  bankAccountNumber?: string;

  @IsOptional()
  @IsUrl({}, { message: "Invalid URL format" })
  @IsNotEmpty({ message: "National ID URL is required" })
  nationalIdUrl?: string;

  @IsOptional()
  @IsString({ message: "Location must be a string" })
  @IsNotEmpty({ message: "Location is required" })
  location?: string;
}

export class UpdateProfileDto extends PartialType(OmitType(CreateProfileDto, ['userId'] as const)) {}
