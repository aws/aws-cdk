import cloudAssembly = require('@aws-cdk/cloud-assembly');
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');
import YAML = require('yaml');
import { Stack } from './cloudformation/stack';
import { Construct, MetadataEntry, PATH_SEP, Root } from './core/construct';
import { resolve } from './core/tokens';

/**
 * Represents a CDK program.
 */
export class App extends Root {
  /**
   * Initializes a CDK application.
   * @param request Optional toolkit request (e.g. for tests)
   */
  constructor() {
    super();
    this.loadContext();
  }

  private get stacks() {
    const out: { [name: string]: Stack } = { };
    for (const child of this.children) {
      if (!(child instanceof Stack)) {
        throw new Error(`The child ${child.toString()} of Program must be a Stack`);
      }

      out[child.id] = child as Stack;
    }
    return out;
  }

  /**
   * Runs the program. Output is written to output directory as specified in the request.
   */
  public run(): void {
    const outdir = process.env[cxapi.OUTDIR_ENV];
    if (!outdir) {
      process.stderr.write(`ERROR: The environment variable "${cxapi.OUTDIR_ENV}" is not defined\n`);
      process.stderr.write('AWS CDK Toolkit (>= 0.11.0) is required in order to interact with this program.\n');
      process.exit(1);
      return;
    }

    const manifest: cloudAssembly.Manifest = {
      schema: 'cloud-assembly/1.0',
      drops: {},
    };

    const cdkMetadata = this.collectRuntimeInformation();

    for (const stack of this.synthesizeStacks(Object.keys(this.stacks))) {
      manifest.drops[stack.name] = {
        type: 'npm://@aws-cdk/cdk/CloudFormationStackDroplet',
        environment: `aws://${stack.environment.account}/${stack.environment.region}`,
        properties: {
          stackName: stack.name,
          template: _saveTemplateSync(stack),
          parameters: _wireAssetsSync(stack),
        },
        metadata: {
          'aws:cdk:metadata': {
            kind: 'aws:cdk:libraries',
            value: cdkMetadata
          }
        }
      };
    }

    const outfile = path.join(outdir, cloudAssembly.MANIFEST_FILE_NAME);
    fs.writeFileSync(outfile, JSON.stringify(manifest, undefined, 2));

    function _saveTemplateSync(stack: cxapi.SynthesizedStack): string {
      const fileName = 'template.yml';
      const stackDir = stack.name;

      const absoluteDir = path.join(outdir!, stackDir);
      if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(path.join(absoluteDir));
      }
      fs.writeFileSync(path.join(absoluteDir, fileName),
                       YAML.stringify(stack.template),
                       { encoding: 'utf-8' });
      return path.join(stackDir, fileName);
    }

    function _wireAssetsSync(stack: cxapi.SynthesizedStack): { [name: string]: string } {
      const result: { [name: string]: string} = {};
      for (const key of Object.keys(stack.metadata)) {
        const entries = stack.metadata[key];
        for (const entry of entries.filter(md => md.type === cxapi.ASSET_METADATA && md.data != null)) {
          const data = entry.data! as cxapi.AssetMetadataEntry;
          const filePath = path.join(...key.split('/'));
          const fileName = path.basename(data.path);
          const absoluteFile = path.join(_mkdirp(path.join(outdir!, filePath)), fileName);
          if (fs.existsSync(absoluteFile)) {
            if (fs.lstatSync(absoluteFile).isDirectory()) {
              fs.rmdirSync(absoluteFile);
            } else {
              fs.unlinkSync(absoluteFile);
            }
          }
          fs.symlinkSync(data.path, absoluteFile);

          const dropId = `${key}`;
          manifest.drops[dropId] = {
            type: `npm://@aws-cdk/asset/Asset`,
            environment: `aws://${stack.environment.account}/${stack.environment.region}`,
            properties: {
              packaging: data.packaging,
              path: path.join(filePath, fileName)
            }
          };
          if (data.packaging === 'zip' || data.packaging === 'file') {
            result[data.s3BucketParameter] = `\${${dropId}.s3BucketName}`;
            result[data.s3KeyParameter] = `\${${dropId}.s3ObjectKey}`;
          } else if (data.packaging === 'container-image') {
            result[data.repositoryParameter] = `\${${dropId}.repository}`;
            result[data.tagParameter] = `\${${dropId}.tag}`;
          }
        }
      }
      return result;
    }
  }

  /**
   * Synthesize and validate a single stack
   * @param stackName The name of the stack to synthesize
   */
  public synthesizeStack(stackName: string): cxapi.SynthesizedStack {
    const stack = this.getStack(stackName);

    // first, validate this stack and stop if there are errors.
    const errors = stack.validateTree();
    if (errors.length > 0) {
      const errorList = errors.map(e => `[${e.source.path}] ${e.message}`).join('\n  ');
      throw new Error(`Stack validation failed with the following errors:\n  ${errorList}`);
    }

    const account = stack.env.account || 'unknown-account';
    const region = stack.env.region || 'unknown-region';

    const environment: cxapi.Environment = {
      name: `${account}/${region}`,
      account,
      region
    };

    const missing = Object.keys(stack.missingContext).length ? stack.missingContext : undefined;
    return {
      name: stack.id,
      environment,
      missing,
      template: stack.toCloudFormation(),
      metadata: this.collectMetadata(stack)
    };
  }

  /**
   * Synthesizes multiple stacks
   */
  public synthesizeStacks(stackNames: string[]): cxapi.SynthesizedStack[] {
    const ret: cxapi.SynthesizedStack[] = [];
    for (const stackName of stackNames) {
      ret.push(this.synthesizeStack(stackName));
    }
    return ret;
  }

  /**
   * Returns metadata for all constructs in the stack.
   */
  public collectMetadata(stack: Stack) {
    const output: { [id: string]: MetadataEntry[] } = { };

    visit(stack);

    // add app-level metadata under "."
    if (this.metadata.length > 0) {
      output[PATH_SEP] = this.metadata;
    }

    return output;

    function visit(node: Construct) {
      if (node.metadata.length > 0) {
        // Make the path absolute
        output[PATH_SEP + node.path] = node.metadata.map(md => resolve(md) as MetadataEntry);
      }

      for (const child of node.children) {
        visit(child);
      }
    }
  }

  private collectRuntimeInformation(): { [name: string]: string } {
    const libraries: { [name: string]: string } = {};

    for (const fileName of Object.keys(require.cache)) {
      const pkg = findNpmPackage(fileName);
      if (pkg && !pkg.private) {
        libraries[pkg.name] = pkg.version;
      }
    }

    return libraries;
  }

  private getStack(stackname: string) {
    if (stackname == null) {
      throw new Error('Stack name must be defined');
    }

    const stack = this.stacks[stackname];
    if (!stack) {
      throw new Error(`Cannot find stack ${stackname}`);
    }
    return stack;
  }

  private loadContext() {
    const contextJson = process.env[cxapi.CONTEXT_ENV];
    const context = !contextJson ? { } : JSON.parse(contextJson);
    for (const key of Object.keys(context)) {
      this.setContext(key, context[key]);
    }
  }
}

/**
 * Determines which NPM module a given loaded javascript file is from.
 *
 * The only infromation that is available locally is a list of Javascript files,
 * and every source file is associated with a search path to resolve the further
 * ``require`` calls made from there, which includes its own directory on disk,
 * and parent directories - for example:
 *
 * [ '...repo/packages/aws-cdk-resources/lib/cfn/node_modules',
 *   '...repo/packages/aws-cdk-resources/lib/node_modules',
 *   '...repo/packages/aws-cdk-resources/node_modules',
 *   '...repo/packages/node_modules',
 *   // etc...
 * ]
 *
 * We are looking for ``package.json`` that is anywhere in the tree, except it's
 * in the parent directory, not in the ``node_modules`` directory. For this
 * reason, we strip the ``/node_modules`` suffix off each path and use regular
 * module resolution to obtain a reference to ``package.json``.
 *
 * @param fileName a javascript file name.
 * @returns the NPM module infos (aka ``package.json`` contents), or
 *      ``undefined`` if the lookup was unsuccessful.
 */
function findNpmPackage(fileName: string): { name: string, version: string, private?: boolean } | undefined {
  const mod = require.cache[fileName];
  const paths = mod.paths.map(stripNodeModules);

  try {
    const packagePath = require.resolve('package.json', { paths });
    return require(packagePath);
  } catch (e) {
    return undefined;
  }

  /**
   * @param s a path.
   * @returns ``s`` with any terminating ``/node_modules``
   *      (or ``\\node_modules``) stripped off.)
   */
  function stripNodeModules(s: string): string {
    if (s.endsWith('/node_modules') || s.endsWith('\\node_modules')) {
      // /node_modules is 13 characters
      return s.substr(0, s.length - 13);
    }
    return s;
  }
}

function _mkdirp(pth: string): string {
  if (!fs.existsSync(pth)) {
    _mkdirp(path.dirname(pth));
    fs.mkdirSync(pth);
  }
  return pth;
}
