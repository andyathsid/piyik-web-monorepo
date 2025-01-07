'use client';

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
  Download,
  Maximize2,
  Plus,
  Trash2,
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Egg,
  Minimize2,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileWithPreview extends File {
  preview?: string;
  analyzing?: boolean;
  annotatedPreview?: string;
  results?: {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: 'fer' | 'unf';
    class_id: number;
    detection_id: string;
  }[];
}

export function ImageUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDropzoneCollapsed, setIsDropzoneCollapsed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FileWithPreview | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const duplicateFiles = acceptedFiles.filter(newFile => 
      files.some(existingFile => existingFile.name === newFile.name)
    );

    if (duplicateFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Duplicate files detected",
        description: `${duplicateFiles.map(f => f.name).join(", ")} ${duplicateFiles.length === 1 ? "has" : "have"} already been uploaded.`,
      });

      const uniqueFiles = acceptedFiles.filter(newFile => 
        !files.some(existingFile => existingFile.name === newFile.name)
      );

      if (uniqueFiles.length === 0) return;

      const newFiles = uniqueFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      
      setFiles(prev => [...prev, ...newFiles]);
    } else {
      const newFiles = acceptedFiles.map(file => 
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, [files, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  });

  const analyzeImages = async () => {
    if (files.some(f => f.results)) {
      toast({
        variant: "destructive", 
        title: "Already analyzed",
        description: "Please clear results first before analyzing new images"
      });
      return;
    }

    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No images",
        description: "Please upload images before analyzing"
      });
      return;
    }

    setAnalyzing(true);
    setIsDropzoneCollapsed(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`
        });
        continue;
      }

      setFiles(prev => prev.map((f, index) => 
        index === i ? { ...f, analyzing: true } : f
      ));

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('http://localhost:5000/api/detect-eggs', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.formData();
        const resultBlob = data.get('result');
        const imageBlob = data.get('image');

        if (!resultBlob || !imageBlob) {
          throw new Error('Missing data in response');
        }

        const resultJson = JSON.parse(resultBlob as string);
        const annotatedUrl = URL.createObjectURL(imageBlob as Blob);

        setFiles(prev => prev.map((f, index) => 
          index === i ? { 
            ...f, 
            analyzing: false,
            annotatedPreview: annotatedUrl,
            results: resultJson.predictions
          } : f
        ));

      } catch (error) {
        console.error('Error analyzing image:', error);
        setFiles(prev => prev.map((f, index) => 
          index === i ? { ...f, analyzing: false } : f
        ));
        
        toast({
          variant: "destructive",
          title: "Analysis failed",
          description: error instanceof Error ? error.message : "Failed to analyze image. Please try again.",
        });
      }
    }

    setAnalyzing(false);
  };

  const getAnalysisResultSummary = (file: FileWithPreview) => {
    if (!file.results) return null;
    
    const fertileCount = file.results.filter(r => r.class === 'fer').length;
    const infertileCount = file.results.filter(r => r.class === 'unf').length;
    
    if (fertileCount === file.results.length) {
      return { text: `${fertileCount} telur subur`, color: 'text-green-500' };
    } else if (infertileCount === file.results.length) {
      return { text: `${infertileCount} telur tidak subur`, color: 'text-red-500' };
    } else {
      return { 
        text: `${fertileCount} subur, ${infertileCount} tidak subur`, 
        color: 'text-orange-500' 
      };
    }
  };

  const handleDownload = (file: FileWithPreview) => {
    const link = document.createElement('a');
    if (file.annotatedPreview) {
      link.href = file.annotatedPreview;
      link.download = `annotated_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAllFiles = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      if (file.annotatedPreview) {
        URL.revokeObjectURL(file.annotatedPreview);
      }
    });
    setFiles([]);
  };

  return (
    <div className="container py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDropzoneCollapsed(!isDropzoneCollapsed)}
                className="flex items-center gap-2"
              >
                {isDropzoneCollapsed ? (
                  <>
                    <Plus className="h-4 w-4" />
                    Tambah Gambar
                  </>
                ) : (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    Tutup Area Unggah
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={clearAllFiles}
                className="flex items-center gap-2"
                disabled={files.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Hapus Semua
              </Button>
            </div>

            {files.some(f => f.results) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sudah Dianalisis</AlertTitle>
                <AlertDescription>
                  Harap hapus semua hasil sebelum menganalisis gambar baru
                </AlertDescription>
              </Alert>
            )}

            {analyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Menganalisis gambar...</span>
                  <span>{Math.round((files.filter(f => f.results).length / files.length) * 100)}%</span>
                </div>
                <Progress 
                  value={(files.filter(f => f.results).length / files.length) * 100} 
                  className="h-2"
                />
              </div>
            )}

            <AnimatePresence>
              {!isDropzoneCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    )}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Seret & lepas gambar di sini, atau klik untuk memilih file
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {files.length > 0 && (
                <div className="space-y-6">
                  {!analyzing && (
                    <Button
                      className="w-full"
                      onClick={analyzeImages}
                      disabled={analyzing}
                    >
                      {analyzing ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Menganalisis...
                        </>
                      ) : (
                        'Analisis Gambar'
                      )}
                    </Button>
                  )}
                  
                  <Carousel className="w-full">
                    <CarouselContent>
                      {Array.from({ length: Math.ceil(files.length / 4) }).map((_, pageIndex) => (
                        <CarouselItem key={`page-${pageIndex}`}>
                          <div className="grid grid-cols-2 gap-4 p-1">
                            {files.slice(pageIndex * 4, (pageIndex + 1) * 4).map((file, index) => (
                              <motion.div
                                key={`${pageIndex}-${index}-${file.name}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                  "flex gap-4 p-4 border rounded-lg transition-colors duration-300",
                                  file.results && (
                                    file.results.every(r => r.class === 'fer') 
                                      ? "bg-green-500/5 border-green-500/20"
                                      : file.results.every(r => r.class === 'unf')
                                        ? "bg-red-500/5 border-red-500/20"
                                        : "bg-orange-500/5 border-orange-500/20"
                                  )
                                )}
                              >
                                <div className="relative w-[45%] group">
                                  <div 
                                    className="aspect-[4/3] relative rounded-md overflow-hidden cursor-pointer"
                                    onClick={() => setSelectedImage(file)}
                                  >
                                    <Image
                                      src={file.annotatedPreview || file.preview || ''}
                                      alt={`Egg analysis result for ${file.name}`}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                      <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4" />
                                    </div>
                                    {file.analyzing && (
                                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Spinner className="h-4 w-4" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
                                  <div className="space-y-3">
                                    <div>
                                      <h3 className="text-base font-semibold leading-none mb-1">
                                        Image {pageIndex * 4 + index + 1}
                                      </h3>
                                      <p className="text-sm text-muted-foreground truncate">
                                        {file.name}
                                      </p>
                                    </div>

                                    {file.analyzing ? (
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Analyzing...</span>
                                      </div>
                                    ) : file.results && (
                                      <div className="space-y-2">
                                        {getAnalysisResultSummary(file) && (
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              {file.results.every(r => r.class === 'fer') ? (
                                                <Badge key={`${file.name}-badge-fertile`} variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 flex gap-1.5 items-center py-1.5">
                                                  <CheckCircle2 className="h-4 w-4" />
                                                  <span className="font-medium">All Fertile</span>
                                                </Badge>
                                              ) : file.results.every(r => r.class === 'unf') ? (
                                                <Badge key={`${file.name}-badge-infertile`} variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 flex gap-1.5 items-center py-1.5">
                                                  <XCircle className="h-4 w-4" />
                                                  <span className="font-medium">All Infertile</span>
                                                </Badge>
                                              ) : (
                                                <Badge key={`${file.name}-badge-mixed`} variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 flex gap-1.5 items-center py-1.5">
                                                  <AlertTriangle className="h-4 w-4" />
                                                  <span className="font-medium">Mixed Results</span>
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="flex gap-2">
                                              {file.results.some(r => r.class === 'fer') && (
                                                <div key={`${file.name}-count-fertile`} className="flex items-center gap-1.5 text-green-600 text-sm">
                                                  <Egg className="h-4 w-4" />
                                                  <span>
                                                    {file.results.filter(r => r.class === 'fer').length} Subur
                                                  </span>
                                                </div>
                                              )}
                                              {file.results.some(r => r.class === 'unf') && (
                                                <div key={`${file.name}-count-infertile`} className="flex items-center gap-1.5 text-red-600 text-sm">
                                                  <Egg className="h-4 w-4" />
                                                  <span>
                                                    {file.results.filter(r => r.class === 'unf').length} Tidak Subur
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 mt-3">
                                    {!file.analyzing && (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="flex items-center gap-1.5"
                                          onClick={() => setSelectedImage(file)}
                                        >
                                          <Maximize2 className="h-4 w-4" />
                                          <span>Lihat</span>
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="flex items-center gap-1.5"
                                          onClick={() => handleDownload(file)}
                                        >
                                          <Download className="h-4 w-4" />
                                          <span>Unduh</span>
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {files.findIndex(f => f === selectedImage) > -1 
                ? `Image ${files.findIndex(f => f === selectedImage) + 1}`
                : 'Image Preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full">
            {selectedImage?.annotatedPreview && (
              <Image
                src={selectedImage.annotatedPreview}
                alt={`Annotated result for ${selectedImage.name || 'uploaded image'}`}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => selectedImage && handleDownload(selectedImage)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}