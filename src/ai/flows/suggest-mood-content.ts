'use server';

/**
 * @fileOverview A flow for suggesting activities, content, or resources based on the detected mood.
 *
 * - suggestMoodContent - A function that suggests content based on the detected mood.
 * - SuggestMoodContentInput - The input type for the suggestMoodContent function.
 * - SuggestMoodContentOutput - The return type for the suggestMoodContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMoodContentInputSchema = z.object({
  mood: z.string().describe('The detected mood of the user (e.g., happy, sad, angry).'),
  userPreferences: z
    .string()
    .optional()
    .describe('Optional user preferences that the recommendation should consider.'),
  location: z
    .string()
    .optional()
    .describe('The current location of the user to suggest local events or resources.'),
  knownPeople: z
    .string()
    .optional()
    .describe('Information about people known to the user to make personalized suggestions.'),
});
export type SuggestMoodContentInput = z.infer<typeof SuggestMoodContentInputSchema>;

const SuggestMoodContentOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested activities, content, or resources.'),
});
export type SuggestMoodContentOutput = z.infer<typeof SuggestMoodContentOutputSchema>;

// Define a tool to get information about local events
const getLocalEvents = ai.defineTool({
  name: 'getLocalEvents',
  description: 'Retrieves information about local events based on the user location.',
  inputSchema: z.object({
    location: z.string().describe('The location to search for local events.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of local events.'),
},
async (input) => {
    // In a real application, this would call an external API or service
    // to retrieve local events based on the location.
    // For this example, we'll return some dummy data.
    return [
      `Dummy local event 1 in ${input.location}`,
      `Dummy local event 2 in ${input.location}`,
    ];
  }
);

// Define a tool to get information about people known to the user
const getPeopleInfo = ai.defineTool({
  name: 'getPeopleInfo',
  description: 'Retrieves information about people known to the user.',
  inputSchema: z.object({
    people: z.string().describe('The names of the people to get information about.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of information about the people.'),
},
async (input) => {
    // In a real application, this would call an external API or service
    // to retrieve information about people known to the user.
    // For this example, we'll return some dummy data.
    return [
      `Dummy information about ${input.people}`,
    ];
  }
);

export async function suggestMoodContent(input: SuggestMoodContentInput): Promise<SuggestMoodContentOutput> {
  return suggestMoodContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMoodContentPrompt',
  input: {schema: SuggestMoodContentInputSchema},
  output: {schema: SuggestMoodContentOutputSchema},
  tools: [getLocalEvents, getPeopleInfo],
  prompt: `Based on the user's detected mood, suggest activities, content, or resources to improve or maintain their emotional well-being.

  Detected Mood: {{{mood}}}
  User Preferences: {{#if userPreferences}}{{{userPreferences}}}{{else}}No specific preferences provided.{{/if}}
  Location: {{#if location}}{{{location}}}{{else}}No location provided.{{/if}}
  Known People: {{#if knownPeople}}{{{knownPeople}}}{{else}}No information about known people provided.{{/if}}

  {{#if location}}
  Consider suggesting local events using the getLocalEvents tool.
  {{/if}}

  {{#if knownPeople}}
  Consider suggesting activities involving people known to the user using the getPeopleInfo tool.
  {{/if}}

  Suggestions should be tailored to the user's mood and preferences.
  Provide a list of suggestions.
  `,
});

const suggestMoodContentFlow = ai.defineFlow(
  {
    name: 'suggestMoodContentFlow',
    inputSchema: SuggestMoodContentInputSchema,
    outputSchema: SuggestMoodContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
