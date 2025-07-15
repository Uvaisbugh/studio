"use client";

import type { SuggestMoodContentOutput } from "@/ai/flows/suggest-mood-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Music, Footprints, Users, BookOpen } from "lucide-react";

interface ContentSuggestionsProps {
  suggestions: SuggestMoodContentOutput | null;
  isLoading: boolean;
}

const getSuggestionIcon = (suggestion: string) => {
  const s = suggestion.toLowerCase();
  if (s.includes('music') || s.includes('song') || s.includes('listen')) return Music;
  if (s.includes('walk') || s.includes('outdoors') || s.includes('nature')) return Footprints;
  if (s.includes('friend') || s.includes('family') || s.includes('talk')) return Users;
  if (s.includes('read') || s.includes('book') || s.includes('article')) return BookOpen;
  return Lightbulb;
}

export default function ContentSuggestions({ suggestions, isLoading }: ContentSuggestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-5 flex-1" />
              </div>
            ))}
          </div>
        )}
        {suggestions && (
          <ul className="space-y-4">
            {suggestions.suggestions.map((item, index) => {
              const Icon = getSuggestionIcon(item);
              return (
                <li key={index} className="flex items-start gap-4">
                  <div className="bg-secondary p-2 rounded-full mt-1">
                    <Icon className="size-5 text-secondary-foreground" />
                  </div>
                  <span className="flex-1 text-foreground pt-1">{item}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
