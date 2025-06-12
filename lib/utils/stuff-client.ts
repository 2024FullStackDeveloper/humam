"use client";
import { ZodSchema } from "zod";
import { PaginateType, ValidationType } from "../types/common-type";
import { APIErrorFieldType, RoleTypes, SocialMediaType } from "../types/api/api-type";
import '@/lib/extensions/string-extensions';
import { RoleType } from "../types/api/role-type";

export function validateData<T>(schema: ZodSchema<T>, data: any): ValidationType {
  const result = schema.safeParse(data);
  const validationResult: ValidationType = { isValid: true };
  if (!result.success) {
    validationResult.isValid = false;
    validationResult.errorsList = result.error.flatten().fieldErrors;
  }
  return validationResult;
};


export function validateAPIErrors(errors?: Array<APIErrorFieldType> | null): Map<string, string[]> | undefined {
  if (!errors) return undefined;
  const result: any = {};
  try {
    for (const item of errors) {
      let propName: string = '';
      if (item.propertyName?.includes(".")) {
        propName = item.propertyName?.split(".").reverse()[0]?.toLowerFirstLetter();
      } else {
        propName = item.propertyName?.toLowerFirstLetter();
      }
      if (!Object.hasOwn(result, propName as string) && item.errorMessage) {
        result[`${propName}`] = [item.errorMessage];
      } else {
        if (item.errorMessage) {
          result[`${propName}`] = [...result[`${propName}`], item.errorMessage]
        }
      }
    }
    return result;
  } catch {
    return undefined;
  }
}

export function toBase64(file: File , split:boolean = true): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {resolve(split ? (reader.result as string).split(",")[1]: (reader.result as string))}
    reader.onerror = (error) => reject(error)
  })
}


export function getFileName(fileWithExtension: string) {
  if (fileWithExtension) {
    const parts = fileWithExtension?.split(".");
    return parts?.length > 0 ? parts[0] : undefined;
  }
  return undefined;
}


export function getPaginateQuery(query?: URLSearchParams): PaginateType | undefined {
  if (!query) return undefined;

  const result: PaginateType = { paginate: false, size: 0, page: 0 };
  try {
    if (query?.get("paginate")) {
      result.paginate = query.get("paginate") == "true" ? true : false;
    }
    if (result.paginate) {
      if (query?.get("size")) {
        result.size = parseInt(query.get("size") ?? "0")
      }

      if (query?.get("page")) {
        result.page = parseInt(query.get("page") ?? "0")
      }
    }
    return result;
  } catch {
    return undefined;
  }
}


export function getRoleTypeNumber(role:RoleType):RoleTypes{
  switch(role){
    case "admin":return RoleTypes.admin;
    case "organization":return RoleTypes.organization;
    case "worker": return RoleTypes.worker;
    case "client": return RoleTypes.client;
  }
}


export function getSocialMediaNameFromType(isRtl :boolean,  mediaType:SocialMediaType):string{
  switch (mediaType) {
    case SocialMediaType.facebook:
      return isRtl ? "فيسبوك" : "Facebook";
    case SocialMediaType.instagram:
      return isRtl ? "إنستغرام" : "Instagram";
    case SocialMediaType.x:
      return isRtl ? "إكس" : "X";
    case SocialMediaType.gmail:
      return  isRtl ? "جيميل" : "Gmail";
    case SocialMediaType.youTube:
      return isRtl ? "يوتيوب" : "YouTube";
    case SocialMediaType.linkedIn:
    return isRtl ? "لينكد إن" : "LinkedIn";
    default:
      return "Unknown";
  }
}


export function convertFiletimeToDate(fileTime: bigint | number): Date {
    // Convert to bigint if it's a number to ensure proper handling of large values
    const fileTimeBigInt = typeof fileTime === 'number' ? BigInt(fileTime) : fileTime;
    
    // FILETIME is in 100-nanosecond intervals (10^-7 seconds)
    // Convert to milliseconds (10^-3 seconds) by dividing by 10,000
    const millisecondsBigInt = fileTimeBigInt / BigInt(10000);
    
    // Convert to a number (note: this may lose precision for very large bigints)
    const milliseconds = Number(millisecondsBigInt);
    
    // The Windows epoch is January 1, 1601 (UTC) which is 11644473600000 milliseconds
    // before the Unix epoch (January 1, 1970 UTC)
    const windowsEpoch = 11644473600000;
    
    // Create a JavaScript Date (Unix epoch)
    return new Date(milliseconds - windowsEpoch);
}


export function dateToFileTime(date: Date): bigint {
    // The number of 100-nanosecond intervals between Jan 1, 1601 and Jan 1, 1970
    const EPOCH_DIFFERENCE = BigInt("116444736000000000");
    
    // Get the time in milliseconds since Jan 1, 1970
    const msSince1970 = date.getTime();
    
    // Convert to 100-nanosecond intervals and add the epoch difference
    return EPOCH_DIFFERENCE + BigInt(msSince1970) * BigInt(10000);
}
