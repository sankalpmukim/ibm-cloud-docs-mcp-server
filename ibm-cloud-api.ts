import type {
  DocumentationResponse,
  PageItemTopicPath,
  TocApiResponse,
} from "./types";

export async function searchDocumentation(searchFilters: {
  q: string;
  offset: number;
}): Promise<DocumentationResponse> {
  const params = new URLSearchParams();

  Object.entries({ ...searchFilters, locale: "en" }).forEach(([k, v]) => {
    if (v !== "undefined" && v !== "") {
      params.append(k, v.toString());
    }
  });

  const response = await fetch(
    `https://cloud.ibm.com/docs/api/search?${params.toString()}`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "ibm-csrf-token": "undefined",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=0",
      },
      referrer:
        "https://cloud.ibm.com/docs/search?q=how+to+create+an+ubuntu+vsi",
      method: "GET",
      mode: "cors",
    }
  );

  return response.json() as Promise<DocumentationResponse>;
}

export async function fetchToc(params: PageItemTopicPath) {
  const res = await fetch(
    `https://cloud.ibm.com/docs-content/v4/toc/${params.path}?locale=en`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "If-None-Match": '"17d84-mkfgHd55l4EKvtFUNwN4hSwuxv8"',
        Priority: "u=4",
      },
      referrer:
        "https://cloud.ibm.com/docs/bare-metal?topic=bare-metal-adding-ipv6-to-ubuntu-systems",
      method: "GET",
      mode: "cors",
    }
  ).then((res) => res.json() as Promise<TocApiResponse>);

  const topicData = res.topics[params.topic];
  const contentHref = topicData?.content;
  if (!topicData || !contentHref) {
    throw new Error(`invalid response from toc4 first api call`);
  }

  const res2 = await fetch(
    `https://cloud.ibm.com/docs-content${contentHref.replace(
      "/docs-content",
      ""
    )}`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0",
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=4",
      },
      referrer:
        "https://cloud.ibm.com/docs/containers?topic=containers-ubuntu-migrate",
      method: "GET",
      mode: "cors",
    }
  ).then((res) => res.text());
  return res2;
}
