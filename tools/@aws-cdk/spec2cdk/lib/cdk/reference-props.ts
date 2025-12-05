import { Resource } from '@aws-cdk/service-spec-types';
import { $this, expr, Expression, PropertySpec, Type } from '@cdklabs/typewriter';
import { attributePropertyName, referencePropertyName } from '../naming';
import { extractResourceVariablesFromArnFormat, findArnProperty, findNonIdentifierArnProperty } from './arn';
import { CDK_CORE } from './cdk';

export interface ReferenceProp {
  readonly declaration: PropertySpec;
  readonly cfnValue: Expression;
}

export class ResourceReference {
  public readonly resource: Resource;
  public readonly arnPropertyName?: string;

  public get referenceProps(): ReferenceProp[] {
    return [...this._referenceProps.values()];
  }

  public get arnVariables(): Record<string, string> | undefined {
    return this._arnVariables.length ? Object.fromEntries(this._arnVariables) : undefined;
  }

  public get hasArnGetter(): boolean {
    return this.arnPropertyName != null || this.arnVariables != null;
  }

  private _arnVariables: [string, string][] = [];
  private readonly _referenceProps = new FirstOccurrenceMap<string, ReferenceProp>();

  public constructor(resource: Resource) {
    this.resource = resource;
    this.arnPropertyName = this.findArnPropertyName();
    this._referenceProps = new FirstOccurrenceMap<string, ReferenceProp>();
    this.collectReferencesProps();
  }

  private findArnPropertyName(): string | undefined {
    const arnProp = findArnProperty(this.resource);
    if (!arnProp) {
      return;
    }
    return referencePropertyName(arnProp, this.resource.name);
  }

  private collectReferencesProps() {
    // Primary identifier. We assume all parts are strings.
    const primaryIdentifier = this.resource.primaryIdentifier ?? [];
    if (primaryIdentifier.length === 1) {
      const name = referencePropertyName(primaryIdentifier[0], this.resource.name);
      this._referenceProps.setIfAbsent(name, {
        declaration: {
          name,
          type: Type.STRING,
          immutable: true,
          docs: {
            summary: `The ${primaryIdentifier[0]} of the ${this.resource.name} resource.`,
          },
        },
        cfnValue: $this.ref,
      });
    } else if (primaryIdentifier.length > 1) {
      for (const [i, cfnName] of primaryIdentifier.entries()) {
        const name = referencePropertyName(cfnName, this.resource.name);
        this._referenceProps.setIfAbsent(name, {
          declaration: {
            name,
            type: Type.STRING,
            immutable: true,
            docs: {
              summary: `The ${cfnName} of the ${this.resource.name} resource.`,
            },
          },
          cfnValue: splitSelect('|', i, $this.ref),
        });
      }
    }

    // Arn identifier
    const arnProp = findNonIdentifierArnProperty(this.resource);
    if (arnProp) {
      const name = referencePropertyName(arnProp, this.resource.name);
      this._referenceProps.setIfAbsent(name, {
        declaration: {
          name,
          type: Type.STRING,
          immutable: true,
          docs: {
            summary: `The ARN of the ${this.resource.name} resource.`,
          },
        },
        cfnValue: $this[attributePropertyName(arnProp)],
      });
    }

    // If we do not have an ARN prop, see if we can construct it from the arn template
    if (this.resource.arnTemplate && !this.arnPropertyName) {
      const variables = extractResourceVariablesFromArnFormat(this.resource.arnTemplate);
      const allResolved = variables.every(v => this.tryFindUsableValue(v));
      if (allResolved) {
        for (const variable of variables) {
          const access = this.tryFindUsableValue(variable)!;
          const refPropName = referencePropertyName(variable, this.resource.name);
          this._arnVariables.push([variable, refPropName]);
          this._referenceProps.setIfAbsent(refPropName, {
            declaration: {
              name: refPropName,
              type: Type.STRING,
              immutable: true,
              docs: {
                summary: `The ${variable} of the ${this.resource.name} resource.`,
              },
            },
            cfnValue: access,
          });
        }
      }
    }
  }

  public tryFindUsableValue(name: string): Expression| undefined {
    const refPropName = referencePropertyName(name, this.resource.name);

    // an already discovered reference prop
    if (this._referenceProps.has(refPropName)) {
      return this._referenceProps.get(refPropName)!.cfnValue;
    }
    // an attribute
    if (this.resource.attributes[name]) {
      return $this[attributePropertyName(name)];
    }
    // a required prop
    if (this.resource.properties[name]?.required) {
      return $this[refPropName];
    }

    // we don't have a matching value
    return undefined;
  }
}

class FirstOccurrenceMap<K, V> extends Map<K, V> {
  setIfAbsent(key: K, value: V): void {
    if (!this.has(key)) this.set(key, value);
  }
}

function splitSelect(sep: string, n: number, base: Expression) {
  return CDK_CORE.Fn.select(expr.lit(n), CDK_CORE.Fn.split(expr.lit(sep), base));
}

