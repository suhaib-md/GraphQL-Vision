
"use client";

import * as React from 'react';
import { AppHeader } from '@/components/layout/header';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/layout/resizable';
import { SchemaExplorer } from '@/components/schema-explorer';
import { QueryEditor } from '@/components/query-editor';
import { ResponseViewer } from '@/components/response-viewer';
import { MOCK_SCHEMA, MOCK_QUERY, MOCK_RESPONSE } from '@/lib/constants';

export default function Home() {
  const [query, setQuery] = React.useState(MOCK_QUERY);
  const [response, setResponse] = React.useState(JSON.stringify(MOCK_RESPONSE, null, 2));
  const schema = MOCK_SCHEMA;

  const handleRunQuery = () => {
    // In a real app, you would execute the query against a GraphQL endpoint.
    // For this mock, we'll just show the mock response.
    console.log("Running query:", query);
    setResponse(JSON.stringify(MOCK_RESPONSE, null, 2));
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <AppHeader />
      <ResizablePanelGroup direction="horizontal" className="flex-1 border-t">
        <ResizablePanel defaultSize={20} minSize={15} className="min-w-[250px]">
          <SchemaExplorer schema={schema} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={30}>
          <QueryEditor value={query} onValueChange={setQuery} onRunQuery={handleRunQuery} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35} minSize={25}>
          <ResponseViewer
            response={response}
            rawSchema={JSON.stringify(schema, null, 2)}
            query={query}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
