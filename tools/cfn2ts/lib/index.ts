import * as cfnSpec from '@aws-cdk/cfnspec';
import * as fs from 'fs-extra';
import { AugmentationGenerator } from './augmentation-generator';
import CodeGenerator, { CodeGeneratorOptions } from './codegen';
import { packageName } from './genspec';

export interface Options extends CodeGeneratorOptions {
  /**
   * Filter to apply on the resource type name.
   * Only resource type names that match this filter will be included in the generated code.
   * @default - no filter.
   */
  readonly filterResourcePrefix?: string;
}

export default async function(scopes: string | string[], outPath: string, options: Options = { }): Promise<void> {
  if (outPath !== '.') { await fs.mkdirp(outPath); }

  if (typeof scopes === 'string') { scopes = [scopes]; }

  for (const scope of scopes) {
    const filter = options.filterResourcePrefix ? `${scope}::${options.filterResourcePrefix}` : `${scope}::`;
    const spec = cfnSpec.filteredSpecification(s => s.startsWith(filter));
    if (Object.keys(spec.ResourceTypes).length === 0) {
      throw new Error(`No resource was found for scope ${scope}`);
    }
    const name = packageName(scope);
    const affix = computeAffix(scope, scopes);

    const generator = new CodeGenerator(name, spec, affix, options);
    generator.emitCode();
    await generator.save(outPath);

    const augs = new AugmentationGenerator(name, spec, affix);
    if (augs.emitCode()) {
      await augs.save(outPath);
    }
  }
}

/**
 * Finds an affix for class names generated for a scope, given all the scopes that share the same package.
 * @param scope     the scope for which an affix is needed (e.g: AWS::ApiGatewayV2)
 * @param allScopes all the scopes hosted in the package (e.g: ["AWS::ApiGateway", "AWS::ApiGatewayV2"])
 * @returns the affix (e.g: "V2"), if any, or an empty string.
 */
function computeAffix(scope: string, allScopes: string[]): string {
  if (allScopes.length === 1) {
    return '';
  }
  const parts = scope.match(/^(.+)(V\d+)$/);
  if (!parts) {
    return '';
  }
  const [, root, version] = parts;
  if (allScopes.indexOf(root) !== -1) {
    return version;
  }
  return '';
}
