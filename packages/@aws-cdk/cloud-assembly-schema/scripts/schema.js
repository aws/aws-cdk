const jsonpatch = require('fast-json-patch');
const TJS = require('typescript-json-schema');
const path = require('path');
const semver = require('semver');

function bump() {

  const metadataPath = '../schema/cloud-assembly.metadata.json';

  var metadata = require(metadataPath);

  const oldVersion = metadata.version
  const newVersion = semver.inc(oldVersion, 'major');

  console.log(`Updating schema version: ${oldVersion} -> ${newVersion}`);

  const patched = jsonpatch.applyPatch(metadata,
    [
      {
        op:"replace",
        path: "/version",
        value: newVersion
      }
    ]
  ).newDocument;

  const out = path.join(__dirname, metadataPath);
  fs.writeFileSync(out, JSON.stringify(patched, null, 4));

}

function generate(out, shouldBump) {

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

  const patched = jsonpatch.applyPatch(schema, [addAnyOfAny]).newDocument;

  if (shouldBump) {
    bump();
  }

  if (out) {
    console.log(`Generating schema to ${out}`);
    fs.writeFileSync(out, JSON.stringify(patched, null, 4));
  }

  return patched;

}

module.exports.generate = generate;
