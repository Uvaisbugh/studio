"use client";

import type { AnalyzeSelfieEmotionOutput } from "@/ai/flows/analyze-selfie-emotion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Smile, Frown, Meh, Angry, Laugh, CircleAlert, HelpCircle } from "lucide-react";
import type { ElementType } from "react";

interface MoodDisplayProps {
  result: AnalyzeSelfieEmotionOutput | null;
  selfieUri: string | null;
  isLoading: boolean;
}

const emotionIcons: { [key: string]: ElementType } = {
  happy: Laugh,
  joy: Smile,
  sad: Frown,
  angry: Angry,
  neutral: Meh,
  surprise: CircleAlert,
};

const getEmotionIcon = (emotion: string) => {
  const normalizedEmotion = emotion.toLowerCase();
  for (const key in emotionIcons) {
    if (normalizedEmotion.includes(key)) {
      return emotionIcons[key];
    }
  }
  return HelpCircle;
};

export default function MoodDisplay({ result, selfieUri, isLoading }: MoodDisplayProps) {
  const EmotionIcon = result ? getEmotionIcon(result.emotion) : null;

  return (
    <Card className="bg-accent/30">
      <CardHeader>
        <CardTitle>Analysis Result</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Skeleton className="size-32 rounded-lg" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        )}
        {result && selfieUri && (
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative">
              <Image src={selfieUri} alt="Analyzed selfie" width={128} height={128} className="rounded-lg shadow-md" data-ai-hint="person selfie" />
              {EmotionIcon && (
                <div className="absolute -bottom-4 -right-4 bg-accent p-2 rounded-full border-4 border-card">
                  <EmotionIcon className="size-8 text-accent-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-lg text-muted-foreground">You seem to be feeling...</p>
              <h3 className="text-4xl font-bold text-primary capitalize">{result.emotion}</h3>
              <p className="mt-2 text-sm text-muted-foreground italic">
                &quot;{result.reasoning}&quot;
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
