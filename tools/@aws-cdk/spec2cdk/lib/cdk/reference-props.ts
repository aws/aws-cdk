import { Resource } from '@aws-cdk/service-spec-types';
import { $E, expr, Expression, PropertySpec, Type } from '@cdklabs/typewriter';
import { attributePropertyName, referencePropertyName } from '../naming';
import { CDK_CORE } from './cdk';

export interface ReferenceProp {
  readonly declaration: PropertySpec;
  readonly cfnValue: Expression;
}

// Convenience typewriter builder
const $this = $E(expr.this_());

export function getReferenceProps(resource: Resource): ReferenceProp[] {
  const referenceProps = [];
  // Primary identifier. We assume all parts are strings.
  const primaryIdentifier = resource.primaryIdentifier ?? [];
  if (primaryIdentifier.length === 1) {
    referenceProps.push({
      declaration: {
        name: referencePropertyName(primaryIdentifier[0], resource.name),
        type: Type.STRING,
        immutable: true,
        docs: {
          summary: `The ${primaryIdentifier[0]} of the ${resource.name} resource.`,
        },
      },
      cfnValue: $this.ref,
    });
  } else if (primaryIdentifier.length > 1) {
    for (const [i, cfnName] of enumerate(primaryIdentifier)) {
      referenceProps.push({
        declaration: {
          name: referencePropertyName(cfnName, resource.name),
          type: Type.STRING,
          immutable: true,
          docs: {
            summary: `The ${cfnName} of the ${resource.name} resource.`,
          },
        },
        cfnValue: splitSelect('|', i, $this.ref),
      });
    }
  }

  const arnProp = findArnProperty(resource);
  if (arnProp) {
    referenceProps.push({
      declaration: {
        name: referencePropertyName(arnProp, resource.name),
        type: Type.STRING,
        immutable: true,
        docs: {
          summary: `The ARN of the ${resource.name} resource.`,
        },
      },
      cfnValue: $this[attributePropertyName(arnProp)],
    });
  }
  return referenceProps;
}

/**
 * Find an ARN property for a given resource
 *
 * Returns `undefined` if no ARN property is found, or if the ARN property is already
 * included in the primary identifier.
 */
export function findArnProperty(resource: Resource) {
  const possibleArnNames = ['Arn', `${resource.name}Arn`];
  for (const name of possibleArnNames) {
    const prop = resource.attributes[name];
    if (prop && !resource.primaryIdentifier?.includes(name)) {
      return name;
    }
  }
  return undefined;
}

function splitSelect(sep: string, n: number, base: Expression) {
  return CDK_CORE.Fn.select(expr.lit(n), CDK_CORE.Fn.split(expr.lit(sep), base));
}

function enumerate<A>(xs: A[]): Array<[number, A]> {
  return xs.map((x, i) => [i, x]);
}
