import type { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import type { Expression } from '@cdklabs/typewriter';
import {
  $E,
  ClassType,
  expr,
  ExternalModule,
  InterfaceType,
  MemberVisibility,
  Module,
  stmt,
  Type,
} from '@cdklabs/typewriter';
import type { PropertySpec } from '@cdklabs/typewriter/lib/property';
import { classNameFromResource } from '../naming';
import type { Referenceable } from './resource-class';

const $this = $E(expr.this_());

/**
 * From some data, generate grants
 *
 * For now, the grants data will be in a JSON file inside the service directory;
 * in the future, this data will be moved to the `awscdk-service-spec`
 * repository.
 */
export class GrantsModule extends Module {
  public constructor(
    private readonly service: Service,
    private readonly db: SpecDatabase,
    private readonly schema: GrantsFileSchema,
    private readonly iamModulePath: string,
    public readonly isStable: boolean) {
    super(`${service.shortName}.grants`);
  }

  public build(resourceClasses: Record<string, Referenceable>, nameSuffix?: string) {
    let hasContent = false;
    const resources = this.db.follow('hasResource', this.service);
    const resourceIndex = Object.fromEntries(resources.map(r => [r.entity.name, r.entity]));
    const encryptedResourcePropName = 'encryptedResource';

    // Generate one <Resource>Grants class per construct available in the schema, for this module.
    for (const [name, config] of Object.entries(this.schema.resources ?? {})) {
      if (!resourceIndex[name] || Object.keys(config.grants ?? {}).length === 0) continue;
      const resource = resourceIndex[name];

      const hasPolicy = config.hasResourcePolicy ?? false;
      const hasKeyActions = Object.values(config.grants)
        .some(grant => grant.keyActions && grant.keyActions.length > 0);

      const resourceClass = resourceClasses[resource.cloudFormationType];

      const refSymbol = resourceClass.ref.interfaceType.symbol;
      if (refSymbol != null) {
        this.linkSymbol(refSymbol, expr.ident(this.service.shortName).prop(refSymbol.name));
      }

      if (!resourceClass.hasArnGetter) {
        // Without an ARN we can't create policies
        continue;
      }

      const className = `${name}Grants`;
      const refInterfaceType = resourceClass.ref.interfaceType;

      const propsProperties: PropertySpec[] = [{
        name: 'resource',
        type: refInterfaceType,
        immutable: true,
        docs: {
          summary: 'The resource on which actions will be allowed',
        },
      }];

      if (hasPolicy) {
        propsProperties.push({
          name: 'policyResource',
          type: Type.fromName(this, 'iam.IResourceWithPolicyV2'),
          optional: true,
          immutable: true,
          docs: {
            summary: 'The resource with policy on which actions will be allowed',
            default: 'No resource policy is created',
          },
        });
      }
      if (hasKeyActions) {
        propsProperties.push({
          name: encryptedResourcePropName,
          type: Type.fromName(this, 'iam.IEncryptedResource'),
          optional: true,
          immutable: true,
          docs: {
            summary: 'The encrypted resource on which actions will be allowed',
            default: 'No permission is added to the KMS key, even if it exists',
          },
        });
      }

      // Generate a <Resource>GrantsProps that contains at least one property, called resource, of type I<Resource>Ref.
      // Additionally, depending on what is available in the config for this class, two other properties will be added:
      //  - policyResource?: iam.IResourceWithPolicyV2, which can be used to generate a resource policy.
      //  - encryptedResource?: iam.IEncryptedResource, which can be used to add permission to the KMS key associated with this resource.
      const propsType = new InterfaceType(this, {
        name: `${className}Props`,
        export: false,
        properties: propsProperties,
        docs: {
          summary: `Properties for ${className}`,
        },
      });

      const classType = new ClassType(this, {
        name: className,
        export: true,
        docs: {
          summary: `Collection of grant methods for a ${refInterfaceType.fqn}`,
        },
      });

      classType.addProperty({
        name: 'resource',
        immutable: true,
        type: refInterfaceType, // IBucketRef
        protected: true,
      });

      const init = classType.addInitializer({
        visibility: MemberVisibility.Private,
      });

      const propsParameter = init.addParameter({
        name: 'props',
        type: propsType.type,
      });

      init.addBody(stmt.assign($this.resource, propsParameter.prop('resource')));

      if (hasKeyActions) {
        const iEncryptedResourceType = Type.fromName(this, 'iam.IEncryptedResource');
        classType.addProperty({
          name: encryptedResourcePropName,
          immutable: true,
          type: iEncryptedResourceType,
          optional: true,
          protected: true,
        });

        init.addBody(stmt.assign($this[encryptedResourcePropName], propsParameter.prop(encryptedResourcePropName)));
      }

      if (hasPolicy) {
        const resourceWithPolicy = Type.fromName(this, 'iam.IResourceWithPolicyV2');
        classType.addProperty({
          name: 'policyResource',
          immutable: true,
          type: resourceWithPolicy,
          optional: true,
          protected: true,
        });
        init.addBody(stmt.assign($this.policyResource, propsParameter.prop('policyResource')));
      }

      const factoryMethod = classType.addMethod({
        name: `from${resource.name}`,
        static: true,
        returnType: Type.fromName(this, `${classType.name}`),
        docs: {
          summary: `Creates grants for ${className}`,
        },
      });

      const staticResourceParam = factoryMethod.addParameter({
        name: 'resource',
        type: refInterfaceType,
      });

      const props: Record<string, Expression> = {
        resource: staticResourceParam,
      };

      if (hasKeyActions) {
        props[encryptedResourcePropName] = $E(expr.ident('iam.EncryptedResources')).of(staticResourceParam);
      }

      if (hasPolicy) {
        props.policyResource = $E(expr.ident('iam.ResourceWithPolicies')).of(staticResourceParam);
      }

      factoryMethod.addBody(
        stmt.ret(Type.fromName(this, className).newInstance(expr.object(props))),
      );

      // Add one method per entry in the config
      for (const [methodName, grantSchema] of Object.entries(config.grants)) {
        const arnFormat = grantSchema.arnFormat;
        const arnFormats = Array.isArray(arnFormat) ? arnFormat : [arnFormat];
        const resourceArns = expr.list(
          arnFormats.map(format => makeArnCall(this.service.shortName, resource, nameSuffix, format)),
        );

        const method = classType.addMethod({
          name: methodName,
          returnType: Type.fromName(this, 'iam.Grant'),
          docs: {
            summary: grantSchema.docSummary ?? `Grants ${methodName} permissions`,
          },
        });

        const grantee = method.addParameter({
          name: 'grantee',
          type: Type.fromName(this, 'iam.IGrantable'),
        });

        const actions = expr.ident('actions');

        const commonStatementProps: Record<string, Expression> = {
          actions,
          grantee,
          resourceArns,
        };
        if (grantSchema.conditions != null) {
          commonStatementProps.conditions = expr.lit(grantSchema.conditions);
        }

        const addToPrincipalExpr = $E(expr.ident('iam.Grant'))
          .addToPrincipal(expr.object(commonStatementProps));

        const addToBothExpr = $E(expr.ident('iam.Grant'))
          .addToPrincipalOrResource(expr.object({
            ...commonStatementProps,
            resource: $this.policyResource,
          }));

        method.addBody(stmt.constVar(actions, expr.lit(grantSchema.actions)));

        const result = expr.ident('result');
        if (hasPolicy) {
          method.addBody(stmt.constVar(result, expr.cond($this.policyResource, addToBothExpr, addToPrincipalExpr)));
        } else {
          method.addBody(stmt.constVar(result, addToPrincipalExpr));
        }

        if (grantSchema && grantSchema.keyActions && grantSchema.keyActions.length > 0) {
          const grantOnKey = $this.prop(`${encryptedResourcePropName}?`)
            .callMethod('grantOnKey', grantee, ...grantSchema.keyActions.map((a) => expr.lit(a)));

          method.addBody(grantOnKey);
        }

        method.addBody(stmt.ret(result));

        hasContent = true;
      }
    }

    if (hasContent) {
      if (this.isStable) {
        new ExternalModule(`aws-cdk-lib/aws-${this.service.shortName}`)
          .import(this, this.service.shortName, { fromLocation: `./${this.service.shortName}.generated` });
        new ExternalModule('aws-cdk-lib/aws-iam').import(this, 'iam', { fromLocation: this.iamModulePath });
      } else {
        new ExternalModule(`aws-cdk-lib/aws-${this.service.shortName}`).import(this, this.service.shortName);
        new ExternalModule('aws-cdk-lib/aws-iam').import(this, 'iam');
      }
    }
  }
}

export interface GrantsFileSchema {
  readonly resources: Record<string, ResourceSchema>;
  readonly constants?: Record<string, string[]>;
}

export interface ResourceSchema {
  readonly hasResourcePolicy?: boolean;
  readonly grants: Record<string, GrantSchema>;
}

export interface GrantSchema {
  /**
   * ARN format containing placeholders
   *
   * If absent, just use the resource's default ARN format.
   */
  readonly arnFormat?: string | string[];
  readonly actions: string[];
  readonly keyActions?: string[];
  readonly docSummary?: string;
  readonly conditions?: Record<string, Record<string, unknown>>;
}

function makeArnCall(serviceName: string, resource: Resource, nameSuffix?: string, arnFormat?: string): Expression {
  const arnCall = $E(expr
    .ident(`${serviceName}`)
    .prop(classNameFromResource(resource, nameSuffix))
    .callMethod(`arnFor${resource.name}`, $this.resource),
  );

  return arnFormat != null
    ? expr.strConcat(...replaceVariableWithExpression(arnFormat, arnCall))
    : arnCall;
}

/**
 * Replaces the single variable in the ARN format with an expression. The result may contain up to
 * three elements: prefix, expression and suffix, depending on the arn format.
 * Example: "Foo/${somethingArn}/Bar" -> ["Foo/", CfnSomething.arnForSomething(...), "/Bar"]
 */
function replaceVariableWithExpression(arnFormat: string, expression: Expression): Expression[] {
  const i = arnFormat.indexOf('${');
  const j = arnFormat.indexOf('}', i);

  const prefix = arnFormat.substring(0, i);
  const suffix = arnFormat.substring(j + 1);

  const result: Expression[] = [];
  if (prefix !== '') {
    result.push(expr.lit(prefix));
  }
  if (i >= 0) {
    // Only replace with an expression if there is
    // a variable in the format to begin with
    result.push(expression);
  }
  if (suffix !== '') {
    result.push(expr.lit(suffix));
  }

  return result;
}
