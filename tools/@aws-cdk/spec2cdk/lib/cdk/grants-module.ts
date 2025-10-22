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
import { Statement } from '@cdklabs/typewriter/lib/statements';
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
    let hasContent = false;
    let kmsImported = false;
    const resources = this.db.follow('hasResource', this.service);
    const resourceIndex = Object.fromEntries(resources.map(r => [r.entity.name, r.entity]));

    for (const [name, config] of Object.entries(this.schema.resources ?? {})) {
      if (!resourceIndex[name]) continue;
      const resource = resourceIndex[name];

      const arnMap = resourceArnMap(resource, config.grants);
      if (Object.keys(arnMap).length === 0) continue;

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

      init.addBody(stmt.assign($this.resource, resourceParam));

      const hasKeyActions = Object.values(config.grants).some(grant => grant.keyActions && grant.keyActions.length > 0);
      if (hasKeyActions) {
        if (!kmsImported) {
          new ExternalModule('aws-cdk-lib/aws-kms').import(this, 'kms');
        }

        const iKeyType = Type.fromName(this, 'kms.IKey');
        classType.addProperty({
          name: 'key',
          immutable: true,
          type: iKeyType,
          protected: true, // TODO I actually want private
        });

        const keyParam = init.addParameter({
          name: 'key',
          type: iKeyType,
        });

        init.addBody(stmt.assign($this.key, keyParam));
      }

      for (const [methodName, grantSchema] of Object.entries(config.grants)) {
        const resourceArns = arnMap[methodName];
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

        const methodBody: Array<Statement | Expression> = [
          stmt.constVar(actions, expr.lit(grantSchema.actions)),
          stmt.ret(expr.ident('iam.Grant').prop('addToPrincipalOrResource').call(expr.object({
            actions,
            grantee,
            resourceArns,
            resource: $this.resource,
          }))),
        ];

        if (grantSchema && grantSchema.keyActions && grantSchema.keyActions.length > 0) {
          const keyActions = expr.ident('keyActions');
          methodBody.push(stmt.constVar(keyActions, expr.lit(grantSchema.keyActions)));

          // Generate key.grantKey(grantee, "kms:Decrypt");
          methodBody.push($this.key.prop('grant').call(grantee, keyActions));
        }

        method.addBody(...methodBody);
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
