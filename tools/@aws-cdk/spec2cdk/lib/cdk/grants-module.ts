import { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import {
  $E,
  ClassType,
  expr,
  Expression,
  ExternalModule,
  InterfaceType,
  MemberVisibility,
  Module,
  stmt,
  Type,
} from '@cdklabs/typewriter';
import { PropertySpec } from '@cdklabs/typewriter/lib/property';
import { classNameFromResource } from '../naming';

const $this = $E(expr.this_());

/**
 * From some data, generate grants
 *
 * For now, the grants data will be in a JSON file inside the service directory;
 * in the future, this data will be moved to the `awscdk-service-spec`
 * repository.
 */
export class GrantsModule extends Module {
  public static forServiceFromString(db: SpecDatabase, service: Service, config?: string): GrantsModule | undefined {
    if (config == null) {
      return undefined;
    }
    const schema = JSON.parse(config);
    return new GrantsModule(service, db, schema);
  }

  private constructor(private readonly service: Service, private readonly db: SpecDatabase, private readonly schema: GrantsFileSchema) {
    super(`${service.shortName}.grants`);
  }

  public build(arnContainers: Set<string>) {
    let hasContent = false;
    const resources = this.db.follow('hasResource', this.service);
    const resourceIndex = Object.fromEntries(resources.map(r => [r.entity.name, r.entity]));
    const encryptedResourcePropName = 'encryptedResource';

    for (const [name, config] of Object.entries(this.schema.resources ?? {})) {
      if (!resourceIndex[name] || Object.keys(config.grants ?? {}).length === 0) continue;
      const resource = resourceIndex[name];

      const hasPolicy = config.hasResourcePolicy ?? false;
      const hasKeyActions = Object.values(config.grants)
        .some(grant => grant.keyActions && grant.keyActions.length > 0);

      if (!arnContainers.has(resource.cloudFormationType)) {
        continue;
      }

      const className = `${name}Grants`;

      const interfaceName = `${this.service.shortName}.I${resource.name}Ref`;
      const propsProperties: PropertySpec[] = [{
        name: 'resource',
        type: Type.fromName(this, interfaceName),
        immutable: true,
        docs: {
          summary: 'The resource on which actions will be allowed',
        },
      }];

      if (hasPolicy) {
        propsProperties.push({
          name: 'policyResource',
          type: Type.fromName(this, 'iam.IResourceWithPolicy'),
          optional: true,
          immutable: true,
        });
      }
      if (hasKeyActions) {
        propsProperties.push({
          name: encryptedResourcePropName,
          type: Type.fromName(this, 'iam.IEncryptedResource'),
          optional: true,
          immutable: true,
        });
      }

      const propsType = new InterfaceType(this, {
        name: `${className}Props`,
        export: true,
        properties: propsProperties,
        docs: {
          summary: `Properties for ${className}`,
        },
      });

      const classType = new ClassType(this, {
        name: className,
        export: true,
        docs: {
          summary: `Collection of grant methods for a ${interfaceName}`,
        },
      });

      // IBucketRef
      // FIXME: Not sure that Type.fromName() is the best to be used here.
      const resourceRefType = Type.fromName(this, interfaceName);

      classType.addProperty({
        name: 'resource',
        immutable: true,
        type: resourceRefType,
        protected: true,
      });

      const init = classType.addInitializer({
        // FIXME this is not having any effect
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
        });

        init.addBody(stmt.assign($this[encryptedResourcePropName], propsParameter.prop(encryptedResourcePropName)));
      }

      if (hasPolicy) {
        const resourceWithPolicy = Type.fromName(this, 'iam.IResourceWithPolicy');
        classType.addProperty({
          name: 'policyResource',
          immutable: true,
          type: resourceWithPolicy,
          optional: true,
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
        type: resourceRefType,
      });

      const props: Record<string, Expression> = {
        resource: staticResourceParam,
      };

      if (hasKeyActions) {
        props[encryptedResourcePropName] = expr.cond(
          $E(expr.ident('iam.GrantableResources')).isEncryptedResource(staticResourceParam),
          staticResourceParam,
          expr.UNDEFINED,
        );
      }

      if (hasPolicy) {
        props.policyResource = expr.cond(
          $E(expr.ident('iam.GrantableResources')).isResourceWithPolicy(staticResourceParam),
          staticResourceParam,
          expr.UNDEFINED,
        );
      }

      factoryMethod.addBody(
        stmt.ret(Type.fromName(this, className).newInstance(expr.object(props))),
      );

      // Add one method per entry in the config
      for (const [methodName, grantSchema] of Object.entries(config.grants)) {
        const resourceArns = expr.list([
          makeArnCall(this.service.shortName, resource, grantSchema),
        ]);

        const method = classType.addMethod({
          name: methodName,
          returnType: Type.fromName(this, 'iam.Grant'),
        });

        const grantee = method.addParameter({
          name: 'grantee',
          type: Type.fromName(this, 'iam.IGrantable'),
        });

        const actions = expr.ident('actions');

        const addToPrincipalExpr = $E(expr.ident('iam.Grant')).addToPrincipal(expr.object({
          actions,
          grantee,
          resourceArns,
        }));
        const addToBothExpr = $E(expr.ident('iam.Grant')).addToPrincipalOrResource(expr.object({
          actions,
          grantee,
          resourceArns,
          resource: $this.policyResource,
        }));

        method.addBody(stmt.constVar(actions, expr.lit(grantSchema.actions)));

        if (grantSchema && grantSchema.keyActions && grantSchema.keyActions.length > 0) {
          const grantOnKey = $this.prop(`${encryptedResourcePropName}?`)
            .callMethod('grantOnKey', grantee, ...grantSchema.keyActions.map((a) => expr.lit(a)));

          method.addBody(grantOnKey);
        }

        if (hasPolicy) {
          method.addBody(stmt.ret(expr.cond($this.policyResource, addToBothExpr, addToPrincipalExpr)));
        } else {
          method.addBody(stmt.ret(addToPrincipalExpr));
        }

        hasContent = true;
      }
    }

    if (hasContent) {
      new ExternalModule(`aws-cdk-lib/aws-${this.service.shortName}`)
        .import(this, this.service.shortName, { fromLocation: `./${this.service.shortName}.generated` });
      new ExternalModule('aws-cdk-lib/aws-iam').import(this, 'iam');
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
  readonly arnFormat?: string;
  readonly actions: string[];
  readonly keyActions?: string[];
}

function makeArnCall(serviceName: string, resource: Resource, grantSchema?: GrantSchema): Expression {
  const arnFormat = grantSchema?.arnFormat;
  const arnCall = $E(expr
    .ident(`${serviceName}`)
    .prop(classNameFromResource(resource)) // TODO What about the suffix?
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
  result.push(expression);
  if (suffix !== '') {
    result.push(expr.lit(suffix));
  }

  return result;
}
