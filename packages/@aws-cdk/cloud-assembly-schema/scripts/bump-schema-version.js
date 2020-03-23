const jsonpatch = require('fast-json-patch');
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const fingerprint = require('../test/fingerprint');

const metadataPath = '../schema/cloud-assembly.metadata.json';
const expectedPath = '../test/schema.expected.json';
const schemaPath = '../schema/cloud-assembly.schema.json';

// eslint-disable-next-line @typescript-eslint/no-require-imports
var schema = require(schemaPath);

// eslint-disable-next-line @typescript-eslint/no-require-imports
var metadata = require(metadataPath);

// eslint-disable-next-line @typescript-eslint/no-require-imports
var expected = require(expectedPath);

function applyPatch(document, patch, out) {
    const patched = jsonpatch.applyPatch(document, patch).newDocument;
    fs.writeFileSync(out, JSON.stringify(patched, null, 4));
}

const currentHash = fingerprint.hashObject(schema);
const expectedHash = expected.hash;

if (currentHash != expectedHash) {

    const currentVersion = metadata.version;
    const newVersion = semver.inc(metadata.version, 'major');

    console.log(`Schema.version: ${currentVersion} -> ${newVersion}`)
    applyPatch(metadata,
        [{ op:"replace", path: "/version", value: newVersion }],
        path.join(__dirname, metadataPath))

    console.log(`Expected.hash: ${currentHash} -> ${expectedHash}`)
    applyPatch(expected,
        [{ op:"replace", path: "/hash", value: currentHash }],
        path.join(__dirname, expectedPath))
}
