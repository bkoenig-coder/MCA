import fetch from 'node-fetch';

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'test', email: 'test@example.com', subject: 'test', message: 'test' })
    });
    console.log("Contact status:", res.status);
    console.log(await res.text());
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
