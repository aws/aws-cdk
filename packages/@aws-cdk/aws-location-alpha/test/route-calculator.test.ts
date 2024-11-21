import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { DataSource } from '../lib';
import { RouteCalculator } from '../lib/route-calculator';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a route calculator', () => {
  new RouteCalculator(stack, 'RouteCalculator', {
    dataSource: DataSource.ESRI,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::RouteCalculator', {
    DataSource: 'Esri',
    CalculatorName: 'RouteCalculator',
  });
});

test('creates a route calculator with empty description', () => {
  new RouteCalculator(stack, 'RouteCalculator', {
    description: '',
    dataSource: DataSource.ESRI,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::RouteCalculator', {
    Description: '',
  });
});

test('throws with invalid description', () => {
  expect(() => new RouteCalculator(stack, 'RouteCalculator', {
    description: 'a'.repeat(1001),
    dataSource: DataSource.ESRI,
  })).toThrow('`description` must be between 0 and 1000 characters. Received: 1001 characters');
});

test('create a route calculator with name', () => {
  new RouteCalculator(stack, 'RouteCalculator', {
    dataSource: DataSource.ESRI,
    routeCalculatorName: 'my_route_calculator',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Location::RouteCalculator', {
    DataSource: 'Esri',
    CalculatorName: 'my_route_calculator',
  });
});

test.each(['', 'a'.repeat(101)])('throws with invalid name, got: %s', (routeCalculatorName) => {
  expect(() => new RouteCalculator(stack, 'RouteCalculator', {
    routeCalculatorName,
    dataSource: DataSource.ESRI,
  })).toThrow(`\`routeCalculatorName\` must be between 1 and 100 characters, got: ${routeCalculatorName.length} characters.`);
});

test('throws with invalid name', () => {
  expect(() => new RouteCalculator(stack, 'RouteCalculator', {
    routeCalculatorName: 'inv@lid',
    dataSource: DataSource.ESRI,
  })).toThrow('`routeCalculatorName` must contain only alphanumeric characters, hyphens, periods and underscores, got: inv@lid.');
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
