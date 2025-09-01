'use server';
/**
 * @fileOverview A flow to suggest common validation approaches for a GraphQL response using AI.
 *
 * - suggestGraphQLResponseValidations - A function that handles the suggestion of validation approaches.
 * - SuggestGraphQLResponseValidationsInput - The input type for the suggestGraphQLResponseValidations function.
 * - SuggestGraphQLResponseValidationsOutput - The return type for the suggestGraphQLResponseValidations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGraphQLResponseValidationsInputSchema = z.object({
  graphqlSchema: z
    .string()
    .describe('The GraphQL schema in SDL format.'),
  graphqlQuery: z
    .string()
    .describe('The GraphQL query that was executed.'),
  graphqlResponse: z.string().describe('The GraphQL response in JSON format.'),
  expectedResponseDescription: z
    .string()
    .optional()
    .describe(
      'Optional description of what the expected GraphQL response should look like.'
    ),
});
export type SuggestGraphQLResponseValidationsInput = z.infer<
  typeof SuggestGraphQLResponseValidationsInputSchema
>;

const SuggestGraphQLResponseValidationsOutputSchema = z.object({
  suggestedValidations: z
    .string()
    .describe(
      'A list of suggested validation approaches for the GraphQL response.'
    ),
});
export type SuggestGraphQLResponseValidationsOutput = z.infer<
  typeof SuggestGraphQLResponseValidationsOutputSchema
>;

export async function suggestGraphQLResponseValidations(
  input: SuggestGraphQLResponseValidationsInput
): Promise<SuggestGraphQLResponseValidationsOutput> {
  return suggestGraphQLResponseValidationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGraphQLResponseValidationsPrompt',
  input: {schema: SuggestGraphQLResponseValidationsInputSchema},
  output: {schema: SuggestGraphQLResponseValidationsOutputSchema},
  prompt: `You are an expert GraphQL API quality assurance engineer.

You will be provided with a GraphQL schema, a GraphQL query, and the response received from executing that query.  You may also receive a description of what the expected response should look like.

Your task is to suggest common validation approaches that a developer could use to assess the quality and correctness of the data returned by the query. Focus on suggesting validation approaches that are relevant to the specific schema, query, and response provided.

Here is the GraphQL schema:
\`\`\`
{{{graphqlSchema}}}
\`\`\`

Here is the GraphQL query:
\`\`\`
{{{graphqlQuery}}}
\`\`\`

Here is the GraphQL response:
\`\`\`
{{{graphqlResponse}}}
\`\`\`

{{#if expectedResponseDescription}}
Here is a description of what the expected response should look like:
\`\`\`
{{{expectedResponseDescription}}}
\`\`\`
{{/if}}

Here are some suggested validation approaches:
`,
});

const suggestGraphQLResponseValidationsFlow = ai.defineFlow(
  {
    name: 'suggestGraphQLResponseValidationsFlow',
    inputSchema: SuggestGraphQLResponseValidationsInputSchema,
    outputSchema: SuggestGraphQLResponseValidationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
