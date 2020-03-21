const jsonpatch = require('fast-json-patch');
const fs = require('fs');
const path = require('path');

const schemaPath = '../schema/cloud-assembly.schema.json';

// eslint-disable-next-line @typescript-eslint/no-require-imports
var schema = require(schemaPath);

function applyPatch(document, patch, out) {
    const patched = jsonpatch.applyPatch(document, patch).newDocument;
    fs.writeFileSync(out, JSON.stringify(patched, null, 4));
}

applyPatch(schema,
    [
        {
            op: "remove",
            path: "/definitions/ContainerImageAssetMetadataEntry",
            value: {}
        },
        {
            op: "remove",
            path: "/definitions/FileAssetMetadataEntry",
            value: {}
        },
        {
            op: "remove",
            path: "/definitions/Tag",
            value: {}
        },
        {
            op: "remove",
            path: "/definitions/MetadataEntry/properties/data/anyOf",
            value: {}
        }
    ],
    path.join(__dirname, schemaPath))
