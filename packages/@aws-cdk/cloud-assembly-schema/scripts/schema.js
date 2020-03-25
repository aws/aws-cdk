const jsonpatch = require('fast-json-patch');
const TJS = require('typescript-json-schema');
const path = require('path');
const semver = require('semver');

function applyPatch(document, patch, out) {
  const patched = jsonpatch.applyPatch(document, patch).newDocument;
  if (out) {
    fs.writeFileSync(out, JSON.stringify(patched, null, 4));
  }
  return patched;
}

function bump() {

  const metadataPath = '../schema/cloud-assembly.metadata.json';

  var metadata = require(metadataPath);

  const oldVersion = metadata.version
  const newVersion = semver.inc(oldVersion, 'major');

  console.log(`Updating schema version: ${oldVersion} -> ${newVersion}`);

  applyPatch(metadata,
    [
      {
        op:"replace",
        path: "/version",
        value: newVersion
      }
    ],
    path.join(__dirname, metadataPath))

}

module.exports.generate = function(out, shouldBump) {

    const settings = {
      required: true,
      ref: true,
      topRef: true,
      noExtraProps: true,
      out: out
    };

    const compilerOptions = {
      strictNullChecks: true
    };

    const program = TJS.getProgramFromFiles([path.join(__dirname, "../lib/manifest.d.ts")], compilerOptions);
    const schema = TJS.generateSchema(program, 'AssemblyManifest', settings);

    const addAnyOfAny = {
      op: 'add',
      path: "/definitions/MetadataEntry/properties/data/anyOf/0",
      value: {
        "description": "Any form of data. (for backwards compatibility to version < 1.31.0)"
      },

    };

    if (shouldBump) {
      bump();
    }

    if (out) {
      console.log(`Generating schema to ${out}`);
    }

    return applyPatch(schema, [addAnyOfAny], out);

  }
