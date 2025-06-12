import z from "zod";
import { FileSchema } from "./users-schema";


const ISubService = z.object({
    id:z.number(),
    arDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
    enDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
    arDetails: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }).optional(),
    enDetails: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }).optional(),
    stopEnabled: z.boolean().default(false),
    subServiceImg:z.string().optional(),
    subServiceFile: FileSchema
});


const IEditSubService = z.object({
    id:z.number(),
    arDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
    enDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
    arDetails: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }).optional(),
    enDetails: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }).optional(),
    stopEnabled: z.boolean().default(false),
    subServiceImg:z.string().optional(),
    subServiceFile: FileSchema.optional()
});



const IAddService = z.object({
    arDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
    enDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }),
    stopEnabled: z.boolean().default(false),
    serviceFile: FileSchema,
    subServices: z.array(ISubService).min(1, { message: "errors.no_sub_services" })
});


const IPatchMainService = z.object({
    arDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }).optional(),
    enDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }).optional(),
    stopEnabled: z.boolean().optional(),
    serviceFile: FileSchema.optional(),
    serviceImg:z.string().optional(),
    subServices: z.array(ISubService).min(1, { message: "errors.no_sub_services" }).optional()
});

const IPatchSubService = z.object({
    arDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }).optional(),
    enDesc: z.string().min(1, { message: "errors.required_field" }).max(256, { message: "errors.max_length" }).optional(),
    arDetails: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }).optional(),
    enDetails: z.string().min(1, { message: "errors.required_field" }).max(500, { message: "errors.max_length" }).optional(),
    stopEnabled: z.boolean().optional(),
    SubServiceFile: FileSchema.optional()
});


export {
    IPatchMainService,
    IAddService,
    ISubService,
    IPatchSubService,
    IEditSubService
}