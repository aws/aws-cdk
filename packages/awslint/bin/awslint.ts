/* eslint-disable max-len */
/* eslint-disable no-console */
import * as child_process from 'child_process';
import * as path from 'path';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import * as reflect from 'jsii-reflect';
import * as yargs from 'yargs';
import { ALL_RULES_LINTER, DiagnosticLevel } from '../lib';

let stackTrace = false;

async function main() {
  const argv = yargs
    .env('AWSLINT')
    .usage('awslint [options] [command]')
    .showHelpOnFail(true)
    .command('$0', 'lint the current module (default)')
    .command('list', 'list all available rules')
    .option('include', { alias: 'i', type: 'array', desc: 'evaluate only this rule(s)', default: ['*'] })
    .option('exclude', { alias: 'x', type: 'array', desc: 'do not evaludate these rules (takes priority over --include)', default: [] })
    .option('save', { type: 'boolean', desc: 'updates package.json with "exclude" statements for all failing rules', default: false })
    .option('verbose', { alias: 'v', type: 'boolean', desc: 'verbose output (prints all assertions)', default: false })
    .option('quiet', { alias: 'q', type: 'boolean', desc: 'quiet mode - shows only errors', default: true })
    .option('force', { type: 'boolean', desc: 'succeed silently if this is not a jsii module', default: true })
    .option('config', { type: 'boolean', desc: 'reads options from the "awslint" section in package.json', default: true })
    .option('debug', { type: 'boolean', desc: 'debug output', default: false })
    .option('compile', { alias: 'c', type: 'boolean', desc: 'always run the jsii compiler (use "--no-compile" to never run the compiler, even if .jsii doesn\'t exist)' })
    .group('include', 'Filtering')
    .group('exclude', 'Filtering')
    .group('config', 'Configuration')
    .group('save', 'Configuration')
    .group('verbose', 'Output')
    .group('quiet', 'Output')
    .group('debug', 'Output')
    .group('compile', 'Build')
    .example('awslint', 'lints the current module against all rules')
    .example('awslint -v -i "resource*" -i "import*"', 'lints against all rules that start with "resource" or "import" and print successes')
    .example('awslint -x "*:@aws-cdk/aws-s3*"', 'evaluate all rules in all scopes besides ones that begin with "@aws-cdk/aws-s3"')
    .example('awslint --save', 'updated "package.json" with "exclude"s for all failing rules');

  if (!process.stdout.isTTY) {
    // Disable chalk color highlighting
    process.env.FORCE_COLOR = '0';
  }

  const args = argv.argv;

  stackTrace = args.verbose || args.debug;

  if (args._.length > 1) {
    argv.showHelp();
    process.exit(1);
  }

  const command = args._[0] || 'lint';
  const workdir = process.cwd();

  const config = path.join(workdir, 'package.json');

  if (command === 'list') {
    for (const rule of ALL_RULES_LINTER.rules) {
      console.info(`${chalk.cyan(rule.code)}: ${rule.message}`);
    }
    return;
  }

  // if no package.json and force is true (default), just don't do anything
  if (!await fs.pathExists(config) && args.force) {
    return;
  }

  const pkg = await fs.readJSON(config);

  // if this is not a jsii module we have nothing to look for
  if (!pkg.jsii) {
    if (args.force) {
      return; // just silently succeed
    }

    throw new Error(`Module in ${workdir} is not a jsii module (no "jsii" section in package.json)`);
  }

  // if package.json contains a `jsii` section but there is no .jsii file
  // it means we haven't compiled the module.
  if (await shouldCompile()) {
    await shell('jsii');
  }

  // read "awslint" from package.json
  if (args.config) {
    mergeOptions(args, pkg.awslint);
  }

  if (args.debug) {
    console.error('command: ' + command);
    console.error('options: ' + JSON.stringify(args, undefined, 2));
  }

  if (command === 'lint') {
    const assembly = await loadModule(workdir);
    if (!assembly) {
      return;
    }

    const excludesToSave = new Array<string>();
    let errors = 0;

    const results = [];

    results.push(...ALL_RULES_LINTER.eval(assembly, {
      include: args.include,
      exclude: args.exclude,
    }));

    // Sort errors to the top (highest severity first)
    results.sort((a, b) => b.level - a.level);

    // process results

    for (const diag of results) {
      const suppressionKey = `${diag.rule.code}:${diag.scope}`;

      let color;
      switch (diag.level) {
        case DiagnosticLevel.Success:
          if (args.verbose) {
            color = chalk.gray;
          }
          break;
        case DiagnosticLevel.Error:
          errors++;
          color = chalk.red;
          if (args.save) {
            excludesToSave.push(suppressionKey);
          }
          break;
        case DiagnosticLevel.Warning:
          if (!args.quiet) {
            color = chalk.yellow;
          }
          break;
        case DiagnosticLevel.Skipped:
          if (!args.quiet) {
            color = chalk.blue;
          }
          break;
      }

      if (color) {
        console.error(color(`${DiagnosticLevel[diag.level].toLowerCase()}: [${chalk.bold(`awslint:${diag.rule.code}`)}:${chalk.bold(diag.scope)}] ${diag.message}`));
      }
    }

    if (excludesToSave.length > 0) {
      if (!pkg.awslint) {
        pkg.awslint = { };
      }

      if (!pkg.awslint.exclude) {
        pkg.awslint.exclude = [];
      }

      const excludes: string[] = pkg.awslint.exclude;

      for (const exclude of excludesToSave) {
        if (excludes.indexOf(exclude) === -1) {
          excludes.push(exclude);
        }
      }

      if (excludes.length > 0) {
        await fs.writeJSON(config, pkg, { spaces: 2 });
      }
    }

    if (errors && !args.save) {
      process.exit(1);
    }

    return;
  }

  argv.showHelp();
  throw new Error(`Invalid command: ${command}`);

  async function shouldCompile() {

    // if --compile is explicitly enabled then just compile always
    if (args.compile === true) {
      return true;
    }

    // if we have a .jsii file and we are not forced to compile, then don't compile
    if (await fs.pathExists(path.join(workdir, '.jsii'))) {
      return false;
    }

    // we don't have a .jsii file, and --no-compile is explicily set, then it's an error
    if (args.compile === false) {
      throw new Error('No .jsii file and --no-compile is set');
    }

    // compile!
    return true;
  }

}

main().catch(e => {
  console.error(chalk.red(e.message));
  if (stackTrace) {
    console.error(e.stack);
  }
  process.exit(1);
});

async function loadModule(dir: string) {
  const ts = new reflect.TypeSystem();
  await ts.load(dir, { validate: false }); // Don't validate to save 66% of execution time (20s vs 1min).
  // We run 'awslint' during build time, assemblies are guaranteed to be ok.

  if (ts.roots.length !== 1) {
    throw new Error('Expecting only a single root assembly');
  }

  return ts.roots[0];
}

function mergeOptions(dest: any, pkg?: any) {
  if (!pkg) { return; } // no options in package.json

  for (const [key, value] of Object.entries(pkg)) {

    // if this is an array option, then add values to destination
    if (Array.isArray(value)) {
      const arr = dest[key] || [];
      arr.push(...value);
      dest[key] = arr;
      continue;
    }

    // objects are not allowed
    if (typeof value === 'object') {
      throw new Error(`Invalid option "${key}" in package.json: ${JSON.stringify(value)}`);
    }

    // primitives simply override
    dest[key] = value;
  }

  return dest;
}

async function shell(command: string) {
  const child = child_process.spawn(command, [], { stdio: ['inherit', 'inherit', 'inherit'] });
  return new Promise<void>((ok, ko) => {
    child.once('exit', (status: any) => {
      if (status === 0) {
        return ok();
      } else {
        return ko(new Error(`${command} exited with status ${status}`));
      }
    });
    child.once('error', ko);
  });
}
