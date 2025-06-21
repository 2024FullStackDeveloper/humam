import z from "zod";
const DocumentSchema = z.object({
    id:z.string().min(1,{message:"errors.required_field"}).max(256,{message:"errors.max_length"}),
    arDesc:z.string().min(1,{message:"errors.required_field"}).max(256,{message:"errors.max_length"}),
    enDesc:z.string().min(1,{message:"errors.required_field"}).max(256,{message:"errors.max_length"})
});


const UpdateGlobalSettingsSchema = z.object({
    otpLength:z.number().gt(0,{message:"errors.required_field"}),
    oldUserSessionsRemoveEnabled:z.boolean(),
    passwordMinLength:z.number().gt(0,{message:"errors.required_field"}),
    passwordMaxLength:z.number().gt(0,{message:"errors.required_field"}),
    complexPasswordEnabled:z.boolean(),
    misLoginCount:z.number().gt(0,{message:"errors.required_field"}),
    maxDistanceBetween:z.number().gt(0,{message:"errors.required_field"}),
    serviceProviderPercentage:z.number().gte(0,{message:"errors.required_field"}).lte(100,{message:"errors.unacceptable_value"}),
});


export {
    DocumentSchema,
    UpdateGlobalSettingsSchema
};
