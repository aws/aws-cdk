/* eslint-disable */
const jsonpatch = require('fast-json-patch');
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const fingerprint = require('../test/fingerprint');

// eslint-disable-next-line @typescript-eslint/no-require-imports
var schema = require('../schema/cloud-assembly.schema.json');

// eslint-disable-next-line @typescript-eslint/no-require-imports
var version = require('../schema/cloud-assembly.version.json');

// eslint-disable-next-line @typescript-eslint/no-require-imports
var expected = require('../test/schema.expected.json');

function applyPatch(document, patch, out) {
    const patched = jsonpatch.applyPatch(document, patch).newDocument;
    fs.writeFileSync(out, JSON.stringify(patched, null, 4));
}

applyPatch(version,
    [{ op:"replace", path: "/version", value: semver.inc(version.version, 'major') }],
    path.join(__dirname, '../schema/cloud-assembly.version.json'))

applyPatch(expected,
    [{ op:"replace", path: "/hash", value: fingerprint.hashObject(schema) }],
    path.join(__dirname, '../test/schema.expected.json'))
