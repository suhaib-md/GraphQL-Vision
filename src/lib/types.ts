
export interface Environment {
  id: string;
  name: string;
  url: string;
  token?: string;
  color: string;
}

export interface HistoryItem {
    id: string;
    query: string;
    timestamp: Date;
}

export interface CollectionItem {
    id: string;
    name: string;
    query: string;
    variables?: string;
    headers?: string;
}

export interface Collection {
    id: string;
    name: string;
    queries: CollectionItem[];
}
