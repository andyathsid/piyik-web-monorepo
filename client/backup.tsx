"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  X, 
  FileIcon, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Maximize2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileWithPreview extends File {
  preview?: string;
  customName?: string;
  prediction?: {
    isFertile: boolean;
    confidence: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [selectedImage, setSelectedImage] = useState<FileWithPreview | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const startingIndex = files.length;
    const newFiles = acceptedFiles.map((file, index) => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        customName: `Foto ${startingIndex + index + 1}`
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
    setUploadStatus("idle");
    setUploadProgress(0);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  });

  const removeFile = (file: FileWithPreview) => {
    setFiles(files => {
      const updatedFiles = files.filter(f => f !== file);
      return updatedFiles.map((f, index) => ({
        ...f,
        customName: `Foto ${index + 1}`
      }));
    });
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  };

  const simulateUpload = async () => {
    setUploadStatus("uploading");
    
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate API predictions
    const updatedFiles = files.map(file => ({
      ...file,
      prediction: {
        isFertile: Math.random() > 0.5,
        confidence: Math.random() * 100,
        boundingBox: {
          x: Math.random() * 20,
          y: Math.random() * 20,
          width: 60 + Math.random() * 20,
          height: 60 + Math.random() * 20,
        }
      }
    }));

    setFiles(updatedFiles);
    setUploadStatus("success");
  };

  const handleImageClick = (file: FileWithPreview) => {
    setSelectedImage(file);
  };

  const handleDownload = async (file: FileWithPreview) => {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = file.preview || '';
      link.download = file.name; // Set the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-16 text-center cursor-pointer
                transition-colors duration-200 ease-in-out
                ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
                ${files.length > 0 ? "border-primary/50" : ""}
              `}
            >
              <input {...getInputProps()} />
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragActive ? 1.02 : 1 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <Upload className="h-16 w-16 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-medium">
                    {isDragActive ? "Drop your images here" : "Drag & drop your images here"}
                  </p>
                  <p className="text-lg text-muted-foreground mt-2">
                    or click to browse (JPEG, PNG up to 10MB)
                  </p>
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-6">
                  {files.map((file) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        "flex gap-6 p-4 border rounded-lg transition-colors duration-300",
                        file.prediction && (
                          file.prediction.isFertile 
                            ? "bg-green-500/10 border-green-500/20" 
                            : "bg-red-500/10 border-red-500/20"
                        )
                      )}
                    >
                      <div className="relative w-1/2 group">
                        <div 
                          className="aspect-video relative rounded-md overflow-hidden cursor-pointer"
                          onClick={() => handleImageClick(file)}
                        >
                          {file.preview ? (
                            <>
                              <Image
                                src={file.preview}
                                alt={file.customName || file.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                              {file.prediction?.boundingBox && (
                                <div 
                                  className={cn(
                                    "absolute border-2 rounded-sm",
                                    file.prediction.isFertile ? "border-green-500" : "border-red-500"
                                  )}
                                  style={{
                                    left: `${file.prediction.boundingBox.x}%`,
                                    top: `${file.prediction.boundingBox.y}%`,
                                    width: `${file.prediction.boundingBox.width}%`,
                                    height: `${file.prediction.boundingBox.height}%`,
                                  }}
                                />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </>
                          ) : (
                            <FileIcon className="h-8 w-8" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-lg font-medium">{file.customName}</p>
                          <p className="text-sm text-muted-foreground truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {file.prediction && (
                            <div className="mt-2">
                              <p className={cn(
                                "text-sm font-medium",
                                file.prediction.isFertile ? "text-green-500" : "text-red-500"
                              )}>
                                {file.prediction.isFertile ? "Fertile" : "Not Fertile"}
                                <span className="text-muted-foreground">
                                  {" "}({file.prediction.confidence.toFixed(1)}%)
                                </span>
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {uploadStatus !== "idle" && (
                            <Progress value={uploadProgress} className="h-2" />
                          )}
                          <div className="flex items-center gap-2">
                            {uploadStatus === "success" && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {uploadStatus === "error" && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(file)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {files.length > 0 && uploadStatus === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Button 
                  className="w-full text-lg py-6" 
                  onClick={simulateUpload}
                >
                  Analyze {files.length} {files.length === 1 ? 'Image' : 'Images'}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{selectedImage?.customName}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full">
            {selectedImage?.preview && (
              <>
                <Image
                  src={selectedImage.preview}
                  alt={selectedImage.customName || selectedImage.name}
                  fill
                  className="object-contain"
                />
                {selectedImage.prediction?.boundingBox && (
                  <div 
                    className={cn(
                      "absolute border-2 rounded-sm",
                      selectedImage.prediction.isFertile ? "border-green-500" : "border-red-500"
                    )}
                    style={{
                      left: `${selectedImage.prediction.boundingBox.x}%`,
                      top: `${selectedImage.prediction.boundingBox.y}%`,
                      width: `${selectedImage.prediction.boundingBox.width}%`,
                      height: `${selectedImage.prediction.boundingBox.height}%`,
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div>
              {selectedImage?.prediction && (
                <p className={cn(
                  "text-sm font-medium",
                  selectedImage.prediction.isFertile ? "text-green-500" : "text-red-500"
                )}>
                  {selectedImage.prediction.isFertile ? "Fertile" : "Not Fertile"}
                  <span className="text-muted-foreground">
                    {" "}({selectedImage.prediction.confidence.toFixed(1)}%)
                  </span>
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={() => selectedImage && handleDownload(selectedImage)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}