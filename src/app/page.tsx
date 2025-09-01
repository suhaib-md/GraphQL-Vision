
"use client";

import * as React from 'react';
import { AppHeader } from '@/components/layout/header';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/layout/resizable';
import { SchemaExplorer } from '@/components/schema-explorer';
import { QueryEditor } from '@/components/query-editor';
import { ResponseViewer } from '@/components/response-viewer';
import { MOCK_SCHEMA, MOCK_QUERY, MOCK_RESPONSE } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import type { Environment, HistoryItem, Collection } from '@/lib/types';

const INITIAL_ENVIRONMENTS: Environment[] = [
    { id: 'prod', name: 'Production', url: 'https://api.example.com/graphql', color: 'bg-green-500' },
    { id: 'staging', name: 'Staging', url: 'https://staging.api.example.com/graphql', color: 'bg-yellow-500' },
    { id: 'dev', name: 'Development', url: 'http://localhost:4000/graphql', color: 'bg-blue-500' },
];

const MAX_HISTORY_LENGTH = 50;


export default function Home() {
  const [query, setQuery] = React.useState(MOCK_QUERY);
  const [variables, setVariables] = React.useState('{}');
  const [headers, setHeaders] = React.useState('{}');
  const [response, setResponse] = React.useState(JSON.stringify(MOCK_RESPONSE, null, 2));
  const [isLoading, setIsLoading] = React.useState(false);
  const [environments, setEnvironments] = React.useState<Environment[]>(INITIAL_ENVIRONMENTS);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = React.useState<string>('prod');
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const schema = MOCK_SCHEMA;
  const { toast } = useToast();

  const handleRunQuery = async () => {
    setIsLoading(true);
    setResponse('');

    const activeEnv = environments.find(env => env.id === selectedEnvironmentId);
    if (!activeEnv) {
      toast({
        variant: 'destructive',
        title: 'No Environment Selected',
        description: 'Please select an environment to run the query against.',
      });
      setIsLoading(false);
      return;
    }

    try {
      let parsedVariables;
      try {
        parsedVariables = JSON.parse(variables || '{}');
      } catch (e) {
        throw new Error('Variables contain invalid JSON.');
      }
      
      let parsedHeaders;
      try {
        parsedHeaders = JSON.parse(headers || '{}');
      } catch(e) {
        throw new Error('Headers contain invalid JSON.');
      }

      const mergedHeaders = {
        'Content-Type': 'application/json',
        ...parsedHeaders,
      };

      if (activeEnv.token) {
        mergedHeaders['Authorization'] = `Bearer ${activeEnv.token}`;
      }

      const res = await fetch(activeEnv.url, {
        method: 'POST',
        headers: mergedHeaders,
        body: JSON.stringify({ query, variables: parsedVariables }),
      });

      const result = await res.json();
      setResponse(JSON.stringify(result, null, 2));

      if (res.ok && !result.errors) {
        setHistory(prev => {
          const newHistory: HistoryItem = { id: Date.now().toString(), query, timestamp: new Date() };
          const filtered = prev.filter(h => h.query !== query);
          return [newHistory, ...filtered].slice(0, MAX_HISTORY_LENGTH);
        });
      }

    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setResponse(JSON.stringify({ error: errorMessage }, null, 2));
      toast({
        variant: 'destructive',
        title: 'Query Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadQueryFromHistory = (newQuery: string) => {
    setQuery(newQuery);
  };

  const loadQueryFromCollection = (item: { query: string; variables?: string; headers?: string; }) => {
    setQuery(item.query);
    setVariables(item.variables || '{}');
    setHeaders(item.headers || '{}');
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <AppHeader
        environments={environments}
        setEnvironments={setEnvironments}
        selectedEnvironment={selectedEnvironmentId}
        setSelectedEnvironment={setSelectedEnvironmentId}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1 border-t">
        <ResizablePanel defaultSize={20} minSize={15} className="min-w-[250px]">
          <SchemaExplorer 
            schema={schema}
            history={history}
            collections={collections}
            onSelectHistory={loadQueryFromHistory}
            onSelectCollectionItem={loadQueryFromCollection}
            setCollections={setCollections}
            currentQuery={{ query, variables, headers }}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={30}>
          <QueryEditor 
            value={query} 
            onValueChange={setQuery} 
            onRunQuery={handleRunQuery}
            isLoading={isLoading}
            variables={variables}
            onVariablesChange={setVariables}
            headers={headers}
            onHeadersChange={setHeaders}
            schema={JSON.stringify(schema, null, 2)}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35} minSize={25}>
          <ResponseViewer
            response={response}
            rawSchema={JSON.stringify(schema, null, 2)}
            query={query}
            isLoading={isLoading}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
