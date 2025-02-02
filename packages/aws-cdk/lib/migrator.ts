import type * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { StackCollection } from './api/cxapp/cloud-assembly';
import { Deployments, ResourcesToImport } from './api/deployments';
import { formatTime } from './api/util/string-manipulation';
import { DeployOptions } from './cli/cdk-toolkit';
import { ResourceImporter } from './import';
import { info } from './logging';

export interface ResourceMigratorProps {
  deployments: Deployments;
}

type ResourceMigratorOptions = Pick<DeployOptions, 'roleArn' | 'toolkitStackName' | 'deploymentMethod' | 'progress' | 'rollback'>

export class ResourceMigrator {
  public constructor(private readonly props: ResourceMigratorProps) {}

  /**
   * Checks to see if a migrate.json file exists. If it does and the source is either `filepath` or
   * is in the same environment as the stack deployment, a new stack is created and the resources are
   * migrated to the stack using an IMPORT changeset. The normal deployment will resume after this is complete
   * to add back in any outputs and the CDKMetadata.
   */
  public async tryMigrateResources(stacks: StackCollection, options: ResourceMigratorOptions): Promise<void> {
    const stack = stacks.stackArtifacts[0];
    const migrateDeployment = new ResourceImporter(stack, this.props.deployments);
    const resourcesToImport = await this.tryGetResources(await migrateDeployment.resolveEnvironment());

    if (resourcesToImport) {
      info('%s: creating stack for resource migration...', chalk.bold(stack.displayName));
      info('%s: importing resources into stack...', chalk.bold(stack.displayName));

      await this.performResourceMigration(migrateDeployment, resourcesToImport, options);

      fs.rmSync('migrate.json');
      info('%s: applying CDKMetadata and Outputs to stack (if applicable)...', chalk.bold(stack.displayName));
    }
  }

  /**
   * Creates a new stack with just the resources to be migrated
   */
  private async performResourceMigration(
    migrateDeployment: ResourceImporter,
    resourcesToImport: ResourcesToImport,
    options: ResourceMigratorOptions,
  ) {
    const startDeployTime = new Date().getTime();
    let elapsedDeployTime = 0;

    // Initial Deployment
    await migrateDeployment.importResourcesFromMigrate(resourcesToImport, {
      roleArn: options.roleArn,
      toolkitStackName: options.toolkitStackName,
      deploymentMethod: options.deploymentMethod,
      usePreviousParameters: true,
      progress: options.progress,
      rollback: options.rollback,
    });

    elapsedDeployTime = new Date().getTime() - startDeployTime;
    info('\n✨  Resource migration time: %ss\n', formatTime(elapsedDeployTime));
  }

  public async tryGetResources(environment: cxapi.Environment): Promise<ResourcesToImport | undefined> {
    try {
      const migrateFile = fs.readJsonSync('migrate.json', {
        encoding: 'utf-8',
      });
      const sourceEnv = (migrateFile.Source as string).split(':');
      if (
        sourceEnv[0] === 'localfile' ||
        (sourceEnv[4] === environment.account && sourceEnv[3] === environment.region)
      ) {
        return migrateFile.Resources;
      }
    } catch (e) {
      // Nothing to do
    }

    return undefined;
  }
}

