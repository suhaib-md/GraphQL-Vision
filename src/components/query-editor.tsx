"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Play, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface QueryEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  onRunQuery: () => void;
}

export function QueryEditor({ value, onValueChange, onRunQuery }: QueryEditorProps) {
  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-2 border-b flex items-center justify-between gap-2 h-14 shrink-0">
        <h2 className="text-sm font-semibold px-2">Query</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Prettify
          </Button>
          <Button size="sm" onClick={onRunQuery}>
            <Play className="h-4 w-4 mr-2" />
            Run
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
              />
            </TabsContent>
            <TabsContent value="headers" className="mt-2">
              <Textarea
                placeholder='{ "Authorization": "Bearer YOUR_TOKEN" }'
                className="font-code text-xs h-24 resize-none bg-background"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
