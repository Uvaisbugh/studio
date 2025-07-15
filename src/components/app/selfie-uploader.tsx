"use client";

import { useState, useRef, type ChangeEvent, type DragEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, Loader2, Camera, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface SelfieUploaderProps {
  onAnalyze: (photoDataUri: string) => void;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SelfieUploader({ onAnalyze, isLoading, activeTab, setActiveTab }: SelfieUploaderProps) {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activeTab === 'camera') {
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           setHasCameraPermission(false);
           return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings to use this app.",
          });
        }
      };
      getCameraPermission();
    } else {
      // Stop camera stream when switching away from the camera tab
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [activeTab, toast]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyzeClick = () => {
    if (preview) {
      onAnalyze(preview);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/png');
        setPreview(dataUri);
        setActiveTab('upload');
      }
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Your Aura</CardTitle>
        <CardDescription>Upload or take a selfie to analyze your current mood. Your image is not stored.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="camera">Take a Selfie</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mt-4
                ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
              onClick={triggerFileSelect}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {preview ? (
                <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-md">
                  <Image src={preview} alt="Selfie preview" layout="fill" objectFit="cover" data-ai-hint="person selfie" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="w-10 h-10" />
                  <p className="font-semibold">Click to upload or drag & drop</p>
                  <p className="text-xs">PNG, JPG, or WEBP</p>
                </div>
              )}
            </div>
            <Button onClick={handleAnalyzeClick} disabled={!preview || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Mood"
              )}
            </Button>
          </TabsContent>
          <TabsContent value="camera" className="space-y-4 mt-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />

              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                   <Alert variant="destructive" className="max-w-md">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser settings to use this feature. You may need to reload the page.
                      </AlertDescription>
                    </Alert>
                </div>
              )}
               {hasCameraPermission === null && (
                 <Loader2 className="size-8 animate-spin text-muted-foreground" />
              )}
            </div>
             <Button onClick={handleCapture} disabled={!hasCameraPermission || isLoading} className="w-full">
                <Camera className="mr-2" />
                Capture Photo
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
