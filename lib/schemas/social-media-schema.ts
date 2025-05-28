import z from "zod";
export const ISocialMediaSchema = z.object({
  socialMediaTypeId: z.number({required_error:"errors.required_field"}),
  url: z.string().min(1, {message:"errors.required_field"}).max(256, {message:"errors.max_length"}),
});


export const IEditSocialMediaSchema = z.object({
  url: z.string().min(1, {message:"errors.required_field"}).max(256, {message:"errors.max_length"}),
});