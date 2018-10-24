import { schema } from '../lib';
import { ScrutinyType } from '../lib/schema';

/**
 * Auto-detect common properties to apply scrutiny to by using heuristics
 *
 * Manually enhancing scrutiny attributes for each property does not scale
 * well. Fortunately, the most important ones follow a common naming scheme and
 * we tag all of them at once in this way.
 *
 * If the heuristic scheme gets it wrong in some individual cases, those can be
 * fixed using schema patches.
 */
export function detectScrutinyTypes(spec: schema.Specification) {
  for (const objectMap of [spec.PropertyTypes, spec.ResourceTypes]) {
    for (const typeName of Object.keys(objectMap)) {
      const typeSpec = objectMap[typeName]; // Instead of Object.entries(), to help the typechecker

      for (const [propertyName, propertySpec] of Object.entries(typeSpec.Properties || {})) {
        if (propertySpec.ScrutinyType !== undefined) { continue; } // Only for unassigned

        const nameContainsPolicy = propertyName.indexOf('Policy') > -1;
        const primitiveType = schema.isPrimitiveProperty(propertySpec) && propertySpec.PrimitiveType;

        if (nameContainsPolicy && primitiveType === 'Json') {
          const isIamResource = typeName.indexOf('::IAM::') > 1;
          propertySpec.ScrutinyType = isIamResource ? ScrutinyType.IdentityPolicy : ScrutinyType.ResourcePolicy;
          continue;
        }
      }
    }
  }
}
