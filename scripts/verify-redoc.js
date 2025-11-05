// scripts/verify-redoc.js
require('ts-node/register');
require('../src/index.ts');
const http = require('http');

function get(path, cb){
  http.get({ hostname: '127.0.0.1', port: 3000, path }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => cb(null, res.statusCode, d));
  }).on('error', e => cb(e));
}

setTimeout(()=>{
  get('/openapi.json', (err, status, body) => {
    if(err) return void console.error('/openapi.json ERR', err);
    console.log('/openapi.json ->', status, body.slice(0,120).replace(/\n/g,'') + '...');
    get('/redoc', (err2, status2, body2) => {
      if(err2) return void console.error('/redoc ERR', err2);
      console.log('/redoc ->', status2, body2.slice(0,120).replace(/\n/g,'') + '...');
      process.exit(0);
    });
  });
}, 1000);
