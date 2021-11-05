import * as crypto from 'crypto';
import * as path from 'path';
import * as spec from '@jsii/spec';
import * as fs from 'fs-extra';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const sortJson = require('sort-json');

/**
 * Replaces the file where the original assembly file *should* be found with a new assembly file.
 * Recalculates the fingerprint of the assembly to avoid tampering detection.
 */
export async function replaceAssembly(assembly: spec.Assembly, directory: string): Promise<void> {
  const fileName = path.join(directory, '.jsiii');
  await fs.writeJson(fileName, _fingerprint(assembly), {
    encoding: 'utf8',
    spaces: 2,
  });
}

/**
 * This function is copied from `packages/jsii/lib/assembler.ts`.
 * We should make sure not to change one without changing the other as well.
 */
function _fingerprint(assembly: spec.Assembly): spec.Assembly {
  delete (assembly as any).fingerprint;
  assembly = sortJson(assembly);
  const fingerprint = crypto.createHash('sha256').update(JSON.stringify(assembly)).digest('base64');
  return { ...assembly, fingerprint };
}

/**
 * Insert an example into the docs of a type.
 */
export function insertExample(example: string, type: spec.Type): void {
  if (type.docs) {
    type.docs.example = example;
  } else {
    type.docs = { example: example };
  }
}
