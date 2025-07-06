import { extractContentAndConvertToMarkdown, parseDocsUrl } from "./utils";
import { fetchToc, searchDocumentation } from "./ibm-cloud-api";

// Output: https://raw.githubusercontent.com/ibm-cloud-docs/vsrx/refs/heads/master/vsrx-securing-host-operating-system.md
const searchResults = await searchDocumentation({
  q: `how to start an ubuntu vsi`,
  offset: 10,
});
console.log(`search results retrieved`);
fetchToc(parseDocsUrl(searchResults.topics[0]?.href!)).then((v) =>
  console.log(extractContentAndConvertToMarkdown(v))
);
