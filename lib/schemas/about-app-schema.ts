import z from "zod";

const UpdateAboutAppSchema = z.object({
    arContent:z.string().min(1,{message:"errors.required_field"}),
    enContent:z.string().min(1,{message:"errors.required_field"}),
});


export {
    UpdateAboutAppSchema,
};
