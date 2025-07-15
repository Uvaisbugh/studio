// This is an AI-powered mood tracking app that analyzes uploaded or new selfies to detect emotional state.

'use server';

/**
 * @fileOverview Analyzes a selfie image to detect the user's emotional state.
 *
 * - analyzeSelfieEmotion - A function that takes a selfie image and returns the detected emotion.
 * - AnalyzeSelfieEmotionInput - The input type for the analyzeSelfieEmotion function.
 * - AnalyzeSelfieEmotionOutput - The return type for the analyzeSelfieEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSelfieEmotionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A selfie photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSelfieEmotionInput = z.infer<typeof AnalyzeSelfieEmotionInputSchema>;

const AnalyzeSelfieEmotionOutputSchema = z.object({
  emotion: z.string().describe('The detected emotion in the selfie.'),
  reasoning: z.string().describe('The reasoning behind the emotion detection.'),
});
export type AnalyzeSelfieEmotionOutput = z.infer<typeof AnalyzeSelfieEmotionOutputSchema>;

export async function analyzeSelfieEmotion(input: AnalyzeSelfieEmotionInput): Promise<AnalyzeSelfieEmotionOutput> {
  return analyzeSelfieEmotionFlow(input);
}

const facialFeatureTool = ai.defineTool({
  name: 'selectFacialFeatures',
  description: 'Selects the most relevant facial features for emotion detection.',
  inputSchema: z.object({
    photoDataUri: z
      .string()
      .describe(
        "A selfie photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant facial features.'),
  async func(input) {
    // Dummy implementation for facial feature selection.
    // Replace with actual facial feature detection logic.
    return ['eyes', 'mouth', 'eyebrows'];
  },
});

const localEventsTool = ai.defineTool({
  name: 'getLocalEvents',
  description: 'Retrieves information about local events that might influence the users mood.',
  inputSchema: z.object({
    location: z.string().describe('The users current location'),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant local events.'),
  async func(input) {
    // Dummy implementation for local event retrieval.
    return ['concert', 'art exhibition', 'farmers market'];
  },
});

const knownPeopleTool = ai.defineTool({
  name: 'getKnownPeople',
  description: 'Retrieves information about people known to the user.',
  inputSchema: z.object({
    userId: z.string().describe('The users id.'),
  }),
  outputSchema: z.array(z.string()).describe('An array of relevant people known to the user.'),
  async func(input) {
    // Dummy implementation for known people retrieval.
    return ['John', 'Jane', 'Bob'];
  },
});

const prompt = ai.definePrompt({
  name: 'analyzeSelfieEmotionPrompt',
  tools: [facialFeatureTool, localEventsTool, knownPeopleTool],
  input: {schema: AnalyzeSelfieEmotionInputSchema},
  output: {schema: AnalyzeSelfieEmotionOutputSchema},
  prompt: `You are an AI expert in analyzing human emotions from selfie photos.

  Analyze the user's selfie and detect their emotional state. Consider the following:

  - Use the selectFacialFeatures tool to identify relevant facial features in the photo.
  - Incorporate knowledge of local events (using the getLocalEvents tool) and people known to the user (using the getKnownPeople tool) to refine your analysis.

  Based on your analysis, determine the user's emotion and provide a reasoning for your determination.

  Selfie Photo: {{media url=photoDataUri}}
  `,
});

const analyzeSelfieEmotionFlow = ai.defineFlow(
  {
    name: 'analyzeSelfieEmotionFlow',
    inputSchema: AnalyzeSelfieEmotionInputSchema,
    outputSchema: AnalyzeSelfieEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
