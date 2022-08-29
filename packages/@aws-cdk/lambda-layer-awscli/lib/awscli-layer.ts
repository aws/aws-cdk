/* eslint-disable no-console */
import * as childproc from 'child_process';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { RemovalPolicy, ResourceEnvironment, Stack } from '@aws-cdk/core';
import { Construct, Node } from 'constructs';

/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
export class AwsCliLayer implements lambda.ILayerVersion {

  public readonly env: ResourceEnvironment;
  public readonly layerVersionArn: string;
  public readonly node: Node;
  public readonly stack: Stack;
  public readonly compatibleRuntimes?: lambda.Runtime[];

  private readonly packageName: string = 'lambda-layer-awscli-v1';
  private readonly npmPackage: any;
  private readonly layer: lambda.LayerVersion;

  constructor(scope: Construct, id: string) {
    const version = this.requireWrapper(path.join(__dirname, '../package.json')).devDependencies[this.packageName];
    const pathOfModuleIfAlreadyInstalled = require.resolve(`${this.packageName}`);
    const versionAlreadyInstalled = this.requireWrapper(path.join(pathOfModuleIfAlreadyInstalled, '../../package.json')).version;

    if (version !== versionAlreadyInstalled) {
      this.npmPackage = this.installNpmPackage();
    }
    if (!this.npmPackage) {
      this.npmPackage = this.requireWrapper(this.packageName);
    }
    if (!this.npmPackage) {
      this.npmPackage = this.installNpmPackage();
    }
    if (!this.npmPackage) {
      throw new Error(`Unable to load ${this.packageName}@${version}. See XYZ for details and how to work around this issue.`);
    }

    this.layer = new this.npmPackage.AwsCliLayer(scope, id);

    this.env = this.layer.env;
    this.layerVersionArn = this.layer.layerVersionArn;
    this.node = this.layer.node;
    this.stack = this.layer.stack;
    this.compatibleRuntimes = this.layer.compatibleRuntimes;
  }

  public addPermission(id: string, permission: lambda.LayerVersionPermission): void {
    this.layer.addPermission(id, permission);
  }

  public applyRemovalPolicy(policy: RemovalPolicy): void {
    this.layer.applyRemovalPolicy(policy);
  }

  private requireWrapper(id: string): any {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require(id);
    } catch (err) {
      console.log(`require('${id}') failed`);
      console.log(err);
      if (err instanceof Error) {
        console.error(err.name, err.message.split('\n')[0]);
      }
    }
  }

  private installNpmPackage(): any {
    const installDir = require.main?.paths[0].split('/').slice(0, -1).join('/');
    if (!installDir) {
      return;
    }
    console.log(`Shelling out to run npm install ${this.packageName} --no-save --prefix ${installDir}`);
    const result = childproc.execSync(`pwd; npm prefix; npm install  ${this.packageName} --no-save --prefix ${installDir}`);
    console.log(result.toString('utf8'));
    return this.requireWrapper(path.join(installDir, 'node_modules', this.packageName, 'lib/index.js'));
  }
}
