import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ImportedBaseService } from '../../lib/base/base-service';

export = {
    'BaseService': {
      'can be imported by serviceArn'(test: Test) {
        const stack = new cdk.Stack();
        const cluster = new ecs.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
        })
  
        test.doesNotThrow(() => {
          new ImportedBaseService(stack, 'BaseService', {
            serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
            cluster: cluster,
          });
        });
  
        test.done();
      },

      'can be imported by serviceName'(test: Test) {
        const stack = new cdk.Stack();
        const cluster = new ecs.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
        })
  
        test.doesNotThrow(() => {
          new ImportedBaseService(stack, 'BaseService', {
            serviceName: 'my-http-service',
            cluster: cluster,
          });
        });
  
        test.done();
      },
  
      'throws an exception if neither serviceName nor serviceArn were provided'(test: Test) {
        const stack = new cdk.Stack();
        const cluster = new ecs.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
        })
  
        test.throws(() => {
          new ImportedBaseService(stack, 'BaseService', {
            cluster: cluster,
          });
        }, /only specify either serviceArn or serviceName/);
  
        test.done();
      },

      'throws an exception if both serviceName and serviceArn were provided'(test: Test) {
        const stack = new cdk.Stack();
        const cluster = new ecs.Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
        })
  
        test.throws(() => {
          new ImportedBaseService(stack, 'BaseService', {
            serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
            serviceName: 'my-http-service',
            cluster: cluster,
          });
        }, /only specify either serviceArn or serviceName/);
  
        test.done();
      },
    },
};