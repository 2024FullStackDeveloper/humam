import { z } from "zod";

const IAddCommonQuestionsSchema = z.object({
arQuestion: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
enQuestion: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
arAnswer: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }),
enAnswer: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }),
});


const IEditCommonQuestionsSchema = z.object({
arQuestion: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
enQuestion: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
arAnswer: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }),
enAnswer: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }),
});

export {
    IAddCommonQuestionsSchema,
    IEditCommonQuestionsSchema
}