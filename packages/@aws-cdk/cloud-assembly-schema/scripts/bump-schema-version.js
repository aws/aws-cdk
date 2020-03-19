const jsonpatch = require('fast-json-patch');
const semver = require('semver');
const fs = require('fs');
const path = require('path');
const fingerprint = require('../test/fingerprint');

const versionPath = '../schema/cloud-assembly.version.json';
const expectedPath = '../test/schema.expected.json';
const schemaPath = '../schema/cloud-assembly.schema.json';

// eslint-disable-next-line @typescript-eslint/no-require-imports
var schema = require(schemaPath);

// eslint-disable-next-line @typescript-eslint/no-require-imports
var version = require(versionPath);

// eslint-disable-next-line @typescript-eslint/no-require-imports
var expected = require(expectedPath);

function applyPatch(document, patch, out) {
    const patched = jsonpatch.applyPatch(document, patch).newDocument;
    fs.writeFileSync(out, JSON.stringify(patched, null, 4));
}

const currentHash = fingerprint.hashObject(schema);
const expectedHash = expected.hash;

if (currentHash != expectedHash) {

    applyPatch(version,
        [{ op:"replace", path: "/version", value: semver.inc(version.version, 'major') }],
        path.join(__dirname, versionPath))

    applyPatch(expected,
        [{ op:"replace", path: "/hash", value: currentHash }],
        path.join(__dirname, expectedPath))

}
