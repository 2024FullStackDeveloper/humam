import { z } from "zod";

const FileSchema = z.object({
data:z.string().min(1,{message: "errors.required_field"}).optional(),
extension:z.string().min(1,{message: "errors.required_field"}).optional(),
});

const UserSchema = z.object({
    phoneNumber: z.string().min(1,{message: "errors.required_field"}).max(15,{message: "errors.max_length"}),
    email: z.string().email({message: "errors.invalid_email"}).max(256,{message: "errors.max_length"}).optional(),
    fullName:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}),
    role:z.number(),
    addionalData:z.object({
        cityId:z.number().optional(),
        identityType:z.number().optional(),
        identityNumber:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}).optional(), 
        identityFile:FileSchema.optional(),
        organizationName:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}).optional(),
        crNumber:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}).optional(),
        crNumberFile:FileSchema.optional(),
        mainServices:z.array(z.number()).optional(),
        personFile:FileSchema.optional(),
    }).optional(),
}).superRefine((props,context)=>{
    switch(props.role){
        //مدير
        case 4:
            if(!props?.email){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["email"],
                    message: "errors.required_field",
                });
            }
        break;
        //مهني
        case 2:
            if(!props?.addionalData?.cityId){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["cityId"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.mainServices){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["mainServices"],
                    message: "errors.required_services",
                });
            }

            if(props?.addionalData?.mainServices && props?.addionalData?.mainServices?.length > 1){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["mainServices"],
                    message: "errors.only_one_service",
                });
            }
            if(!props?.addionalData?.identityType){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityType"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityNumber){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityNumber"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityFile){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityFile"],
                    message: "errors.required_field",
                });
            }

            if(!props?.addionalData?.personFile){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["personFile"],
                    message: "errors.required_field",
                });
            }
        break;

        //شركة
        case 3:
            if(!props?.email){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["email"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.cityId){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["cityId"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityType){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityType"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.mainServices){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["mainServices"],
                    message: "errors.required_services",
                });
            }
            if(!props?.addionalData?.identityNumber){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityNumber"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityFile){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityFile"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.organizationName){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["organizationName"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.crNumber){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["crNumber"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.crNumberFile){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["crNumberFile"],
                    message: "errors.required_field",
                });
            }
        break;
    }
});

const UpdateUserSchema = z.object({
    email: z.string().email({message: "errors.invalid_email"}).max(256,{message: "errors.max_length"}).optional(),
    fullName:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}).optional(),
    role:z.number(),
    addionalData:z.object({
        cityId:z.number().optional(),
        identityType:z.number().optional(),
        identityNumber:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}).optional(), 
        identityFile:FileSchema.optional(),
        identityFileUrl:z.string().nullable().optional(),
        organizationName:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}).optional(),
        crNumber:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}).optional(),
        crNumberFile:FileSchema.optional(),
        crNumberFileUrl:z.string().nullable().optional(),
        mainServices:z.array(z.number()).optional(),
        personFile:FileSchema.optional(),
        personFileUrl:z.string().nullable().optional(),
    }).optional(),
}).superRefine((props,context)=>{
    switch(props.role){
        //مدير
        case 4:
            if(!props?.email){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["email"],
                    message: "errors.required_field",
                });
            }
        break;
        //مهني
        case 2:
            if(!props?.addionalData?.cityId){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["cityId"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.mainServices){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["mainServices"],
                    message: "errors.required_services",
                });
            }

            if(props?.addionalData?.mainServices && props?.addionalData?.mainServices?.length > 1){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["mainServices"],
                    message: "errors.only_one_service",
                });
            }
            if(!props?.addionalData?.identityType){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityType"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityNumber){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityNumber"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityFile && !props?.addionalData?.identityFileUrl){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityFile"],
                    message: "errors.required_field",
                });
            }

            if(!props?.addionalData?.personFile && !props?.addionalData?.identityFileUrl){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["personFile"],
                    message: "errors.required_field",
                });
            }
        break;
        //شركة
        case 3:
            if(!props?.email){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["email"],
                    message: "errors.required_field",
                });
            }

            if(!props?.addionalData?.cityId){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["cityId"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityType){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityType"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.mainServices){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["mainServices"],
                    message: "errors.required_services",
                });
            }
            if(!props?.addionalData?.identityNumber){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityNumber"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.identityFile && !props?.addionalData?.identityFileUrl){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["identityFile"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.organizationName){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["organizationName"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.crNumber){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["crNumber"],
                    message: "errors.required_field",
                });
            }
            if(!props?.addionalData?.crNumberFile && !props?.addionalData?.crNumberFileUrl){
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    path:["crNumberFile"],
                    message: "errors.required_field",
                });
            }
        break;
    }
});;



const IPatchUserInfoSchema = z.object({
    fullName:z.string().min(1,{message: "errors.required_field"}).max(256,{message: "errors.max_length"}), 
    email:z.string().email({message: "errors.invalid_email"}).max(256,{message: "errors.max_length"}).optional(),
    personFile: FileSchema.optional(),   
});

export {
    FileSchema,
    UserSchema,
    UpdateUserSchema,
    IPatchUserInfoSchema
}