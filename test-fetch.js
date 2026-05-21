import fetch from 'node-fetch';

async function run() {
  const url = process.argv[2] || 'http://localhost:3000';
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
