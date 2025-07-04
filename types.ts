export interface SearchResultItem {
  href: string;
  last_update: string;
  summary: string[];
  title: string;
  content_type: string;
  subcollection: string;
  description: string;
  subcollectionName?: string;
}

export interface DocumentationResponse {
  total: number;
  offset: number;
  count: number;
  tags: string[];
  types: string[];
  topics: SearchResultItem[];
}
