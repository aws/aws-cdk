import jsonpatch = require('fast-json-patch');
import fs = require('fs');
import path = require('path');
import semver = require('semver');
import TJS = require('typescript-json-schema');

function log(message: string) {
  // tslint:disable-next-line:no-console
  console.log(message);
}

function bump() {

  const metadataPath = '../schema.generated/cloud-assembly.version.json';

  const metadata = require(metadataPath);

  const oldVersion = metadata.version;
  const newVersion = semver.inc(oldVersion, 'major');

  log(`Updating schema version: ${oldVersion} -> ${newVersion}`);

  const patched = jsonpatch.applyPatch(metadata,
    [
      {
        op: "replace",
        path: "/version",
        value: newVersion
      }
    ]
  ).newDocument;

  const out = path.join(__dirname, metadataPath);
  fs.writeFileSync(out, JSON.stringify(patched, null, 4));

}

function generate(out: string, shouldBump: boolean) {

  const settings = {
    required: true,
    ref: true,
    topRef: true,
    noExtraProps: true,
    out
  };

  const compilerOptions = {
    strictNullChecks: true
  };

  const program = TJS.getProgramFromFiles([path.join(__dirname, "../lib/manifest.d.ts")], compilerOptions);
  const schema = TJS.generateSchema(program, 'AssemblyManifest', settings);

  const patches = patchDefaults(schema);

  const addAnyOfAny: jsonpatch.AddOperation<any> = {
    op: 'add',
    path: "/definitions/MetadataEntry/properties/data/anyOf/0",
    value: {
      description: "Free form data."
    },
  };

  patches.push(addAnyOfAny);

  const patched = jsonpatch.applyPatch(schema, patches).newDocument;

  if (shouldBump) {
    bump();
  }

  if (out) {
    log(`Generating schema to ${out}`);
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
function patchDefaults(schema: any): jsonpatch.Operation[] {

  const patches: jsonpatch.Operation[] = [];

  function _recurse(o: any, currentPath: string) {
    for (const prop in o) {

      if (prop === 'description' && typeof o[prop] === 'string') {

        const description = o[prop];
        const defaultValue = o.default;

        if (!defaultValue) {
          // property doesn't have a default value
          // skip
          continue;
        }

        const descriptionWithDefault = `${description} (Default ${defaultValue})`;

        const replaceDescription: jsonpatch.ReplaceOperation<string> = {
          op: 'replace',
          path: currentPath + '/description',
          value: descriptionWithDefault
        };

        const removeDefault: jsonpatch.RemoveOperation = {
          op: 'remove',
          path: currentPath + '/default'
        };

        patches.push(replaceDescription);
        patches.push(removeDefault);

      } else if (typeof o[prop] === 'object') {
        _recurse(o[prop], currentPath + '/' + prop);
      }
    }
  }

  _recurse(schema, '');

  return patches;
}

module.exports.generate = generate;
