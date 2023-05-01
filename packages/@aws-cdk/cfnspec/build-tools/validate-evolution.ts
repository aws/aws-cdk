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

  const operations: any[] = [];

  for (const key of disappearedKeys) {
    const [cfnResource, typeName] = key.split('.');
    const usages = findTypeUsages(oldSpec, cfnResource, typeName);
    if (usages.length === 0) {
      // Might have disappeared, but no one should have been using this
      continue;
    }

    operations.push({
      op: 'move',
      from: `/PropertyTypes/${cfnResource}.<NEW_TYPE_NAME_HERE>`,
      path: `/PropertyTypes/${cfnResource}.${typeName}`,
    });

    operations.push(...usages.map((path) => ({
      op: 'replace',
      path,
      value: typeName,
    })));
  }

  const exampleJsonPatch = {
    patch: {
      description: 'Undoing upstream property type renames of <SERVICE> because <REASON>',
      operations,
    },
  };

  const now = new Date();
  const YYYY = `${now.getFullYear()}`;
  const MM = `0${now.getMonth() + 1}`.slice(-2);
  const DD = `0${now.getDate()}`.slice(-2);

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
    `(Example 600_Renames_${YYYY}${MM}${DD}_patch.json)`,
    '',
    JSON.stringify(exampleJsonPatch, undefined, 2),
    '\n',
  ].join('\n'));
  process.exitCode = 1;
}

function findTypeUsages(spec: any, cfnResource: string, typeName: string): string[] {
  const ret = new Array<string>();

  const typesToInspect: Array<readonly [string, string]> = [
    ...Object.keys(spec.PropertyTypes ?? {})
      .filter((propTypeName) => propTypeName.startsWith(`${cfnResource}.`))
      .map((propTypeName) => ['PropertyTypes', propTypeName] as const),
    ...spec.ResourceTypes?.[cfnResource] ? [['ResourceTypes', cfnResource] as const] : [],
  ];

  for (const [topKey, typeKey] of typesToInspect) {
    const propType = spec[topKey][typeKey];

    for (const innerKey of ['Properties', 'Attributes']) {

      for (const [propName, propDef] of Object.entries(propType?.[innerKey] ?? {})) {
        for (const [fieldName, fieldType] of Object.entries(propDef as any)) {
          if (fieldType === typeName) {
            ret.push(`/${topKey}/${typeKey}/${innerKey}/${propName}/${fieldName}`);
          }
        }
      }
    }
  }

  return ret;
}