import type { PageItemTopicPath } from "./types";

export function parseDocsUrl(urlString: string): PageItemTopicPath {
  const regex = /^\/docs\/([^?]+)\?topic=(.+)$/;
  const match = urlString.match(regex);

  if (match === null || !match[1] || !match[2]) {
    throw new Error("could not find match");
  }

  return {
    path: match[1], // $1
    topic: match[2], // $2
  };
}
