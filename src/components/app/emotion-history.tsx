"use client";

import type { EmotionHistoryEntry } from "@/app/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EmotionHistoryProps {
  history: EmotionHistoryEntry[];
  onClear: () => void;
}

export default function EmotionHistory({ history, onClear }: EmotionHistoryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Emotion History</CardTitle>
          <CardDescription>A log of your recent mood analyses.</CardDescription>
        </div>
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your entire emotion history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, delete history
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 pr-4">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No history yet. Analyze a selfie to begin!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map((entry, index) => (
                <li key={index} className="flex flex-col p-3 rounded-lg bg-card border">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="secondary" className="capitalize">{entry.emotion}</Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground italic">&quot;{entry.reasoning}&quot;</p>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
