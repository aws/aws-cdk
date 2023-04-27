/* eslint-disable no-console */
import * as child_process from 'child_process';
import * as fs from 'fs-extra';

const SKIP_FILE = 'skip-evolution-check.txt';

/**
 * Run validations on the spec evolution, on the pull request.
 *
 * First `git checkout`s the old commit, builds the spec, does the
 * same for the new commit, then runs comparisons on the both.
 *
 * Expects and uses git.
 */
export async function validateSpecificationEvolution(specProducer: () => Promise<any>) {
  const prNumber = (process.env.CODEBUILD_WEBHOOK_TRIGGER ?? '').replace(/^pr\//, '');
  const skips = (await fs.readFile(SKIP_FILE, { encoding: 'utf-8' })).split('\n');
  if (prNumber && skips.includes(prNumber)) {
    console.log(`Skipping evo check of PR ${prNumber} (${SKIP_FILE})`);
    await specProducer();
    return;
  }

  const targetBranch = process.env.CODEBUILD_WEBHOOK_BASE_REF ?? 'main';
  console.log(`Comparing differences with ${targetBranch}`);
  const mergeBase = child_process.execSync(`git merge-base ${targetBranch} HEAD`).toString().trim();
  console.log(`Base commit ${mergeBase}`);
  // Find branch name if we have one
  let currentCommit = child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (currentCommit === 'HEAD') {
    // No branch, just spec use commit
    currentCommit = child_process.execSync('git rev-parse HEAD').toString().trim();
  }
  console.log(`Current commit ${currentCommit}`);

  const specs = new Array<any>();
  for (const commit of [mergeBase, currentCommit]) {
    process.stdout.write([
      '┌───────────────────────────────────────────────────────────────────────────────────',
      `│   Doing spec build at commit: ${commit}`,
      '└─▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
    ].join('\n') + '\n');

    child_process.execSync(`git checkout ${commit}`);
    specs.push(await specProducer());
  }

  validatePropertyTypeNameConsistency(specs[0], specs[1]);
}

/**
 * Safeguard check: make sure that all old property type names in the old spec exist in the new spec
 *
 * If not, it's probably because the service team renamed a type between spec
 * version `v(N)` to `v(N+1)`. In the CloudFormation spec itself, this is not a
 * problem. However, CDK will have generated actual classes and interfaces with
 * the type names at `v(N)`, which people will have written code against. If the
 * classes and interfaces would have a new name at `v(N+1)`, all user code would
 * break.
 */
function validatePropertyTypeNameConsistency(oldSpec: any, newSpec: any) {
  const newPropsTypes = newSpec.PropertyTypes ?? {};
  const disappearedKeys = Object.keys(oldSpec.PropertyTypes ?? {}).filter(k => !(k in newPropsTypes));
  if (disappearedKeys.length === 0) {
    return;
  }

  const exampleJsonPatch = {
    patch: {
      description: 'Undoing upstream property type renames of <SERVICE> because <REASON>',
      operations: disappearedKeys.map((key) => ({
        op: 'move',
        from: `/PropertyTypes/${key.split('.')[0]}.<NEW_TYPE_NAME_HERE>`,
        path: `/PropertyTypes/${key}`,
      })),
    },
  };

  process.stderr.write([
    '┌───────────────────────────────────────────────────────────────────────────────────────┐',
    '│                                                                                       ▐█',
    '│  PROPERTY TYPES HAVE DISAPPEARED                                                      ▐█',
    '│                                                                                       ▐█',
    '│  Some type names have disappeared from the old specification.                         ▐█',
    '│                                                                                       ▐█',
    '│  This probably indicates that the service team renamed one of the types. We have      ▐█',
    '│  to keep the old type names though: renaming them would constitute a breaking change  ▐█',
    '│  to consumers of the L1 resources.                                                    ▐█',
    '│                                                                                       ▐█',
    '└─▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▟█',
    '',
    'See what the renames were, check out this PR locally and add a JSON patch file for these types:',
    '',
    '(Example)',
    '',
    JSON.stringify(exampleJsonPatch, undefined, 2),
    '\n',
  ].join('\n'));
  process.exitCode = 1;
}
