import { promises as fs } from 'fs';
import * as path from 'node:path';
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
import { camelcasedResourceName, referencePropertyName } from '../naming';
import { findArnProperty } from './arn';

const $this = $E(expr.this_());

/**
 * From some data, generate grants
 *
 * For now, the grants data will be in a JSON file inside the service directory;
 * in the future, this data will be moved to the `awscdk-service-spec`
 * repository.
 */
export class GrantsModule extends Module {
  public static async forServiceFromString(db: SpecDatabase, service: Service, config: string): Promise<GrantsModule | undefined> {
    const schema = JSON.parse(config);
    return new GrantsModule(service, db, schema);
  }

  public static async forServiceFromFile(db: SpecDatabase, service: Service, sourceFile: string): Promise<GrantsModule | undefined> {
    try {
      const location = path.join(__dirname, '../../../../../packages/aws-cdk-lib', sourceFile);
      return await GrantsModule.forServiceFromString(db, service, await fs.readFile(location, 'utf-8'));
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return undefined;
      }
      throw e;
    }
  }

  private constructor(private readonly service: Service, private readonly db: SpecDatabase, private readonly schema: GrantsFileSchema) {
    super(`${service.shortName}.grants`);
    this.build();
  }

  private build() {
    let hasContent = false;
    const resources = this.db.follow('hasResource', this.service);
    const resourceIndex = Object.fromEntries(resources.map(r => [r.entity.name, r.entity]));
    const encryptedResourcePropName = 'encryptedResource';

    for (const [name, config] of Object.entries(this.schema.resources ?? {})) {
      if (!resourceIndex[name]) continue;
      const resource = resourceIndex[name];

      const hasPolicy = config.hasResourcePolicy ?? false;
      const hasKeyActions = Object.values(config.grants)
        .some(grant => grant.keyActions && grant.keyActions.length > 0);

      const arnMap = resourceArnMap(resource, config.grants);
      if (Object.keys(arnMap).length === 0) continue;

      const className = `${name}Grants`;

      const propsProperties: PropertySpec[] = [{
        name: 'resource',
        type: Type.fromName(this, `${this.service.shortName}.I${resource.name}Ref`),
        immutable: true,
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
      });

      const classType = new ClassType(this, {
        name: className,
        export: true,
      });

      // IBucketRef
      // FIXME: Not sure that Type.fromName() is the best to be used here.
      const resourceRefType = Type.fromName(this, `${this.service.shortName}.I${resource.name}Ref`);

      classType.addProperty({
        name: 'resource',
        immutable: true,
        type: resourceRefType,
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

      for (const [methodName, grantSchema] of Object.entries(config.grants)) {
        const resourceArns = arnMap[methodName];
        if (resourceArns == null) {
          // Without ARNs, we cannot generate grants.
          continue;
        }

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
      new ExternalModule(`aws-cdk-lib/aws-${this.service.shortName}`).import(this, this.service.shortName);
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

function resourceArnMap(resource: Resource, grants: Record<string, GrantSchema>): Record<string, Expression> {
  const result: Record<string, Expression> = {};
  for (const [methodName, grantSchema] of Object.entries(grants)) {
    let expression = arns(resource, grantSchema);
    if (expression != null) {
      result[methodName] = expression;
    }
  }
  return result;
}

function arns(resource: Resource, grantSchema?: GrantSchema): Expression | undefined {
  const arnFormat = grantSchema?.arnFormat;
  const refName = `this.resource.${camelcasedResourceName(resource)}Ref`;

  if (arnFormat != null) {
    return expr.list([expr.strConcat(...replace(refName, arnFormat))]);
  }

  const cfnArnProperty = findArnProperty(resource);
  return cfnArnProperty == null
    ? undefined
    : expr.list([expr.ident(`${refName}.${referencePropertyName(cfnArnProperty, resource.name)}`)]);
}

// TODO better name
function replace(refName: string, arnFormat: string): Expression[] {
  const i = arnFormat.indexOf('${');
  const j = arnFormat.indexOf('}', i);

  const prefix = arnFormat.substring(0, i);
  const varName = arnFormat.substring(i + 2, j);
  const suffix = arnFormat.substring(j + 1);

  const result: Expression[] = [];
  if (prefix !== '') {
    result.push(expr.lit(prefix));
  }
  result.push(expr.ident(`${refName}.${varName}`));
  if (suffix !== '') {
    result.push(expr.lit(suffix));
  }

  return result;
}
