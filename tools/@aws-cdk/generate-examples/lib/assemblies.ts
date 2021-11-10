import * as path from 'path';
import * as spec from '@jsii/spec';
import * as fs from 'fs-extra';
import { LanguageTablet, TranslatedSnippet } from 'jsii-rosetta';

/**
 * Replaces the file where the original assembly file *should* be found with a new assembly file.
 * Recalculates the fingerprint of the assembly to avoid tampering detection.
 */
export async function replaceAssembly(assembly: spec.Assembly, directory: string): Promise<void> {
  const fileName = path.join(directory, '.jsii');
  await fs.writeJson(fileName, _fingerprint(assembly), {
    encoding: 'utf8',
    spaces: 2,
  });
}

/**
 * Replaces the old fingerprint with '***********'.
 *
 * @rmuller says fingerprinting is useless, as we do not actually check
 * if an assembly is changed. Instead of keeping the old (wrong) fingerprint
 * or spending extra time calculating a new fingerprint, we replace with '**********'
 * that demonstrates the fingerprint has changed.
 */
function _fingerprint(assembly: spec.Assembly): spec.Assembly {
  assembly.fingerprint = '*'.repeat(10);
  return assembly;
}

/**
 * Insert an example into the docs of a type, and insert it back into the tablet under a new key
 *
 * This definition has been copied from 'jsii-rosetta', and should be replaced with an
 * import once https://github.com/aws/jsii/pull/3146 is merged.
 */
export function insertExample(example: TranslatedSnippet, type: spec.Type, tablet: LanguageTablet): void {
  if (type.docs) {
    type.docs.example = example.originalSource.source;
  } else {
    type.docs = { example: example.originalSource.source };
  }

  tablet?.addSnippet(
    example.withLocation({
      api: { api: 'type', fqn: type.fqn },
      field: { field: 'example' },
    }),
  );
}
