import { initializeApp } from "firebase/admin/app";
import { getFirestore } from "firebase-admin/firestore";
import config from "./firebase-applet-config.json" with { type: "json" };

const app = initializeApp({ projectId: config.projectId });
const db = getFirestore(app);

async function run() {
  const posts = await db.collection("posts").get();
  posts.forEach(doc => {
    console.log(doc.id, doc.data().slug);
  });
}
run();
