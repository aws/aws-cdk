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

const metadataRefs = []

for (what of schema.definitions.MetadataEntry.properties.data.anyOf) {

    let ref = undefined;

    if (what.$ref) {
        ref = what.$ref;
    }

    if (what.type === 'array') {
        ref = what.items.$ref;
    }

    if (ref) {
        metadataRefs.push(ref.replace('#', ''))
    }

}

const patches = [
    {
        op: "remove",
        path: "/definitions/MetadataEntry/properties/data/anyOf"
    }
]

for (ref of metadataRefs) {
    patches.push({op: "remove", path: ref})
}

applyPatch(schema, patches, path.join(__dirname, schemaPath))
