"use client";
import { ZodSchema } from "zod";
import { ValidationType } from "../types/common-type";
import { APIErrorFieldType } from "../types/api/api-type";
import '@/lib/extensions/string-extensions';

export function validateData<T>(schema: ZodSchema<T>, data: any):ValidationType{
    const result = schema.safeParse(data);
    const validationResult : ValidationType = {isValid:true};
    if (!result.success) {
        validationResult.isValid = false;
        validationResult.errorsList = result.error.flatten().fieldErrors;
    }
    return validationResult;
  };


 export function validateAPIErrors(errors? :Array<APIErrorFieldType> | null) : Map<String,String[]> | undefined{
    if(!errors) return undefined;
    let result : any  = {};
    try{
     for(const item of errors){
         let propName : String = '';
         if(item.propertyName?.includes(".")){
            propName =  item.propertyName?.split(".").reverse()[0]?.toLowerFirstLetter();
         }else{
            propName = item.propertyName?.toLowerFirstLetter();
         }
        if(!Object.hasOwn(result,propName as string) && item.errorMessage){
          result[`${propName}`] = [item.errorMessage];
        }else{
          if(item.errorMessage){
             result[`${propName}`] = [...result[`${propName}`],item.errorMessage]
           }
        }
     }
     return result;
   }catch{
      return undefined;
   }
  }
  