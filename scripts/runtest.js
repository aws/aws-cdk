#!/usr/bin/env node
// Helper script to invoke 'nodeunit' on a .ts file. This should involve compilation, it doesn't right now.
//
// Example launch config to use with this script:
//
//     {
//          "configurations": [
//              {
//                  "type": "node",
//                  "request": "launch",
//                  "name": "Debug Current Unit Test File",
//                  "program": "${workspaceFolder}/scripts/runtest.js",
//                  "args": [
//                      "${file}"
//                  ]
//              }
//          ]
//      }⏎
const path = require('path');

// Unfortunately, nodeunit has no programmatic interface. Therefore, the
// easiest thing to do is rewrite the argv arguments where we change
// .ts into .js.

for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].endsWith('.ts')) {
        process.argv[i] = process.argv[i].substring(0, process.argv[i].length - 3) + '.js';
    }
}

// Just pretend we're calling the program directly
require(path.resolve(__dirname, '..', 'node_modules', '.bin', 'nodeunit'));
