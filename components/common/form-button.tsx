"use client";
import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "../ui/button";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
const FormButton = ({
  className,
  variant = "default",
  title,
  disabled = false
}: VariantProps<typeof buttonVariants> & { title: string , className?:string , disabled? : boolean}) => {
  const {pending} = useFormStatus();
  return <Button type="submit" className={className} variant={variant} disabled={pending || disabled}>{title}{pending && <LoaderCircle className="animate-spin" />}</Button>;
};
export default FormButton;
