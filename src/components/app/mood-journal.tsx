"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface MoodJournalProps {
  onSave: (entry: string) => void;
}

export default function MoodJournal({ onSave }: MoodJournalProps) {
  const [entry, setEntry] = useState('');

  const handleSaveClick = () => {
    onSave(entry);
    setEntry('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Journal</CardTitle>
        <CardDescription>Reflect on your feelings. What's on your mind?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Today I'm feeling..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows={6}
        />
        <Button onClick={handleSaveClick} disabled={!entry.trim()} className="w-full">
          Save Journal Entry
        </Button>
      </CardContent>
    </Card>
  );
}
