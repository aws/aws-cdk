import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as rds from '@aws-cdk/aws-rds';
import { IAspect, IConstruct, Stack } from '@aws-cdk/core';

export class BackupableResourcesCollector implements IAspect {
  public readonly resources: string[] = [];

  public visit(node: IConstruct) {
    if (node instanceof efs.CfnFileSystem) {
      this.resources.push(Stack.of(node).formatArn({
        service: 'elasticfilesystem',
        resource: 'file-system',
        resourceName: node.ref,
      }));
    }

    if (node instanceof dynamodb.CfnTable) {
      this.resources.push(Stack.of(node).formatArn({
        service: 'dynamodb',
        resource: 'table',
        resourceName: node.ref,
      }));
    }

    if (node instanceof ec2.CfnInstance) {
      this.resources.push(Stack.of(node).formatArn({
        service: 'ec2',
        resource: 'instance',
        resourceName: node.ref,
      }));
    }

    if (node instanceof ec2.CfnVolume) {
      this.resources.push(Stack.of(node).formatArn({
        service: 'ec2',
        resource: 'volume',
        resourceName: node.ref,
      }));
    }

    if (node instanceof rds.CfnDBInstance) {
      this.resources.push(Stack.of(node).formatArn({
        service: 'rds',
        resource: 'db',
        sep: ':',
        resourceName: node.ref,
      }));
    }
  }
}
