import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

interface FileUploadProps{
  onChange: (url?: string) => void;
  value?: string;
  endpoint: "imageUploader" | "messageAttachmentUploader";
}

export const FileUpload = ({onChange,value,endpoint} : FileUploadProps) => {
  if (value){
    const ft = value.split(".").pop();
    if (ft !== "pdf"){
      return <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
        />

        <button onClick={() => onChange("")} className="bg-gray-800 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm">
          <X className="h-5 w-5"/>
        </button>
      </div>;
    }
  }

  return <UploadDropzone
    endpoint={endpoint}
    onClientUploadComplete={
      (res) => {
        onChange(res?.[0].url);
      }
    }
    onUploadError={
      (error: Error) => {
        console.log(error);
      }
    }
  />;
};