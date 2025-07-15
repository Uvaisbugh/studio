"use client";

import { useState, useEffect } from "react";
import type { AnalyzeSelfieEmotionOutput } from "@/ai/flows/analyze-selfie-emotion";
import type { SuggestMoodContentOutput } from "@/ai/flows/suggest-mood-content";
import { analyzeSelfieEmotion } from "@/ai/flows/analyze-selfie-emotion";
import { suggestMoodContent } from "@/ai/flows/suggest-mood-content";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/app/header";
import SelfieUploader from "@/components/app/selfie-uploader";
import MoodDisplay from "@/components/app/mood-display";
import ContentSuggestions from "@/components/app/content-suggestions";
import MoodJournal from "@/components/app/mood-journal";
import EmotionHistory from "@/components/app/emotion-history";

export type EmotionHistoryEntry = {
  emotion: string;
  reasoning: string;
  date: string;
};

export default function Home() {
  const { toast } = useToast();
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSelfieEmotionOutput | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestMoodContentOutput | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("auraVisionEmotionHistory");
      if (storedHistory) {
        setEmotionHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load emotion history from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load your emotion history.",
      });
    }
  }, [toast]);

  const handleAnalyze = async (photoDataUri: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setSuggestions(null);
    setSelfieUri(photoDataUri);
    // Switch back to the upload tab view after analysis
    setActiveTab("upload")

    try {
      const result = await analyzeSelfieEmotion({ photoDataUri });
      setAnalysisResult(result);

      const newEntry: EmotionHistoryEntry = { ...result, date: new Date().toISOString() };
      const updatedHistory = [newEntry, ...emotionHistory];
      setEmotionHistory(updatedHistory);
      localStorage.setItem("auraVisionEmotionHistory", JSON.stringify(updatedHistory));

      const moodSuggestions = await suggestMoodContent({ mood: result.emotion });
      setSuggestions(moodSuggestions);

    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: e.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJournal = (entry: string) => {
    // In a real app, this would be saved with the corresponding mood entry
    toast({
      title: "Journal Saved",
      description: "Your reflection has been saved.",
    });
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem("auraVisionEmotionHistory");
      setEmotionHistory([]);
      toast({
        title: "History Cleared",
        description: "Your emotion history has been cleared.",
      });
    } catch (error) {
       console.error("Failed to clear emotion history from localStorage", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not clear your emotion history.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <SelfieUploader onAnalyze={handleAnalyze} isLoading={isLoading} activeTab={activeTab} setActiveTab={setActiveTab} />
            {(isLoading || analysisResult) && (
              <MoodDisplay result={analysisResult} selfieUri={selfieUri} isLoading={isLoading} />
            )}
            {(isLoading || suggestions) && (
              <ContentSuggestions suggestions={suggestions} isLoading={isLoading} />
            )}
          </div>
          <div className="lg:col-span-2 flex flex-col gap-8">
            <MoodJournal onSave={handleSaveJournal} />
            <EmotionHistory history={emotionHistory} onClear={handleClearHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}
