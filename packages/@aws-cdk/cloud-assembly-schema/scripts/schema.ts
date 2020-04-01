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

  const out = path.join(__dirname, metadataPath);
  fs.writeFileSync(out, JSON.stringify({version: newVersion}));

}

export function generate(out: string, shouldBump: boolean) {

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

  augmentDescription(schema);
  addAnyMetadataEntry(schema);

  if (shouldBump) {
    bump();
  }

  if (out) {
    log(`Generating schema to ${out}`);
    fs.writeFileSync(out, JSON.stringify(schema, null, 4));
  }

  return schema;

}

/**
 * Remove 'default' from the schema since its generated
 * from the tsdocs, which are not necessarily actual values,
 * but rather descriptive behavior.
 *
 * To keep this inforamtion in the schema, we append it to the
 * 'description' of the property.
 */
function augmentDescription(schema: any) {

  function _recurse(o: any) {
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

        delete o.default;
        o[prop] = descriptionWithDefault;

      } else if (typeof o[prop] === 'object') {
        _recurse(o[prop]);
      }
    }
  }

  _recurse(schema);

}

/**
 * Patch the properties of MetadataEntry to allow
 * specifying any free form data. This is needed since source
 * code doesn't allow this in order to enforce stricter jsii
 * compatibility checks.
 */
function addAnyMetadataEntry(schema: any) {
  schema.definitions.MetadataEntry.properties.data.anyOf.push({description: "Free form data."});
}
