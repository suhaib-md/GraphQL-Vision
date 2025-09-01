
"use client"

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, History, FolderKanban } from "lucide-react"

interface SchemaExplorerProps {
  schema: any; // Using any for mock data structure
}

export function SchemaExplorer({ schema }: SchemaExplorerProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const types = schema?.data?.__schema?.types || [];
  
  const filteredTypes = React.useMemo(() => types.filter(
    (type: any) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !type.name.startsWith('__')
  ), [types, searchTerm]);

  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs defaultValue="schema" className="flex-1 flex flex-col min-h-0">
        <div className="p-2 border-b">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schema"><Search className="w-4 h-4 mr-1.5" /> Schema</TabsTrigger>
            <TabsTrigger value="collections"><FolderKanban className="w-4 h-4 mr-1.5" /> Collections</TabsTrigger>
            <TabsTrigger value="history"><History className="w-4 h-4 mr-1.5" /> History</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="schema" className="flex-1 flex flex-col m-0">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search schema..." 
                className="pl-9 h-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <Accordion type="multiple" className="w-full px-2">
              {filteredTypes.map((type: any) => (
                <AccordionItem value={type.name} key={type.name}>
                  <AccordionTrigger className="text-sm font-code hover:no-underline py-2">
                    <div>
                      <span className="text-primary">{type.name}</span>
                      <span className="text-muted-foreground ml-2 text-xs">{type.kind}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 font-code text-xs space-y-2 pb-2">
                      <p className="text-muted-foreground font-sans">{type.description || "No description."}</p>
                      {type.fields && type.fields.length > 0 && (
                        <div className="space-y-1 pt-2">
                          <h4 className="font-semibold font-sans">Fields</h4>
                          {type.fields.map((field: any) => (
                            <div key={field.name}>
                              <span className="font-medium text-foreground">{field.name}:</span>
                              <span className="ml-2 text-primary">{field.type.name || `[${field.type.ofType?.name}]`}</span>
                            </div>
                          ))}
                        </div>
                      )}
                       {type.enumValues && type.enumValues.length > 0 && (
                        <div className="space-y-1 pt-2">
                          <h4 className="font-semibold font-sans">Values</h4>
                          {type.enumValues.map((val: any) => (
                            <div key={val.name}>{val.name}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="collections" className="flex-1 flex flex-col m-0 p-4">
          <div className="text-center text-muted-foreground text-sm flex-1 flex items-center justify-center">
            <p>Collections will appear here.</p>
          </div>
        </TabsContent>
        <TabsContent value="history" className="flex-1 flex flex-col m-0 p-4">
          <div className="text-center text-muted-foreground text-sm flex-1 flex items-center justify-center">
            <p>Query history will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
