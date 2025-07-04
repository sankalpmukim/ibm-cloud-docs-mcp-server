import type { DocumentationResponse } from "./types";

// await fetch(
//   "https://cloud.ibm.com/docs/api/search?q=how%20to%20create%20an%20redhat%20vsi&locale=en&offset=10",
//   {
//     credentials: "include",
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0",
//       Accept: "application/json",
//       "Accept-Language": "en-US,en;q=0.5",
//       "ibm-csrf-token": "undefined",
//       "Sec-Fetch-Dest": "empty",
//       "Sec-Fetch-Mode": "cors",
//       "Sec-Fetch-Site": "same-origin",
//       Priority: "u=0",
//     },
//     referrer:
//       "https://cloud.ibm.com/docs/search?q=how+to+create+an+redhat+vsi&offset=10",
//     method: "GET",
//     mode: "cors",
//   }
// );

// await fetch("https://cloud.ibm.com/docs/api/search?q=how%20to%20create%20an%20redhat%20vsi&locale=en&offset=30", {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0",
//         "Accept": "application/json",
//         "Accept-Language": "en-US,en;q=0.5",
//         "ibm-csrf-token": "undefined",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin",
//         "Priority": "u=0"
//     },
//     "referrer": "https://cloud.ibm.com/docs/search?q=how+to+create+an+redhat+vsi&offset=30",
//     "method": "GET",
//     "mode": "cors"
// });

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
