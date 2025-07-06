import { fetchToc, searchDocumentation } from "./ibm-cloud-api";

import { parseDocsUrl } from "./utils";

// Output: https://raw.githubusercontent.com/ibm-cloud-docs/vsrx/refs/heads/master/vsrx-securing-host-operating-system.md
const searchResults = await searchDocumentation({
  q: `how to start an ubuntu vsi`,
  offset: 10,
});
fetchToc(parseDocsUrl(searchResults.topics[0]?.href!)).then(console.log);
