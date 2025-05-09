"use client";
import { ZodSchema } from "zod";
import { PaginateType, ValidationType } from "../types/common-type";
import { APIErrorFieldType, RoleTypes } from "../types/api/api-type";
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

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve((reader.result as string).split(",")[1])
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
