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

export interface TopicEntry {
  href: string;
  label: string;
  content?: string;
  lastupdated?: string;
  anchors?: TopicEntry[];
}

export interface TocApiResponse {
  consolepage: string;
  defaultTopic: string;
  desc: string;
  landing: {
    console_page: string;
    introduction: string;
    product_page: string;
    section_devtools?: any;
    section_highlights?: any[];
    section_topics?: any;
    section_updates?: any;
    title: string;
    version: number;
  };
  navgroups: {
    [groupName: string]: any[];
  };
  productpage: string;
  properties: Array<{
    name: string;
    value: string | number;
  }>;
  subcollection: string;
  topics: {
    [topicId: string]: TopicEntry;
  };
}

export interface PageItemTopicPath {
  path: string;
  topic: string;
}
