// scripts/verify.js
// Starts the TypeScript server via ts-node/register and performs HTTP requests to verify endpoints.
require('ts-node/register');
require('../src/index.ts');

const http = require('http');
const paths = ['/docs/swagger.json', '/users/123', '/users/0'];
let i = 0;

function next() {
  if (i >= paths.length) {
    process.exit(0);
  }
  const p = paths[i++];
  const req = http.get({ hostname: '127.0.0.1', port: 3000, path: p }, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
      console.log(p + ' ->', res.statusCode, data);
      setTimeout(next, 200);
    });
  });
  req.on('error', (err) => {
    console.error('ERR', p, err);
    process.exit(1);
  });
}

// wait briefly for server to start
setTimeout(next, 1000);
