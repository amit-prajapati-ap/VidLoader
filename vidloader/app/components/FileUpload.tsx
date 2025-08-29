"use client"

import {
  upload,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void
  onProgress?: (progress: number) => void
  fileType?: "image" | "video"
}

const FileUpload = ({
  onSuccess,
  onProgress,
  fileType
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file");
      }
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size should be less than 100MB");
    }

    return true
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file || !validateFile(file)) return

    setUploading(true)
    setError(null)

    try {
      const authRes = await fetch("/api/auth/imagekit-auth")
      const auth = await authRes.json()

      const response = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        onProgress: (progress) => {
          if (progress.lengthComputable && onProgress) {
            const percent = (progress.loaded / progress.total) * 100
            onProgress(Math.round(percent))
          }
        }
      })

      onSuccess(response)
    } catch (error) {
      console.log("Error uploading file", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input type="file" accept={fileType === "video" ? "video/*" : "image/*"} onChange={handleFileChange} />
      {uploading && <p>Uploading...</p>}
    </>
  );
};

export default FileUpload;