
"use client"

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, History, FolderKanban, PlusCircle, Save, FolderPlus, Trash2, Play } from "lucide-react"
import type { Collection, CollectionItem, HistoryItem } from '@/lib/types'
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatDistanceToNow } from 'date-fns';

interface SchemaExplorerProps {
  schema: any;
  history: HistoryItem[];
  collections: Collection[];
  onSelectHistory: (query: string) => void;
  onSelectCollectionItem: (item: CollectionItem) => void;
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  currentQuery: { query: string; variables?: string; headers?: string };
}

export function SchemaExplorer({ schema, history, collections, onSelectHistory, onSelectCollectionItem, setCollections, currentQuery }: SchemaExplorerProps) {
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
            <TabsTrigger value="schema" className="py-1.5 px-2.5"><Search className="w-4 h-4 mr-1.5" /> Schema</TabsTrigger>
            <TabsTrigger value="collections" className="py-1.5 px-2.5"><FolderKanban className="w-4 h-4 mr-1.5" /> Collections</TabsTrigger>
            <TabsTrigger value="history" className="py-1.5 px-2.5"><History className="w-4 h-4 mr-1.5" /> History</TabsTrigger>
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
        <TabsContent value="collections" className="flex-1 flex flex-col m-0">
          <CollectionsView 
            collections={collections} 
            setCollections={setCollections}
            onSelectCollectionItem={onSelectCollectionItem}
            currentQuery={currentQuery}
          />
        </TabsContent>
        <TabsContent value="history" className="flex-1 flex flex-col m-0">
          <HistoryView history={history} onSelectHistory={onSelectHistory} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function HistoryView({ history, onSelectHistory }: { history: HistoryItem[], onSelectHistory: (query: string) => void }) {
  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm flex-1 flex items-center justify-center p-4">
        <p>Your query history will appear here.</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {history.map(item => (
          <button 
            key={item.id} 
            onClick={() => onSelectHistory(item.query)}
            className="w-full text-left p-2 rounded-md hover:bg-accent focus:outline-none focus:bg-accent transition-colors"
          >
            <p className="text-xs font-code truncate" title={item.query}>{item.query.replace(/\s+/g, ' ').trim()}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(item.timestamp, { addSuffix: true })}</p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function CollectionsView({ collections, setCollections, onSelectCollectionItem, currentQuery }: Omit<SchemaExplorerProps, 'schema' | 'history' | 'onSelectHistory'>) {
    const [newCollectionName, setNewCollectionName] = React.useState('');
    const { toast } = useToast();

    const handleCreateCollection = () => {
        if (!newCollectionName.trim()) {
            toast({ variant: 'destructive', title: 'Collection name is required.' });
            return;
        }
        setCollections(prev => [...prev, { id: Date.now().toString(), name: newCollectionName, queries: [] }]);
        setNewCollectionName('');
        toast({ title: `Collection "${newCollectionName}" created.` });
    }

    const handleDeleteCollection = (collectionId: string) => {
        setCollections(prev => prev.filter(c => c.id !== collectionId));
        toast({ title: 'Collection deleted.' });
    }

    if (collections.length === 0) {
        return (
          <div className="text-center text-muted-foreground text-sm flex-1 flex flex-col items-center justify-center p-4 gap-4">
              <p>You don't have any collections yet.</p>
              <CreateCollectionDialog
                newCollectionName={newCollectionName}
                setNewCollectionName={setNewCollectionName}
                handleCreateCollection={handleCreateCollection}
              />
          </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-2 border-b flex justify-between items-center">
                <h3 className="font-semibold text-sm px-2">Collections</h3>
                <div className="flex gap-2">
                    <SaveQueryDialog collections={collections} setCollections={setCollections} currentQuery={currentQuery} />
                    <CreateCollectionDialog
                      newCollectionName={newCollectionName}
                      setNewCollectionName={setNewCollectionName}
                      handleCreateCollection={handleCreateCollection}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <Accordion type="multiple" className="w-full px-2">
                    {collections.map(collection => (
                        <AccordionItem value={collection.id} key={collection.id}>
                            <AccordionTrigger className="text-sm hover:no-underline py-2">
                                <div className="flex justify-between w-full items-center pr-2">
                                    <span className="font-medium">{collection.name}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteCollection(collection.id); }}>
                                        <Trash2 className="h-3 w-3"/>
                                    </Button>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {collection.queries.length === 0 ? (
                                    <p className="text-xs text-muted-foreground px-4 py-2">No queries in this collection yet.</p>
                                ) : (
                                    <div className="space-y-1">
                                        {collection.queries.map(q => (
                                            <button key={q.id} onClick={() => onSelectCollectionItem(q)} className="w-full text-left p-2 rounded-md hover:bg-accent focus:outline-none focus:bg-accent transition-colors flex justify-between items-center group">
                                                <div className="pl-2">
                                                    <p className="text-xs font-semibold">{q.name}</p>
                                                    <p className="text-xs font-code text-muted-foreground truncate" title={q.query}>{q.query.replace(/\s+/g, ' ').trim()}</p>
                                                </div>
                                                <Play className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
        </div>
    );
}

function CreateCollectionDialog({ newCollectionName, setNewCollectionName, handleCreateCollection }: { newCollectionName: string, setNewCollectionName: (val: string) => void, handleCreateCollection: () => void }) {
    const [open, setOpen] = React.useState(false);

    const handleSubmit = () => {
        handleCreateCollection();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Collection
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>
                        Collections help you organize your GraphQL queries.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} className="col-span-3" placeholder="e.g., User Queries" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Create Collection</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function SaveQueryDialog({ collections, setCollections, currentQuery }: { collections: Collection[], setCollections: React.Dispatch<React.SetStateAction<Collection[]>>, currentQuery: { query: string; variables?: string; headers?: string } }) {
    const [open, setOpen] = React.useState(false);
    const [queryName, setQueryName] = React.useState('');
    const [selectedCollectionId, setSelectedCollectionId] = React.useState<string | undefined>(collections[0]?.id);
    const { toast } = useToast();

    React.useEffect(() => {
        if (collections.length > 0 && !selectedCollectionId) {
            setSelectedCollectionId(collections[0].id);
        }
    }, [collections, selectedCollectionId]);


    const handleSave = () => {
        if (!queryName.trim()) {
            toast({ variant: 'destructive', title: 'Query name is required.' });
            return;
        }
        if (!selectedCollectionId) {
            toast({ variant: 'destructive', title: 'Please select a collection.' });
            return;
        }

        setCollections(prev => prev.map(c => {
            if (c.id === selectedCollectionId) {
                const newQuery: CollectionItem = {
                    id: Date.now().toString(),
                    name: queryName,
                    query: currentQuery.query,
                    variables: currentQuery.variables,
                    headers: currentQuery.headers,
                };
                return { ...c, queries: [...c.queries, newQuery] };
            }
            return c;
        }));

        toast({ title: 'Query Saved', description: `"${queryName}" was saved to your collection.` });
        setQueryName('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={collections.length === 0 || !currentQuery.query}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Save Query</DialogTitle>
                    <DialogDescription>
                        Save the current query, variables, and headers to a collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="query-name">Query Name</Label>
                        <Input id="query-name" value={queryName} onChange={(e) => setQueryName(e.target.value)} placeholder="e.g., Get All Users" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="collection">Collection</Label>
                        <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
                            <SelectTrigger id="collection">
                                <SelectValue placeholder="Select a collection" />
                            </SelectTrigger>
                            <SelectContent>
                                {collections.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save Query</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}