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

  const patches = patchDefaults(schema);

  const addAnyOfAny = {
    op: 'add',
    path: "/definitions/MetadataEntry/properties/data/anyOf/0",
    value: {
      "description": "Any form of data. (for backwards compatibility to version < 1.31.0)"
    },
  };

  patches.push(addAnyOfAny);

  const patched = jsonpatch.applyPatch(schema, patches).newDocument;

  if (shouldBump) {
    bump();
  }

  if (out) {
    console.log(`Generating schema to ${out}`);
    fs.writeFileSync(out, JSON.stringify(patched, null, 4));
  }

  return patched;

}

/**
 * Remove 'default' from the schema since its generated
 * from the tsdocs, which are not necessarily actual values,
 * but rather descriptive behavior.
 *
 * To keep this inforamtion in the schema, we append it to the
 * 'description' of the property.
 */
function patchDefaults(schema) {

  const patches = [];

  function _recurse(o, path) {
    for (const prop in o) {

      if (prop === 'description' && typeof o[prop] === 'string') {

        const description = o[prop];
        const defaultValue = o['default'];

        if (!defaultValue) {
          // property doesn't have a default value
          // skip
          continue
        }

        const descriptionWithDefault = `${description} (Default ${defaultValue})`

        const replaceDescription = {
          op: 'replace',
          path: path + '/description',
          value: descriptionWithDefault
        }

        const removeDefault = {
          op: 'remove',
          path: path + '/default'
        }

        patches.push(replaceDescription);
        patches.push(removeDefault);

      } else if (typeof o[prop] === 'object') {
        _recurse(o[prop], path + '/' + prop);
      }
    }
  }

  _recurse(schema, '');

  return patches;
}

module.exports.generate = generate;
