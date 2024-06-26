import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { DataSource, RouteCalculator } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a route calculator', () => {
  new RouteCalculator(stack, 'RouteCalculator');

  Template.fromStack(stack).hasResourceProperties('AWS::Location::RouteCalculator', {
    DataSource: 'Esri',
    CalculatorName: 'RouteCalculator',
  });
});

test('throws with invalid name', () => {
  expect(() => new RouteCalculator(stack, 'RouteCalculator', {
    routeCalculatorName: 'inv@lid',
    dataSource: DataSource.ESRI,
  })).toThrow(/Invalid route calculator name/);
});

test('grant read actions', () => {
  const routeCalculator = new RouteCalculator(stack, 'RouteCalculator', {
    dataSource: DataSource.HERE,
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('foo'),
  });

  routeCalculator.grantRead(role);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', Match.objectLike({
    PolicyDocument: Match.objectLike({
      Statement: [
        {
          Action: 'geo:CalculateRoute',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'RouteCalculator0F2D109D',
              'Arn',
            ],
          },
        },
      ],
    }),
  }));
});

test('import from arn', () => {
  const routeCalculatorArn = stack.formatArn({
    service: 'geo',
    resource: 'route-calculator',
    resourceName: 'MyRouteCalculator',
  });
  const routeCalculator = RouteCalculator.fromRouteCalculatorArn(stack, 'RouteCalculator', routeCalculatorArn);

  // THEN
  expect(routeCalculator.routeCalculatorName).toEqual('MyRouteCalculator');
  expect(routeCalculator.routeCalculatorArn).toEqual(routeCalculatorArn);
});

test('import from name', () => {
  // WHEN
  const routeCalculatorName = 'MyRouteCalculator';
  const routeCalculator = RouteCalculator.fromRouteCalculatorName(stack, 'RouteCalculator', routeCalculatorName);

  // THEN
  expect(routeCalculator.routeCalculatorName).toEqual(routeCalculatorName);
  expect(routeCalculator.routeCalculatorArn).toEqual(stack.formatArn({
    service: 'geo',
    resource: 'route-calculator',
    resourceName: 'MyRouteCalculator',
  }));
});
