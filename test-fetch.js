import fetch from 'node-fetch';

async function run() {
  const url = process.argv[2] || 'http://localhost:3000';
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    const html = await res.text();
    console.log("TITLE:", html.match(/<title>.*?<\/title>/));
    console.log("Scripts:", html.match(/<script.*?<\/script>/g));
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
