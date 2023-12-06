import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';
import { config, ConfigProps } from '../lib/handler-framework/config';
import { CdkHandlerFrameworkModule } from '../lib/handler-framework/framework';

/* eslint-disable no-console */

const framework: { [renderLocation: string]: ConfigProps[] } = {};

async function main() {
  recurse(config, []);
  for (const [renderLocation, components] of Object.entries(framework)) {
    console.log(renderLocation);
    const module = new CdkHandlerFrameworkModule('cdk-handler-framework');
    for (const component of components) {
      const outfile = calculateOutfile(component.sourceCode);
      if (component.disableBundleAndMinify) {
        fs.mkdirSync(path.dirname(outfile), { recursive: true });
        fs.copyFileSync(component.sourceCode, outfile);
      } else {
        await bundleAndMinify(component.sourceCode, outfile);
      }
      const sourceCodeDirectory = path.dirname(outfile).split('/').pop();
      module.build(component, `./${sourceCodeDirectory}`);
    }
    module.render(renderLocation);
  }

  function recurse(_config: any, _path: string[]) {
    // base case - this is a framework component array and we will build a module with
    // all defined components
    if (_config instanceof Array) {
      const outputFileLocation = _path.join('/');
      framework[outputFileLocation] = _config;
      return;
    }

    for (const key in _config) {
      if (_config.hasOwnProperty(key) && typeof _config[key] === 'object') {
        _path.push(key);
        recurse(_config[key], _path);
        _path.pop(); // backtrack
      }
    }
  }
}

async function bundleAndMinify(infile: string, outfile: string) {
  const result = await esbuild.build({
    entryPoints: [infile],
    outfile,
    external: ['@aws-sdk/*', 'aws-sdk'],
    format: 'cjs',
    platform: 'node',
    bundle: true,
    minify: true,
    minifyWhitespace: true,
    minifySyntax: true,
    minifyIdentifiers: true,
    sourcemap: false,
    tsconfig: 'tsconfig.json',

    // These should be checked because they can lead to runtime failures. There are
    // false positives, and the esbuild API does not provide a way to suppress them,
    // so we need to do some postprocessing.
    logOverride: {
      'unsupported-dynamic-import': 'warning',
      'unsupported-require-call': 'warning',
      'indirect-require': 'warning',
    },
    logLevel: 'error',
  });

  const failures = [
    ...result.errors,
    ...ignoreWarnings(result),
  ];

  if (failures.length > 0) {
    const messages = esbuild.formatMessagesSync(failures, {
      kind: 'error',
      color: true,
    });
    // eslint-disable-next-line no-console
    console.log(messages.join('\n'));
    // eslint-disable-next-line no-console
    console.log(`${messages.length} errors. For false positives, put '// esbuild-disable <code> - <motivation>' on the line before`);
    process.exitCode = 1;
  }
}

function calculateOutfile(file: string) {
  // turn ts extension into js extension
  if (file.includes('index.ts')) {
    file = path.join(path.dirname(file), path.basename(file, path.extname(file)) + '.js');
  }

  // replace /lib with /dist
  const fileContents = file.split(path.sep);
  fileContents[fileContents.lastIndexOf('lib')] = 'dist';

  return fileContents.join(path.sep);
}

function ignoreWarnings(result: esbuild.BuildResult) {
  const ret: esbuild.Message[] = [];
  for (const warning of result.warnings) {
    let suppressed = false;
    if (warning.location?.file) {
      const contents = fs.readFileSync(warning.location.file, { encoding: 'utf-8' });
      const lines = contents.split('\n');
      const lineBefore = lines[warning.location.line - 1 - 1];

      if (lineBefore.includes(`esbuild-disable ${warning.id}`)) {
        suppressed = true;
      }
    }

    if (!suppressed) {
      ret.push(warning);
    }
  }
  return ret;
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
