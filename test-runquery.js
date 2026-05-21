import config from "./firebase-applet-config.json" with { type: "json" };
import fetch from "node-fetch";

async function run() {
  const databaseId = config.firestoreDatabaseId || "(default)";
  // Let's use runQuery without a where clause to get a list of posts up to 2
  const queryBody = {
    structuredQuery: {
      from: [{ collectionId: "posts" }],
      limit: 2
    }
  };
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${databaseId}/documents:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(queryBody)
  });
  const text = await response.text();
  console.log("Status:", response.status);
  console.log(text);
}
run();
