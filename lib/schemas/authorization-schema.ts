import z from "zod";
const LoginSchema = z.object({
    emailOrPhoneNumber:z.string().min(1,{message:"errors.required_field"}).max(256,{message:"errors.max_length"}),
    password:z.string().min(1,{message:"errors.required_field"}).max(256,{message:"errors.max_length"}),
    profileId:z.number().nullable()
});


const VerifyPhoneNumberSchema = z.object({
    phoneNumber:z.string().min(1,{message:"errors.required_field"}).max(20,{message:"errors.max_length"})
});

const ChangePasswordSchema = z.object({
    phoneNumber:z.string().min(1,{message:"errors.required_field"}).max(20,{message:"errors.max_length"}),
    otp:z.string().min(1,{message:"errors.required_field"}),
    newPassword:z.string().min(1,{message:"errors.required_field"}),
});


export {
    LoginSchema,
    VerifyPhoneNumberSchema,
    ChangePasswordSchema
};