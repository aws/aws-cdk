
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';
import type { ComponentProps } from '../lib/custom-resources-framework/config';
import { config } from '../lib/custom-resources-framework/config';
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
      const sourceHash = calculateDirectoryHash(path.dirname(outfile));
      module.build(component, codeDirectory, sourceHash);
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

    console.log(messages.join('\n'));

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

/**
 * Calculate a deterministic content hash of a bundled handler directory. The
 * hash is baked into the code-generated framework classes and used as the
 * Asset hash at synth time so the S3 object key remains stable unless the
 * bundled code actually changes.
 */
export function calculateDirectoryHash(directory: string): string {
  const hash = crypto.createHash('sha256');
  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(directory, full);
      if (entry.isDirectory()) {
        hash.update(`D:${rel}\n`);
        walk(full);
      } else if (entry.isFile()) {
        hash.update(`F:${rel}\n`);
        hash.update(fs.readFileSync(full));
      }
    }
  };
  walk(directory);
  return hash.digest('hex');
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
  console.error(e);
  process.exitCode = 1;
});
