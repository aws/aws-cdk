import type * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { ImportDeploymentOptions, ResourceImporter } from './importer';
import { info } from '../../cli/messages';
import type { IIoHost, ToolkitAction } from '../../toolkit/cli-io-host';
import { StackCollection } from '../cxapp/cloud-assembly';
import { Deployments, ResourcesToImport } from '../deployments';
import { formatTime } from '../util/string-manipulation';

export interface ResourceMigratorProps {
  deployments: Deployments;
  ioHost: IIoHost;
  action: ToolkitAction;
}

export class ResourceMigrator {
  private readonly props: ResourceMigratorProps;
  private readonly ioHost: IIoHost;
  private readonly action: ToolkitAction;

  public constructor(props: ResourceMigratorProps) {
    this.props = props;
    this.ioHost = props.ioHost;
    this.action = props.action;
  }

  /**
   * Checks to see if a migrate.json file exists. If it does and the source is either `filepath` or
   * is in the same environment as the stack deployment, a new stack is created and the resources are
   * migrated to the stack using an IMPORT changeset. The normal deployment will resume after this is complete
   * to add back in any outputs and the CDKMetadata.
   */
  public async tryMigrateResources(stacks: StackCollection, options: ImportDeploymentOptions): Promise<void> {
    const stack = stacks.stackArtifacts[0];
    const migrateDeployment = new ResourceImporter(stack, {
      deployments: this.props.deployments,
      ioHost: this.ioHost,
      action: this.action,
    });
    const resourcesToImport = await this.tryGetResources(await migrateDeployment.resolveEnvironment());

    if (resourcesToImport) {
      await this.ioHost.notify(info(this.action, `${chalk.bold(stack.displayName)}: creating stack for resource migration...`));
      await this.ioHost.notify(info(this.action, `${chalk.bold(stack.displayName)}: importing resources into stack...`));

      await this.performResourceMigration(migrateDeployment, resourcesToImport, options);

      fs.rmSync('migrate.json');
      await this.ioHost.notify(info(this.action, `${chalk.bold(stack.displayName)}: applying CDKMetadata and Outputs to stack (if applicable)...`));
    }
  }

  /**
   * Creates a new stack with just the resources to be migrated
   */
  private async performResourceMigration(
    migrateDeployment: ResourceImporter,
    resourcesToImport: ResourcesToImport,
    options: ImportDeploymentOptions,
  ) {
    const startDeployTime = new Date().getTime();
    let elapsedDeployTime = 0;

    // Initial Deployment
    await migrateDeployment.importResourcesFromMigrate(resourcesToImport, {
      roleArn: options.roleArn,
      deploymentMethod: options.deploymentMethod,
      usePreviousParameters: true,
      progress: options.progress,
      rollback: options.rollback,
    });

    elapsedDeployTime = new Date().getTime() - startDeployTime;
    await this.ioHost.notify(info(this.action, `'\n✨  Resource migration time: ${formatTime(elapsedDeployTime)}s\n'`, 'CDK_TOOLKIT_I5002', {
      duration: elapsedDeployTime,
    }));
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

