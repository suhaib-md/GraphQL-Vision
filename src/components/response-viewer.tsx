"use client"

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bot, Code, Table as TableIcon } from 'lucide-react'
import { Button } from './ui/button'
import { suggestGraphQLResponseValidations } from '@/ai/flows/suggest-graphql-response-validations'
import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'
import { useToast } from '@/hooks/use-toast'

interface ResponseViewerProps {
  response: string;
  rawSchema: string;
  query: string;
  isLoading: boolean;
}

export function ResponseViewer({ response, rawSchema, query, isLoading }: ResponseViewerProps) {
  const parsedResponse = React.useMemo(() => {
    try {
      return JSON.parse(response)
    } catch {
      if (response) {
         return { error: "Invalid JSON response" }
      }
      return null;
    }
  }, [response]);
  
  const users = parsedResponse?.data?.users;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }
    if (!response) {
      return (
        <div className="text-center text-muted-foreground text-sm flex items-center justify-center h-full">
            <p>Click "Run" to see the response here.</p>
        </div>
      )
    }
    return (
      <div className="p-4 overflow-y-auto max-h-full">
        <pre className="text-xs font-code whitespace-pre-wrap break-words">
          <code className="font-code">{response}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
       <div className="p-2 border-b flex items-center justify-between gap-2 h-14 shrink-0">
        <h2 className="text-sm font-semibold px-2">Response</h2>
        <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline">Status: <span className="font-semibold text-accent-foreground bg-accent ml-1 px-1 rounded">200 OK</span></Badge>
            <Badge variant="outline">Time: <span className="font-semibold ml-1">128ms</span></Badge>
            <Badge variant="outline">Size: <span className="font-semibold ml-1">1.2KB</span></Badge>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Tabs defaultValue="response" className="flex-1 flex flex-col min-h-0">
          <div className="p-2 border-b shrink-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="response"><Code className="w-4 h-4 mr-1 inline-block" /> Response</TabsTrigger>
              <TabsTrigger value="table" disabled={!Array.isArray(users)}><TableIcon className="w-4 h-4 mr-1 inline-block" /> Table</TabsTrigger>
              <TabsTrigger value="chart" disabled={true}><BarChart className="w-4 h-4 mr-1 inline-block" /> Chart</TabsTrigger>
              <TabsTrigger value="ai"><Bot className="w-4 h-4 mr-1 inline-block" /> AI</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 min-h-0">
            <TabsContent value="response" className="h-full m-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {renderContent()}
              </div>
            </TabsContent>
            <TabsContent value="table" className="h-full m-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Posts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(users) && users.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.posts.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="chart" className="h-full m-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground text-sm">
                <p>Chart view will be available here.</p>
              </div>
            </TabsContent>
            <TabsContent value="ai" className="h-full m-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <AiSuggestions response={response} rawSchema={rawSchema} query={query} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function AiSuggestions({ response, rawSchema, query }: Omit<ResponseViewerProps, 'isLoading'>) {
  const [description, setDescription] = React.useState('');
  const [suggestions, setSuggestions] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions('');
    try {
      const result = await suggestGraphQLResponseValidations({
        graphqlSchema: rawSchema,
        graphqlQuery: query,
        graphqlResponse: response,
        expectedResponseDescription: description,
      });
      setSuggestions(result.suggestedValidations);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not generate suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Describe the expected response (optional)</p>
            <Textarea 
              placeholder="e.g., 'The response should be an array of users, each with a name and at least one post.'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24"
              disabled={!response}
            />
            <Button onClick={handleGenerateSuggestions} disabled={isLoading || !response}>
              {isLoading ? "Generating..." : "Suggest Validations"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {isLoading && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}
      {suggestions && (
         <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Suggested Validations</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
              {suggestions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}