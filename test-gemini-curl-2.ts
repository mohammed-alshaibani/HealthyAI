import https from 'https';

const data = JSON.stringify({
  model: 'gemini-2.5-flash',
  messages: [{ role: 'user', content: 'Say hello' }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: '/v1beta/openai/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer AQ.Ab8RN6JG3tadbRA-21Jc2xfna6CBBD-cSg4zJu7sGV2Jq6WAmg'
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
