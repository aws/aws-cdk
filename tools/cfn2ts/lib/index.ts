import cfnSpec = require('@aws-cdk/cfnspec');
import fs = require('fs-extra');
import { AugmentationGenerator } from './augmentation-generator';
import CodeGenerator from './codegen';
import { packageName } from './genspec';

export default async function(scopes: string | string[], outPath: string) {
  if (outPath !== '.') { await fs.mkdirp(outPath); }

  if (typeof scopes === 'string') { scopes = [scopes]; }

  for (const scope of scopes) {
    const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
    if (Object.keys(spec.ResourceTypes).length === 0) {
      throw new Error(`No resource was found for scope ${scope}`);
    }
    const name = packageName(scope);
    const affix = computeAffix(scope, scopes);

    const generator = new CodeGenerator(name, spec, affix);
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
