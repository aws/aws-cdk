import * as cdk from '@aws-cdk/core';
import * as ecs from '../lib';

describe('When import an ECS Service', () => {
  test('with serviceArnWithCluster', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const clusterName = 'cluster-name';
    const serviceName = 'my-http-service';
    const region = 'service-region';
    const account = 'service-account';
    const serviceArn = `arn:aws:ecs:${region}:${account}:service/${clusterName}/${serviceName}`;

    // WHEN
    const service = ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);

    // THEN
    expect(service.serviceArn).toEqual(serviceArn);
    expect(service.serviceName).toEqual(serviceName);
    expect(service.env.account).toEqual(account);
    expect(service.env.region).toEqual(region);

    expect(service.cluster.clusterName).toEqual(clusterName);
    expect(service.cluster.env.account).toEqual(account);
    expect(service.cluster.env.region).toEqual(region);
  });

  test('throws an expection if no resourceName provided on fromServiceArnWithCluster', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const region = 'service-region';
    const account = 'service-account';
    const serviceArn = `arn:aws:ecs:${region}:${account}:service`;

    //THEN
    expect(() => {
      ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);
    }).toThrowError(/Missing resource Name from service ARN/);
  });

  test('throws an expection if not using cluster arn format on fromServiceArnWithCluster', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const region = 'service-region';
    const account = 'service-account';
    const serviceName = 'my-http-service';
    const serviceArn = `arn:aws:ecs:${region}:${account}:service/${serviceName}`;

    //THEN
    expect(() => {
      ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);
    }).toThrowError(`resource name ${serviceName} from service ARN`);
  });
});
