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

      const classType = new ClassType(this, {
        name: `${name}Grants`,
        export: true,
      });

      classType.addProperty({
        name: 'resource',
        immutable: true,
        type: Type.STRING,
        protected: true, // TODO I actually want private
      });

      const init = classType.addInitializer({
        // FIXME this is not having any effect
        visibility: MemberVisibility.Private,
      });

      const resourceParam = init.addParameter({
        name: 'resource',
        type: Type.fromName(this, `${this.service.shortName}.I${resource.name}Ref`),
      });

      init.addBody(
        stmt.assign($this.resource, resourceParam),
      );

      for (const [methodName, grantSchema] of Object.entries(config.grants)) {
        const resourceArns = arns(resource, grantSchema);
        if (resourceArns == null) {
          // Without ARNs, we cannot generate grants.
          continue;
        }

        const method = classType.addMethod({
          name: methodName,
        });

        const grantee = method.addParameter({
          name: 'grantee',
          type: Type.fromName(this, 'iam.IGrantable'),
        });

        const actions = expr.ident('actions');

        method.addBody(
          stmt.constVar(actions, expr.lit(grantSchema.actions)),
          stmt.ret(expr.ident('iam.Grant').prop('addToPrincipalOrResource').call(expr.object({
            actions,
            grantee,
            resourceArns,
            resource: $this.resource,
          }))),
        );
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
