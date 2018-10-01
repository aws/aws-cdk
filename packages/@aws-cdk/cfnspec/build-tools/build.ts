/*
 * Invoked as part of the "build" script of this package,
 * this script takes all specification fragments in the
 * `spec-source` folder and generates a unified specification
 * document at `spec/specification.json`.
 */

import fastJsonPatch = require('fast-json-patch');
import fs = require('fs-extra');
import md5 = require('md5');
import path = require('path');
import { schema } from '../lib';

async function main() {
  const inputDir = path.join(process.cwd(), 'spec-source');
  const files = await fs.readdir(inputDir);
  const spec: schema.Specification = { PropertyTypes: {}, ResourceTypes: {}, Fingerprint: '' };
  for (const file of files.filter(n => n.endsWith('.json')).sort()) {
    const data = await fs.readJson(path.join(inputDir, file));
    if (file.indexOf('patch') === -1) {
      decorateResourceTypes(data);
      forEachSection(spec, data, merge);
    } else {
      forEachSection(spec, data, patch);
    }
  }

  spec.Fingerprint = md5(JSON.stringify(normalize(spec)));

  const outDir = path.join(process.cwd(), 'spec');
  await fs.mkdirp(outDir);
  await fs.writeJson(path.join(outDir, 'specification.json'), spec, { spaces: 2 });
}

function forEachSection(spec: schema.Specification, data: any, cb: (spec: any, fragment: any, path: string[]) => void) {
  cb(spec.PropertyTypes, data.PropertyTypes, ['PropertyTypes']);
  cb(spec.ResourceTypes, data.ResourceTypes, ['ResourceTypes']);
  // Per-resource specs are keyed on ResourceType (singular), but we want it in ResourceTypes (plural)
  cb(spec.ResourceTypes, data.ResourceType, ['ResourceType']);
}

function decorateResourceTypes(data: any) {
  const requiredTransform = data.ResourceSpecificationTransform as string | undefined;
  if (!requiredTransform) { return; }
  const resourceTypes = data.ResourceTypes || data.ResourceType;
  for (const name of Object.keys(resourceTypes)) {
    resourceTypes[name].RequiredTransform = requiredTransform;
  }
}

function merge(spec: any, fragment: any, jsonPath: string[]) {
  if (!fragment) { return; }
  for (const key of Object.keys(fragment)) {
    if (key in spec) {
      const specVal = spec[key];
      const fragVal = fragment[key];
      if (typeof specVal !== typeof fragVal) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Attempted to merge ${JSON.stringify(fragVal)} into incompatible ${JSON.stringify(specVal)} at path ${jsonPath.join('/')}/${key}`);
      }
      if (typeof specVal !== 'object') {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Conflict when attempting to merge ${JSON.stringify(fragVal)} into ${JSON.stringify(specVal)} at path ${jsonPath.join('/')}/${key}`);
      }
      merge(specVal, fragVal, [...jsonPath, key]);
    } else {
      spec[key] = fragment[key];
    }
  }
}

function patch(spec: any, fragment: any) {
  if (!fragment) { return; }
  if ('patch' in fragment) {
    // tslint:disable-next-line:no-console
    console.log(`Applying patch: ${fragment.patch.description}`);
    fastJsonPatch.applyPatch(spec, fragment.patch.operations);
  } else {
    for (const key of Object.keys(fragment)) {
      patch(spec[key], fragment[key]);
    }
  }
}

/**
 * Modifies the provided specification so that ``ResourceTypes`` and ``PropertyTypes`` are listed in alphabetical order.
 *
 * @param spec an AWS CloudFormation Resource Specification document.
 *
 * @returns ``spec``, after having sorted the ``ResourceTypes`` and ``PropertyTypes`` sections alphabetically.
 */
function normalize(spec: schema.Specification): schema.Specification {
  spec.ResourceTypes = normalizeSection(spec.ResourceTypes);
  if (spec.PropertyTypes) {
    spec.PropertyTypes = normalizeSection(spec.PropertyTypes);
  }
  return spec;

  function normalizeSection<T>(section: { [name: string]: T }): { [name: string]: T } {
    const result: { [name: string]: T } = {};
    for (const key of Object.keys(section).sort()) {
      result[key] = section[key];
    }
    return result;
  }
}

main()
  .catch(e => {
    // tslint:disable-next-line:no-console
    console.error(e.stack);
    process.exit(-1);
  });
