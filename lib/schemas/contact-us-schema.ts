import z from "zod";

const IAddContactUsSchema = z.object({
    phoneNumber: z.string().min(1, { message: "errors.required_field" }).max(15, { message: "errors.max_length" })
});

export {
    IAddContactUsSchema
}