
"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Play, Sparkles, Loader } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { parse, print } from 'graphql';
import { useToast } from '@/hooks/use-toast';

interface QueryEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  onRunQuery: () => void;
  isLoading: boolean;
  variables: string;
  onVariablesChange: (value: string) => void;
  headers: string;
  onHeadersChange: (value: string) => void;
}

export function QueryEditor({ value, onValueChange, onRunQuery, isLoading, variables, onVariablesChange, headers, onHeadersChange }: QueryEditorProps) {
  const { toast } = useToast();

  const handlePrettify = () => {
    try {
      const ast = parse(value);
      const prettyQuery = print(ast);
      onValueChange(prettyQuery);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid Query',
        description: 'The query could not be formatted. Please check for syntax errors.',
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-2 border-b flex items-center justify-between gap-2 h-14 shrink-0">
        <h2 className="text-sm font-semibold px-2">Query</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrettify}>
            <Sparkles className="h-4 w-4 mr-2" />
            Prettify
          </Button>
          <Button size="sm" onClick={onRunQuery} disabled={isLoading}>
            {isLoading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <Textarea
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Write your GraphQL query here..."
          className="flex-1 font-code text-base md:text-sm resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
        />
        <div className="border-t shrink-0">
          <Tabs defaultValue="variables" className="p-2">
            <TabsList>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
            <TabsContent value="variables" className="mt-2">
              <Textarea
                placeholder='{ "variable": "value" }'
                className="font-code text-xs h-24 resize-none bg-background"
                value={variables}
                onChange={(e) => onVariablesChange(e.target.value)}
              />
            </TabsContent>
            <TabsContent value="headers" className="mt-2">
              <Textarea
                placeholder='{ "Authorization": "Bearer YOUR_TOKEN" }'
                className="font-code text-xs h-24 resize-none bg-background"
                value={headers}
                onChange={(e) => onHeadersChange(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
