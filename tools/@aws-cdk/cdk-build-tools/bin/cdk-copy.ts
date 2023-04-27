import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as _glob from 'glob';
import * as yargs from 'yargs';

const glob = promisify(_glob);

async function main() {
  const args = yargs(process.argv.slice(2))
    .command('$0 [MODULE_NAME]', 'Copy a submodule of aws-cdk-lib to it\'s own package', argv =>
      argv
        .positional('MODULE_NAME', {
          type: 'string',
          desc: 'The submodule of aws-cdk-lib to duplicate',
        })
        .option('out-dir', {
          type: 'string',
          desc: 'The output directory for duplicated module',
          normalize: true,
          default: '.',
        })
        .option('ignore', {
          string: true,
          type: 'array',
          description: 'Ignore patterns when copying source files',
        })
        .required('MODULE_NAME'),
    ).argv;

  const { MODULE_NAME, 'out-dir': outDir, ignore = [] } = args;
  const sourcePackageDir = path.resolve(__dirname, '..', '..', '..', '..', 'packages', 'aws-cdk-lib');

  await duplicateModule({
    moduleName: MODULE_NAME,
    outDir,
    sourcePackageDir,
    ignore,
  });
}

interface DuplicateConfig {
  /**
   * Location of the package we are copying submodules from
   * usually aws-cdk-lib.
   */
  sourcePackageDir: string;

  /**
   * The name of the submodule we are copying, IE 'region-info'
   */
  moduleName: string;

  /**
   * Location to emit copied files
   * @default current working directory
   */
  outDir: string;

  /**
   * Ignore patterns when copying files
   * @default copy everything
   */
  ignore: string[];
}

async function duplicateModule(config: DuplicateConfig) {
  const sourceModuleDirectory = path.resolve(config.sourcePackageDir, config.moduleName);
  const targetModuleDirectory = path.resolve(config.outDir);

  await copyAndRewrite(sourceModuleDirectory, targetModuleDirectory, config.ignore);

  const sourceRosettaDirectory = path.resolve(config.sourcePackageDir, 'rosetta', config.moduleName.replace(/-/g, '_'));
  const targetRosettaDirectory = path.resolve(config.outDir, 'rosetta');

  await copyAndRewrite(sourceRosettaDirectory, targetRosettaDirectory, config.ignore);
}

async function copyAndRewrite(sourceDirectory: string, targetDirectory: string, ignore: string[]) {
  const files = await glob(path.join(sourceDirectory, '**', '*'), {
    ignore: [
      ...autoIgnore(sourceDirectory),
      ...ignore,
    ],
  });

  // Copy all files to new destination and rewrite imports if needed
  await Promise.all(
    files.map(async (filePath: string) => {
      const stat = await fs.stat(filePath);
      const relativePath = filePath.replace(sourceDirectory, '');
      const newPath = path.join(targetDirectory, relativePath);
      if (stat.isFile()) {
        await fs.mkdir(path.dirname(newPath), { recursive: true });
        if (fs.existsSync(newPath)) {
          await fs.remove(newPath);
        }

        const relativeDepth = relativePath.split(path.sep).length - 1;

        if (isSourceFile(filePath)) {
          await rewriteFileTo(filePath, newPath, relativeDepth);
        }
      }
    }),
  );
}

/**
 * Find a package reference
 *
 * ```
 * import * as xyz from "<somewhere>";
 * import { xyz }  from '<somewhere>';
 *                 ^^^^^^^^^^^^^^^^^^^
 * ```
 */
const importRegex = new RegExp('^(.*from [\'"])([^\'"]*)([\'"].*)');

export async function rewriteFileTo(source: string, target: string, relativeDepth: number) {
  const lines = (await fs.readFile(source, 'utf8'))
    .split('\n')
    .map((line) => {
      const importMatches = importRegex.exec(line);

      if (importMatches) {
        const newPath = rewriteImportPath(importMatches[2], relativeDepth);
        return importMatches[1] + newPath + importMatches[3];
      }

      return line;
    });

  await fs.writeFile(target, lines.join('\n'));
}

/**
 * Rewrite monopackage-relative imports to imports that import from the monopackage
 *
 * E.g., turn
 *
 * ```
 * import { blah } from '../../aws-something';
 * ```
 *
 * Into
 *
 * ```
 * import { blah } from 'aws-cdk-lib/aws-something';
 * ```
 *
 * Make an exception for packages that are `cdk-copied` (only
 * cloud-assembly-schema and cx-api).
 */
function rewriteImportPath(importPath: string, relativeDepth: number) {
  const otherImportPath = new Array(relativeDepth).fill('..').join('/');

  if (importPath.startsWith(otherImportPath)) {
    const remainder = importPath.substring(otherImportPath.length + 1);

    let newPrefix = 'aws-cdk-lib'; // aws-cdk-lib/aws-mypackage
    if (remainder.startsWith('cloud-assembly-schema') || remainder.startsWith('cx-api')) {
      newPrefix = '@aws-cdk'; // @aws-cdk/aws-mypackage
    }

    return importPath.replace(otherImportPath, newPrefix);
  }

  return importPath;
}

function isSourceFile(filePath: string): boolean {
  const extension = path.extname(filePath);
  if (['.ts', '.tsx'].includes(extension) && !filePath.endsWith('.d.ts')) {
    return true;
  } else if (extension === '.js') {
    return !fs.existsSync(filePath.replace('.js', '.ts'));
  } else if (filePath.endsWith('.d.ts')) {
    return false;
  }
  return true;
}

function autoIgnore(source: string): string[] {
  return [
    // package.json `main` is lib/index.js so no need for top level index.ts
    ...['.ts', '.js', '.d.ts'].map((ext: string) => path.join(source, `index${ext}`)),
    'node_modules/**',
  ];
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
