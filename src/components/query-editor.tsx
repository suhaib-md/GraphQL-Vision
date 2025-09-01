
"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Play, Sparkles, Loader, Trash2, Plus, Code, List, ChevronDown, Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { parse, print } from 'graphql';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'

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
      if (!value) return;
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
          <Button variant="outline" size="sm" onClick={handlePrettify} disabled={!value}>
            <Sparkles className="h-4 w-4 mr-2" />
            Prettify
          </Button>
          <Button size="sm" onClick={onRunQuery} disabled={isLoading || !value}>
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
              <KeyValueEditor
                jsonString={variables}
                onJsonStringChange={onVariablesChange}
                keyPlaceholder="variable"
                valuePlaceholder="value"
                type="variables"
              />
            </TabsContent>
            <TabsContent value="headers" className="mt-2">
               <KeyValueEditor
                jsonString={headers}
                onJsonStringChange={onHeadersChange}
                keyPlaceholder="Header"
                valuePlaceholder="Value"
                type="headers"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


type KeyValue = { id: string; key: string; value: string; };
type ViewMode = 'kv' | 'json';

interface KeyValueEditorProps {
  jsonString: string;
  onJsonStringChange: (jsonString: string) => void;
  keyPlaceholder: string;
  valuePlaceholder: string;
  type: 'variables' | 'headers';
}

const COMMON_HEADERS = [
  { name: 'Authorization', value: 'Bearer ' },
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Accept', value: 'application/json' },
  { name: 'Accept-Charset', value: 'utf-8' },
  { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
  { name: 'Cache-Control', value: 'no-cache' },
  { name: 'User-Agent', value: 'GraphQLVision/1.0' },
  { name: 'X-Request-ID', value: '' },
  { name: 'apollographql-client-name', value: '' },
  { name: 'apollographql-client-version', value: '' },
];


function KeyValueEditor({ jsonString, onJsonStringChange, keyPlaceholder, valuePlaceholder, type }: KeyValueEditorProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('kv');
  const [kvPairs, setKvPairs] = React.useState<KeyValue[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const parsed = jsonString ? JSON.parse(jsonString) : {};
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setViewMode('json');
        return;
      }
      const pairs = Object.entries(parsed).map(([key, value]) => ({
        id: `id-${key}-${Math.random()}`,
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      }));
      if (pairs.length === 0) {
        pairs.push({ id: `id-${Date.now()}`, key: '', value: '' });
      }
      setKvPairs(pairs);
    } catch (e) {
      setViewMode('json');
    }
  }, []);

  const updateJsonString = (pairs: KeyValue[]) => {
    try {
      const obj = pairs.reduce((acc, { key, value }) => {
        if (key) {
          try {
            if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
              acc[key] = JSON.parse(value);
            } else {
              acc[key] = value;
            }
          } catch {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as Record<string, any>);
      onJsonStringChange(JSON.stringify(obj, null, 2));
    } catch (e) {
      // Should not happen
    }
  };
  
  const handleKvChange = (id: string, field: 'key' | 'value', fieldValue: string) => {
    const newPairs = kvPairs.map(p => p.id === id ? { ...p, [field]: fieldValue } : p);
    setKvPairs(newPairs);
    updateJsonString(newPairs);
  };
  
  const addPair = (key = '', value = '') => {
    const newPairs = [...kvPairs, { id: `id-${Date.now()}`, key, value }];
    setKvPairs(newPairs);
    updateJsonString(newPairs);
  };

  const removePair = (id: string) => {
    const newPairs = kvPairs.filter(p => p.id !== id);
    setKvPairs(newPairs);
    updateJsonString(newPairs);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onJsonStringChange(e.target.value);
  }

  const handleToggleView = () => {
    if (viewMode === 'kv') {
      setViewMode('json');
    } else {
      try {
        const parsed = jsonString ? JSON.parse(jsonString) : {};
         if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Can only convert a JSON object to key-value pairs.'});
          return;
        }
        const pairs = Object.entries(parsed).map(([key, value]) => ({
          id: `id-${key}-${Math.random()}`,
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        }));
        if (pairs.length === 0) {
          pairs.push({ id: `id-${Date.now()}`, key: '', value: '' });
        }
        setKvPairs(pairs);
        setViewMode('kv');
      } catch (e) {
        toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Could not parse JSON. Please fix it before switching.'});
      }
    }
  }

  const handleSelectCommonHeader = (header: { name: string; value: string }) => {
    // Check if the last pair is empty, if so, use it. Otherwise, add a new one.
    const lastPair = kvPairs[kvPairs.length - 1];
    if (lastPair && !lastPair.key && !lastPair.value) {
      handleKvChange(lastPair.id, 'key', header.name);
      handleKvChange(lastPair.id, 'value', header.value);
      const newPairs = kvPairs.map(p => p.id === lastPair.id ? { ...p, key: header.name, value: header.value } : p);
      setKvPairs(newPairs);
      updateJsonString(newPairs);
    } else {
      addPair(header.name, header.value);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end items-center gap-2">
         {type === 'headers' && viewMode === 'kv' && <CommonHeadersPopover onSelect={handleSelectCommonHeader} />}
        <Button variant="ghost" size="sm" onClick={handleToggleView}>
          {viewMode === 'kv' ? <Code className="mr-2" /> : <List className="mr-2" />}
          {viewMode === 'kv' ? 'JSON' : 'Key-Value'}
        </Button>
      </div>

      {viewMode === 'kv' ? (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {kvPairs.map((pair, index) => (
            <div key={pair.id} className="flex items-center gap-2">
              <Input
                placeholder={keyPlaceholder}
                value={pair.key}
                onChange={(e) => handleKvChange(pair.id, 'key', e.target.value)}
                className="font-code text-xs"
              />
              <Input
                placeholder={valuePlaceholder}
                value={pair.value}
                onChange={(e) => handleKvChange(pair.id, 'value', e.target.value)}
                className="font-code text-xs"
              />
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 text-muted-foreground" onClick={() => removePair(pair.id)} disabled={kvPairs.length <= 1 && index === 0}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addPair()}>
            <Plus className="mr-2"/> Add
          </Button>
        </div>
      ) : (
        <Textarea
          placeholder='{ "key": "value" }'
          className="font-code text-xs h-48 resize-none bg-background"
          value={jsonString}
          onChange={handleJsonChange}
        />
      )}
    </div>
  );
}


function CommonHeadersPopover({ onSelect }: { onSelect: (header: { name: string; value: string }) => void }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          Add Common
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search headers..." />
          <CommandList>
            <CommandEmpty>No headers found.</CommandEmpty>
            <CommandGroup>
              {COMMON_HEADERS.map((header) => (
                <CommandItem
                  key={header.name}
                  onSelect={() => {
                    onSelect(header);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {header.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
