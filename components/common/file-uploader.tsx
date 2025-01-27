"use client";
import { FileSchema } from "@/lib/schemas/users-schema";
import { toBase64 } from "@/lib/utils/stuff-client";
import React from "react";
import { useDropzone } from "react-dropzone";
import z from "zod";
import { Label } from "../ui/label";
import useLocalizer from "@/lib/hooks/use-localizer";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Eye } from "lucide-react";

const baseStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "hsl(var(--secondary))",
};

const acceptStyle = {
  borderColor: "hsl(var(--primary))",
};

const rejectStyle = {
  borderColor: "hsl(var(--danger))",
};

export interface FileUploaderProps {
  label: string;
  multiple?: boolean;
  type?: "image" | "file" | "none";
  onChange?: (file: z.infer<typeof FileSchema>) => void,
  error?:string
  disabled?:boolean,
  path?:string
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  multiple = false,
  type = "image",
  path,
  ...props
}) => {
  const [files, setFiles] = React.useState<Array<File>>([]);

  const acceptProps =
    type == "file"
      ? {
          "application/pdf*": [".pdf"],
        }
      : type == "image"
      ? {
          "image/png": [".png", ".jpg", ".jpeg",".webp"],
        }
      : {
          "image/png": [".png", ".jpg", ".jpeg", ".webp"],
          "application/pdf*": [".pdf"],
        };

  const onDrop = async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    let fileBase64Result: string | undefined = undefined;
    let fileName: string | undefined = undefined;
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      fileName = file.name;
      fileBase64Result = await toBase64(file);
    }
    props?.onChange &&
      props.onChange({
        data: fileBase64Result,
        extension: fileName?.split(".").pop(),
      });
  };


  const hasFileBinding = React.useMemo((): boolean => {
    return files?.length > 0;
  }, [files]);
  
  const {isRtl} = useLocalizer();

  const {
    isFocused,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    onFileDialogCancel: () => {
        setFiles([]);
    },
    accept: acceptProps as any,
    multiple,
  });

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject || props?.error ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject,props?.error]
  );

  return (
    <div className="flex flex-col gap-4">
     {path && <div className="flex flex-row justify-between items-center">
      <Label>مسار الصورة</Label>
      <Link target="_blank" href={path ?? ''}>
        <Eye/>
      </Link>
      </div>}
    <div {...getRootProps({ style: style })} className={cn("h-20",props?.disabled == true && "pointer-events-none")}>
      <input {...getInputProps()} />
        <div className="flex flex-col gap-2 items-center justify-center w-full select-none">
        <Label>{label}</Label>
        {hasFileBinding && <p>{ acceptedFiles?.[0]?.name}</p>}
        {!hasFileBinding && <p className="text-sm text-primary">{isRtl?"السحب و الإفلات أو النقر":"Drag and drop or click"}</p>}
        </div>
    </div>
    </div>
  );
};

export default FileUploader;
