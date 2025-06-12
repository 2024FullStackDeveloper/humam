import z from "zod";
import { FileSchema } from "./users-schema";
import { convertFiletimeToDate } from "../utils/stuff-client";

const IAddAdsSchema = z.object({
    arTitle:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }),
    enTitle:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }),
    arContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).optional(),
    enContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).optional(),
    endExclusiveTimeStamp:z.number().optional().superRefine((val,ctx)=>{
        if(val){
           if(convertFiletimeToDate(val) <= new Date(Date.now())){
                ctx.addIssue({
                code:z.ZodIssueCode.custom,
                message:"errors.unacceptable_value",
                path: ["endExclusiveTimeStamp"]
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
    thumbnailFile: FileSchema.optional(),
    showInMainSlider:z.boolean().default(false),
    showInSubSlider:z.boolean().default(false),
    stopEnabled:z.boolean().default(false),
    serviceProviders:z.array(z.number()).optional()
});



const IPatchAdsSchema = z.object({
    arTitle:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }).optional(),
    enTitle:z.string().min(1,{message:"errors.required_field"}).max(256, { message: "errors.max_length" }).optional(),
    arContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).nullable().optional(),
    enContent:z.string().min(1,{message:"errors.required_field"}).max(1000, { message: "errors.max_length" }).nullable().optional(),
    endExclusiveTimeStamp:z.number().nullable().optional().superRefine((val,ctx)=>{
        if(val){
           if(convertFiletimeToDate(val) <= new Date(Date.now())){
                ctx.addIssue({
                code:z.ZodIssueCode.custom,
                message:"errors.unacceptable_value",
                path: ["endExclusiveTimeStamp"]
            })
           } 
        }
    }),
    endTimeStamp:z.number().nullable().optional().superRefine((val,ctx)=>{
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
    thumbnailFile: FileSchema.optional(),
    showInMainSlider:z.boolean().default(false),
    showInSubSlider:z.boolean().default(false),
    stopEnabled:z.boolean().default(false),
    serviceProviders:z.array(z.number()).optional()
});

export {
    IAddAdsSchema,
    IPatchAdsSchema
};
