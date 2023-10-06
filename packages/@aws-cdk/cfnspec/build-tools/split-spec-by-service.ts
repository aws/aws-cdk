/* eslint-disable no-console */
/**
 * Split the given CloudFormation resource specification up into a patch set, by service
 *
 * After splitting, only write out those fragments that are valid.(*)
 *
 * The reason for this is that some service updates sometimes contain mistakes,
 * and we want to be able to take partial upgrades. By splitting the spec, we can
 * take updates to some services while leaving updates to other services behind.
 *
 * (*) If `NO_VALIDATE` is set, all pieces are written out. In normal operation this
 *     should not be used.
 */
import * as path from 'path';
import * as fs from 'fs-extra';

import { writeSorted } from './patch-set';
import { CfnSpec, CfnSpecValidator, formatErrorInContext } from './validate-cfn';

async function main(args: string[]) {
  if (args.length < 3) {
    throw new Error('Usage: split-spec-by-service <SPECFILE> <DIRECTORY> [<SERVICES>]');
  }

  const [specFile, outDir, services] = args;
  const allowedServices = services.trim().split(' ').filter(Boolean);

  log(`Loading specification: ${specFile}`);
  const spec: CfnSpec = await fs.readJson(specFile);

  // Split
  log('Splitting');
  const byService: Record<string, CfnSpec> = {};
  for (const [propTypeName, propType] of Object.entries(spec.PropertyTypes)) {
    const svcName = serviceName(propTypeName);
    serviceSpec(svcName).PropertyTypes[propTypeName] = propType;
  }
  for (const [resTypeName, resType] of Object.entries(spec.ResourceTypes)) {
    const svcName = serviceName(resTypeName);
    serviceSpec(svcName).ResourceTypes[resTypeName] = resType;
  }

  // Write out
  if (allowedServices.length > 0) {
    log(`Writing: ${allowedServices.join(' ')}`);
  } else {
    log('Writing all services');
  }
  for (const [svcName, svcSpec] of Object.entries(byService)) {
    // Skip services that are not explicitly allowed
    if (allowedServices.length > 0 && !allowedServices.includes(svcName)) {
      continue;
    }

    const successTarget = path.join(outDir, `000_${svcName}.json`);
    const rejectedTarget = path.join(outDir, `.000_${svcName}.rejected.json`);

    const errors = !process.env.NO_VALIDATE ? CfnSpecValidator.validate(svcSpec) : [];
    if (errors.length === 0) {
      // Change 'ResourceSpecificationVersion' to '$version', otherwise they will all conflict
      const toWrite = {
        PropertyTypes: svcSpec.PropertyTypes,
        ResourceTypes: svcSpec.ResourceTypes,
        $version: svcSpec.ResourceSpecificationVersion,
      };

      await writeSorted(successTarget, toWrite);
      await ensureGone(rejectedTarget);
    } else {
      console.warn('='.repeat(70));
      console.warn(' '.repeat(Math.floor(35 - svcName.length / 2)) + svcName);
      console.warn('='.repeat(70));
      for (const error of errors) {
        console.warn(formatErrorInContext(error));
      }

      await writeSorted(rejectedTarget, svcSpec);

      // Make sure that the success file exists. If not, the initial import of a
      // new service failed.
      if (!await fs.pathExists(successTarget)) {
        await writeSorted(successTarget, {
          PropertyTypes: {},
          ResourceTypes: {},
          $version: '0.0.0',
        });
      }
    }
  }
  await fs.writeJson(path.join(outDir, '001_Version.json'), {
    ResourceSpecificationVersion: spec.ResourceSpecificationVersion,
  }, { spaces: 2 });

  function serviceSpec(svcName: string) {
    if (!(svcName in byService)) {
      byService[svcName] = {
        PropertyTypes: {},
        ResourceTypes: {},
        ResourceSpecificationVersion: spec.ResourceSpecificationVersion,
      };
    }
    return byService[svcName];
  }
}

async function ensureGone(fileName: string) {
  try {
    await fs.unlink(fileName);
  } catch (e: any) {
    if (e.code === 'ENOENT') { return; }
    throw e;
  }
}

function serviceName(x: string) {
  return x.split('::').slice(0, 2).join('_');
}

function log(x: string) {
  // eslint-disable-next-line no-console
  console.log(x);
}

main(process.argv.slice(2)).catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
