import z from "zod";
import { FileSchema } from "./users-schema";
import { convertFiletimeToDate } from "../utils/stuff-client";

const IAddOfferSchema = z.object({
    arDesc:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }),
    enDesc:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }),
    discountRate:z.number({required_error:"errors.required_field"}).min(1,{message:"errors.unacceptable_value"}).max(100,{message:"errors.unacceptable_value"}),
    arContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).optional(),
    enContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).optional(),
    startTimeStamp:z.number().superRefine((val,ctx)=>{
        if(val){
           if(convertFiletimeToDate(val) <= new Date(Date.now())){
                ctx.addIssue({
                code:z.ZodIssueCode.custom,
                message:"errors.unacceptable_value",
                path: ["startTimeStamp"]
            })
           } 
        }
    }),
    endTimeStamp:z.number().superRefine((val,ctx)=>{
        if(val){
           if(convertFiletimeToDate(val) <= new Date(Date.now())){
                ctx.addIssue({
                code:z.ZodIssueCode.custom,
                message:"errors.unacceptable_value",
                path: ["endTimeStamp"]
            })
           } 
        }
    }),
    backgroundFile: FileSchema,
    includeSpares:z.boolean().default(false),
    includeTransportation:z.boolean().default(false),
    stopEnabled:z.boolean().default(false),
})



const IPatchOfferSchema = z.object({
    arDesc:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }).optional(),
    enDesc:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }).optional(),
    discountRate:z.number({required_error:"errors.required_field"}).min(1,{message:"errors.unacceptable_value"}).max(100,{message:"errors.unacceptable_value"}).optional(),
    arContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).optional(),
    enContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).optional(),
    startTimeStamp:z.number().optional().superRefine((val,ctx)=>{
        if(val){
           if(convertFiletimeToDate(val) <= new Date(Date.now())){
                ctx.addIssue({
                code:z.ZodIssueCode.custom,
                message:"errors.unacceptable_value",
                path: ["startTimeStamp"]
            })
           } 
        }
    }),
    endTimeStamp:z.number().optional().superRefine((val,ctx)=>{
        if(val){
           if(convertFiletimeToDate(val) <= new Date(Date.now())){
                ctx.addIssue({
                code:z.ZodIssueCode.custom,
                message:"errors.unacceptable_value",
                path: ["endTimeStamp"]
            })
           } 
        }
    }),
    backgroundFile: FileSchema.optional(),
    includeSpares:z.boolean().default(false),
    includeTransportation:z.boolean().default(false),
    stopEnabled:z.boolean().default(false),
})


export {
 IAddOfferSchema,
 IPatchOfferSchema
}