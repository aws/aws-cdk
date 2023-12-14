import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';
import { config, ComponentProps } from '../lib/custom-resources-framework/config';
import { HandlerFrameworkModule } from '../lib/custom-resources-framework/framework';

const framework: { [fqn: string]: ComponentProps[] } = {};

async function main() {
  recurse(config, []);

  for (const [fqn, components] of Object.entries(framework)) {
    const module = new HandlerFrameworkModule(fqn);
    for (const component of components) {
      const outfile = calculateOutfile(component.sourceCode);
      if (component.minifyAndBundle ?? true) {
        await minifyAndBundle(component.sourceCode, outfile);
      } else {
        fs.mkdirSync(path.dirname(outfile), { recursive: true });
        fs.copyFileSync(component.sourceCode, outfile);
      }
      const codeDirectory = path.dirname(outfile).split('/').pop() ?? '';
      module.build(component, codeDirectory);
    }

    if (module.hasComponents) {
      module.renderTo(`dist/${fqn}.generated.ts`);
    }
  }

  function recurse(_config: any, _path: string[]) {
    // base case - this is a framework component array and we will build a module with
    // all defined components
    if (_config instanceof Array) {
      const fqn = _path.join('/');
      framework[fqn] = _config;
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

async function minifyAndBundle(infile: string, outfile: string) {
  const result = await esbuild.build({
    entryPoints: [infile],
    outfile,
    external: ['@aws-sdk/*', 'aws-sdk'],
    format: 'cjs',
    platform: 'node',
    target: 'node18',
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

export function calculateOutfile(file: string) {
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
