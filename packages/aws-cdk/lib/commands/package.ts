import cloudAssembly = require('@aws-cdk/cloud-assembly');
import cxapi = require('@aws-cdk/cx-api');
import archiver = require('archiver');
import fs = require('fs-extra');
import path = require('path');
import process = require('process');
import YAML = require('yaml');
import yargs = require('yargs');
import { SDK } from '../api';
import { AppStacks } from '../api/cxapp/stacks';
import { print, warning } from '../logging';
import { Configuration, Settings } from '../settings';

export const command = 'package';
export const describe = 'Package a CDK Application to a Cloud Assembly';
export const builder: yargs.CommandBuilder = {
  out: {
    type: 'string',
    desc: 'The file to output the Cloud Assembly to',
    default: 'assembly.cloud',
  }
};

export async function handler(argv: yargs.Arguments): Promise<number> {
  const configuration = await new Configuration(_argumentsToSettings(argv)).load();
  const appStacks = new AppStacks(argv, configuration, new SDK({
    profile: argv.profile,
    proxyAddress: argv.proxy,
    ec2creds: argv.ec2creds,
  }));
  const outFile = path.resolve(process.cwd(), argv.out);
  await _createCloudAssembly(await appStacks.synthesizeStacks(), outFile);
  print(outFile);
  return 0;
}

function _argumentsToSettings(argv: yargs.Arguments) {
  const context: any = {};

  // Turn list of KEY=VALUE strings into an object
  for (const assignment of (argv.context || [])) {
    const parts = assignment.split('=', 2);
    if (parts.length === 2) {
      if (parts[0].match(/^aws:.+/)) {
        throw new Error(`User-provided context cannot use keys prefixed with 'aws:', but ${parts[0]} was provided.`);
      }
      context[parts[0]] = parts[1];
    } else {
      warning('Context argument is not an assignment (key=value): %s', assignment);
    }
  }

  return new Settings({
    app: argv.app,
    context,
    toolkitStackName: argv.toolkitStackName,
    versionReporting: argv.versionReporting,
    pathMetadata: argv.pathMetadata,
  });
}

function _createCloudAssembly(synth: cxapi.SynthesizeResponse, outFile: string): Promise<void> {
  return new Promise<void>(async (ok, ko) => {
    const writeStream = fs.createWriteStream(outFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    writeStream.on('close', ok);
    archive.on('error', ko);
    archive.on('warning', ko);
    archive.pipe(writeStream);

    const manifest: cloudAssembly.Manifest = {
      schema: 'cloud-assembly/1.0',
      drops: {}
    };

    await Promise.all(synth.stacks.map(stack => _makeStackDrop(stack, archive, manifest)));

    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

    archive.finalize();
  });
}

async function _makeStackDrop(stack: cxapi.SynthesizedStack,
                              archive: archiver.Archiver,
                              manifest: cloudAssembly.Manifest): Promise<void> {
  const name = `${stack.name}/template.yml`;
  archive.append(YAML.stringify(stack.template, { schema: 'yaml-1.1' }), { name });
  const parameters = await _processAssets(stack, archive, manifest);
  manifest.drops[stack.name] = {
    type: 'npm://@aws-cdk/cdk/Stack',
    environment: `aws://${stack.environment.account}/${stack.environment.region}`,
    properties: {
      name: stack.name,
      template: name,
      parameters
    }
  };
}

async function _processAssets(stack: cxapi.SynthesizedStack,
                              archive: archiver.Archiver,
                              manifest: cloudAssembly.Manifest): Promise<{ [name: string]: string }> {
  const result: { [name: string]: string } = {};
  for (const key of Object.keys(stack.metadata)) {
    const assets = stack.metadata[key].filter(entry => entry.type === cxapi.ASSET_METADATA && entry.data)
                                      .map(entry => entry.data! as cxapi.AssetMetadataEntry);
    for (const asset of assets) {
      const dropName = `${stack.name}/${asset.id}`;
      let name: string;
      switch (asset.packaging) {
      case 'file':
        name = path.join(key, path.basename(asset.path));
        archive.file(asset.path, { name });
        manifest.drops[dropName] = {
          type: 'npm://@aws-cdk/cdk/S3Object',
          environment: `aws://${stack.environment.account}/${stack.environment.region}`,
          properties: { path: name }
        };
        result[asset.s3BucketParameter] = '${' + dropName + '.s3Bucket}';
        result[asset.s3KeyParameter] = '${' + dropName + '.s3ObjectKey}';
        break;
      case 'zip':
        const zip = archiver('zip', { zlib: { level: 9 } });
        name = path.join(key, `${path.basename(asset.path)}.zip`);
        archive.append(zip, { name });
        zip.directory(asset.path, '');
        zip.finalize();
        manifest.drops[dropName] = {
          type: 'npm://@aws-cdk/cdk/S3Object',
          environment: `aws://${stack.environment.account}/${stack.environment.region}`,
          properties: { path: name }
        };
        result[asset.s3BucketParameter] = '${' + dropName + '.s3Bucket}';
        result[asset.s3KeyParameter] = '${' + dropName + '.s3ObjectKey}';
        break;
      case 'container-image':
      default:
        throw new Error(`Unsupported asset packaging ${asset.packaging} used at ${key}`);
      }
    }
  }
  return result;
}
