'use server';
/**
 * @fileOverview A GraphQL query generator AI agent.
 *
 * - generateGraphQLQuery - A function that generates a GraphQL query from a natural language description.
 * - GenerateGraphQLQueryInput - The input type for the generateGraphQLQuery function.
 * - GenerateGraphQLQueryOutput - The return type for the generateGraphQLQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGraphQLQueryInputSchema = z.object({
  description: z
    .string()
    .describe('A natural language description of the data needed.'),
  schema: z.string().describe('The GraphQL schema to use.'),
});
export type GenerateGraphQLQueryInput = z.infer<typeof GenerateGraphQLQueryInputSchema>;

const GenerateGraphQLQueryOutputSchema = z.object({
  query: z.string().describe('The generated GraphQL query.'),
});
export type GenerateGraphQLQueryOutput = z.infer<typeof GenerateGraphQLQueryOutputSchema>;

export async function generateGraphQLQuery(input: GenerateGraphQLQueryInput): Promise<GenerateGraphQLQueryOutput> {
  return generateGraphQLQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGraphQLQueryPrompt',
  input: {schema: GenerateGraphQLQueryInputSchema},
  output: {schema: GenerateGraphQLQueryOutputSchema},
  prompt: `You are a GraphQL expert. You will generate a GraphQL query based on the user's description and the provided schema.\n\nDescription: {{{description}}}\nSchema: {{{schema}}}\n\nQuery:`,
});

const generateGraphQLQueryFlow = ai.defineFlow(
  {
    name: 'generateGraphQLQueryFlow',
    inputSchema: GenerateGraphQLQueryInputSchema,
    outputSchema: GenerateGraphQLQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
