import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Camera, Image, Upload, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AviatorImageUploaderProps {
  onImageUpload?: (file: File, base64: string) => void;
  onImageRemove?: () => void;
  className?: string;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const AviatorImageUploader: React.FC<AviatorImageUploaderProps> = ({
  onImageUpload,
  onImageRemove,
  className,
  imageUrl,
  size = 'md',
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28
  };

    React.useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('File input change event triggered');
    console.log('Files selected:', e.target.files);
    
    if (disabled) return;
    
    if (e.target.files && e.target.files[0]) {
      console.log('Processing file:', e.target.files[0].name);
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    console.log('handleFile called with:', file.name, file.type);
    
    if (file.type.startsWith('image/')) {
      console.log('Valid image file, creating preview and base64');
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const fullBase64String = e.target.result as string;
          const base64String = fullBase64String.split(',')[1];
          console.log('Image loaded successfully, setting preview and calling onImageUpload with base64');
          setImagePreview(fullBase64String);
          onImageUpload?.(file, base64String);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Invalid file type:', file.type);
    }
  };


  const handleClick = (e: React.MouseEvent) => {
    console.log('Uploader clicked, disabled:', disabled);
    console.log('File input ref:', fileInputRef.current);
    
    if (!disabled && fileInputRef.current) {
      console.log('Triggering file input click');
      fileInputRef.current.click();
    }
  };


  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Remove button clicked');
    setImagePreview(null);
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative rounded-full border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ",
          "",
          "shadow-lg hover:shadow-xl",
          sizeClasses[size],
          {
            "border-destructive/30 bg-destructive/50": dragActive,
            "border-slate-300": !dragActive && !imagePreview,
            "border-destructive/50": !dragActive && imagePreview,
            "opacity-50 cursor-not-allowed": disabled,
            "transform hover:scale-105": !disabled
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-full"
            />
            <div className={cn(
              "absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 rounded-full flex items-center justify-center",
              "group-hover:bg-opacity-30"
            )}>
              <div className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
              )}>
                <button
                  onClick={handleRemove}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
                  disabled={disabled}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 group-hover:text-blue-600 transition-colors duration-300">
            <div className={cn(
              "relative mb-2 transition-transform duration-300",
              isHovered && !disabled ? "transform scale-110" : ""
            )}>
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white p-3 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                {dragActive ? (
                  <Upload size={iconSizes[size]} className="text-blue-500" />
                ) : (
                  <Image size={iconSizes[size]} className="text-slate-500 group-hover:text-blue-500 transition-colors duration-300" />
                )}
              </div>
            </div>
            <div className="text-center">
              <p className={cn(
                "font-medium transition-colors duration-300",
                size === 'sm' ? "text-xs" : size === 'md' ? "text-sm" : "text-base"
              )}>
                {dragActive ? "Drop here" : "Upload photo"}
              </p>
              {size !== 'sm' && (
                <p className={cn(
                  "text-slate-400 group-hover:text-blue-400 transition-colors duration-300",
                  size === 'md' ? "text-xs" : "text-sm"
                )}>
                  Click or drag
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default AviatorImageUploader;