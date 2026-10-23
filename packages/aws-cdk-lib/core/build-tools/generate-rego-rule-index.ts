/**
 * Generate the applicability index for the default Rego rules.
 *
 * Every default rule only ever fires on a handful of CloudFormation resource
 * types, and those type names are already written out in the rule source. This
 * script extracts them so that synthesis can skip loading rules whose types do
 * not appear in the template at all — loading *any* Rego rule costs a fixed
 * ~150ms to spin up the Rego evaluator, which today every CDK app pays even if
 * it has nothing to do with the rules.
 *
 * The index is regenerated on every build and is not committed, so a rule file
 * that is renamed, split, merged or deleted cannot drift out of sync with it.
 *
 * A rule file that does not mention any resource type (a rule about Parameters,
 * Outputs or Transform) must opt out explicitly with a `# cdk-validation: always`
 * header comment, which records it as unconditionally applicable. Failing the
 * build instead of guessing keeps a rule from being silently disabled.
 */
import * as fs from 'fs';
import * as path from 'path';

const RULES_DIR = path.join(__dirname, '..', 'lib', 'validation', 'rules');
const INDEX_FILE = path.join(RULES_DIR, 'index.generated.json');

/**
 * Quoted `AWS::<Service>::<Resource>` literals. Deliberately a regex and not a
 * Rego parse: the type names are plain string literals in every rule we have,
 * and a rule that computes a type dynamically has to use the `always` marker
 * (it would extract no types, or too few, and so fail the check below).
 */
const TYPE_PATTERN = /["'](AWS::[A-Za-z0-9]+::[A-Za-z0-9]+)["']/g;

const ALWAYS_MARKER = /^#\s*cdk-validation:\s*always\s*$/m;

interface RuleIndexEntry {
  /** File name of the rule, relative to the rules directory. */
  readonly file: string;

  /**
   * Resource types this rule can fire on, or `null` if it applies to every
   * template.
   */
  readonly types: string[] | null;
}

function main() {
  const files = fs.readdirSync(RULES_DIR).filter((f) => f.endsWith('.rego')).sort();

  const rules = files.map((file): RuleIndexEntry => {
    const content = fs.readFileSync(path.join(RULES_DIR, file), 'utf-8');

    if (ALWAYS_MARKER.test(content)) {
      return { file, types: null };
    }

    const types = Array.from(new Set(
      Array.from(content.matchAll(TYPE_PATTERN), (m) => m[1]),
    )).sort();

    if (types.length === 0) {
      throw new Error(
        `${path.join(RULES_DIR, file)}: no "AWS::Service::Resource" literals found, so it is unknown which templates `
        + 'this rule applies to. Either reference the resource types as string literals, or add a '
        + '"# cdk-validation: always" header comment to have the rule evaluated against every template.',
      );
    }

    return { file, types };
  });

  fs.writeFileSync(INDEX_FILE, JSON.stringify({ rules }, undefined, 2) + '\n');
}

main();
