import { promises as fs } from 'fs';
import { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { Module } from '@cdklabs/typewriter';

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
      const schema = JSON.parse(await fs.readFile(sourceFile, 'utf-8'));
      return new GrantsModule(`${service.shortName}.grants`, db, schema);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return undefined;
      }
      throw e;
    }
  }

  private constructor(moduleFqn: string, _db: SpecDatabase, _schema: GrantsFileSchema) {
    super(moduleFqn);
    this.build();
  }

  private build() {
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
