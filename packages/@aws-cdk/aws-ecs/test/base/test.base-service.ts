import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Cluster } from '../../lib';
import { ImportedBaseService } from '../../lib/base/base-service';

export = {
    BaseService: {
      'can be imported'(test: Test) {
        const stack = new cdk.Stack();
        const cluster = new Cluster(stack, 'Cluster', {
          clusterName: 'cluster',
        });

        test.doesNotThrow(() => {
          new ImportedBaseService(stack, 'FargateService', {
            serviceName: 'my-http-service',
            cluster,
          });
        });

        test.done();
      },
    },
};