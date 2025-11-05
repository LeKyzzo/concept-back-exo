// scripts/build-openapi.js
// Builds the OpenAPI JSON file by loading the TypeScript swagger spec via ts-node
require('ts-node/register');
const fs = require('fs');
const path = require('path');

const mod = require('../src/swagger');
const swaggerSpec = (mod && mod.default) ? mod.default : mod;

const outPath = path.resolve(__dirname, '..', 'openapi.json');
fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2));
console.log('Wrote', outPath);
