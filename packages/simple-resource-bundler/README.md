cdk-bundler
===========

Build tool to bundle static resources into the source of a NodeJS library.

Usage
-----

Bundles all files in the `resources/` directory of an NPM package into a file named `resources.js`,
which exports the files as `Buffers` by name in the top-level exports.

Use as follows:

    const resources = require('./resources');

    const buffer = resources['myfile.txt'];

    console.log(buffer.toString('utf-8'));
