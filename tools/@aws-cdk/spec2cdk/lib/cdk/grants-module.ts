import { promises as fs } from 'fs';
import * as path from 'node:path';
import { Resource, Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import {
  $E,
  ClassType,
  expr,
  Expression,
  ExternalModule,
  MemberVisibility,
  Module,
  stmt,
  Type,
} from '@cdklabs/typewriter';
import { camelcasedResourceName, referencePropertyName } from '../naming';
import { findArnProperty } from './resource-class';

const $this = $E(expr.this_());

/**
 * From some data, generate grants
 *
 * For now, the grants data will be in a JSON file inside the service directory;
 * in the future, this data will be moved to the `awscdk-service-spec`
 * repository.
 */
export class GrantsModule extends Module {
  public static async forService(db: SpecDatabase, service: Service, sourceFile: string): Promise<GrantsModule | undefined> {
    try {
      const location = path.join(__dirname, '../../../../../packages/aws-cdk-lib', sourceFile);
      const schema = JSON.parse(await fs.readFile(location, 'utf-8'));
      return new GrantsModule(service, db, schema);
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
    // TODO Only build anything at all if there are resources with grants

    new ExternalModule(`aws-cdk-lib/aws-${this.service.shortName}`).import(this, this.service.shortName);
    new ExternalModule('aws-cdk-lib/aws-iam').import(this, 'iam');

    const resources = this.db.follow('hasResource', this.service);

    const resourceIndex = Object.fromEntries(resources.map(r => [r.entity.name, r.entity]));

    for (const [name, config] of Object.entries(this.schema.resources ?? {})) {
      if (!resourceIndex[name]) continue;
      const resource = resourceIndex[name];

      const hasPolicy = config.hasResourcePolicy ?? false;

      const classType = new ClassType(this, {
        name: `${name}Grants`,
        export: true,
      });

      // IBucketRef
      // FIXME: Not sure that Type.fromName() is the best to be used here.
      const resourceRefType = Type.fromName(this, `${this.service.shortName}.I${resource.name}Ref`);

      classType.addProperty({
        name: 'resource',
        immutable: true,
        type: resourceRefType,
        protected: true, // TODO I actually want private
      });

      const init = classType.addInitializer({
        // FIXME this is not having any effect
        visibility: MemberVisibility.Private,
      });

      const resourceParam = init.addParameter({
        name: 'resource',
        type: resourceRefType,
      });
      init.addBody(
        stmt.assign($this.resource, resourceParam),
      );

      if (hasPolicy) {
        const resourceWithPolicy = Type.fromName(this, 'iam.IResourceWithPolicy');
        const field = classType.addProperty({
          name: 'policyResource',
          immutable: true,
          type: resourceWithPolicy,
          optional: true,
        });
        const param = init.addParameter({
          name: 'policyResource',
          type: resourceWithPolicy,
          optional: true,
        });
        init.addBody(
          stmt.assign($this[field.name], param),
        );
      }

      for (const [methodName, grantSchema] of Object.entries(config.grants)) {
        const resourceArns = arns(resource, grantSchema);
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

        if (hasPolicy) {
          method.addBody(
            stmt.constVar(actions, expr.lit(grantSchema.actions)),
            stmt.ret(expr.cond($this.policyResource, addToBothExpr, addToPrincipalExpr)),
          );
        } else {
          method.addBody(
            stmt.constVar(actions, expr.lit(grantSchema.actions)),
            stmt.ret(addToPrincipalExpr));
        }
      }
    }
  }
}

function arns(resource: Resource, grantSchema?: GrantSchema): Expression | undefined {
  const arnFormat = grantSchema?.arnFormat;
  const refName = `this.resource.${camelcasedResourceName(resource)}Ref`;

  if (arnFormat != null) {
    return expr.list([expr.ident(replace(refName, arnFormat))]);
  }

  const cfnArnProperty = findArnProperty(resource);
  return cfnArnProperty == null
    ? undefined
    : expr.list([expr.ident(`${refName}.${referencePropertyName(cfnArnProperty, resource.name)}`)]);
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

function replace(refName: string, arnFormat: string): string {
  return arnFormat.replace(/\${([^{}]+)}/g, (_, varName) => {
    return `${refName}.${varName}`;
  });
}
