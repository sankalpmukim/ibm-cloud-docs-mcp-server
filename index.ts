import { searchDocumentation } from "./ibm-cloud-api";

console.log(
  JSON.stringify(
    await searchDocumentation({ q: `how to start an ubuntu vsi`, offset: 10 })
  )
);
