import * as iam from 'aws-cdk-lib/aws-iam';
import { ArnFormat, IResource, Lazy, Resource, Stack, Token } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnRouteCalculator } from 'aws-cdk-lib/aws-location';
import { generateUniqueId, DataSource } from './util';

/**
 * A Route Calculator
 */
export interface IRouteCalculator extends IResource {
  /**
   * The name of the route calculator
   *
   * @attribute
   */
  readonly routeCalculatorName: string;

  /**
   * The Amazon Resource Name (ARN) of the route calculator resource
   *
   * @attribute Arn,CalculatorArn
   */
  readonly routeCalculatorArn: string;
}

/**
 * Properties for a route calculator
 */
export interface RouteCalculatorProps {
  /**
   * A name for the route calculator
   *
   * Must be between 1 and 100 characters and contain only alphanumeric characters,
   * hyphens, periods and underscores.
   *
   * @default - A name is automatically generated
   */
  readonly routeCalculatorName?: string;

  /**
   * Data source for the route calculator
   */
  readonly dataSource: DataSource;

  /**
   * A description for the route calculator
   *
   * @default - no description
   */
  readonly description?: string;
}

/**
 * A Route Calculator
 *
 * @see https://docs.aws.amazon.com/location/latest/developerguide/places-concepts.html
 */
export class RouteCalculator extends Resource implements IRouteCalculator {
  /**
   * Use an existing route calculator by name
   */
  public static fromRouteCalculatorName(scope: Construct, id: string, routeCalculatorName: string): IRouteCalculator {
    const routeCalculatorArn = Stack.of(scope).formatArn({
      service: 'geo',
      resource: 'route-calculator',
      resourceName: routeCalculatorName,
    });

    return RouteCalculator.fromRouteCalculatorArn(scope, id, routeCalculatorArn);
  }

  /**
   * Use an existing route calculator by ARN
   */
  public static fromRouteCalculatorArn(scope: Construct, id: string, routeCalculatorArn: string): IRouteCalculator {
    const parsedArn = Stack.of(scope).splitArn(routeCalculatorArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (!parsedArn.resourceName) {
      throw new Error(`Route Calculator Arn ${routeCalculatorArn} does not have a resource name.`);
    }

    class Import extends Resource implements IRouteCalculator {
      public readonly routeCalculatorName = parsedArn.resourceName!;
      public readonly routeCalculatorArn = routeCalculatorArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly routeCalculatorName: string;

  public readonly routeCalculatorArn: string;

  /**
   * The timestamp for when the route calculator resource was created in ISO 8601 format
   *
   * @attribute
   */
  public readonly routeCalculatorCreateTime: string;

  /**
   * The timestamp for when the route calculator resource was last updated in ISO 8601 format
   *
   * @attribute
   */
  public readonly routeCalculatorUpdateTime: string;

  constructor(scope: Construct, id: string, props: RouteCalculatorProps) {

    if (props.description && !Token.isUnresolved(props.description) && props.description.length > 1000) {
      throw new Error(`\`description\` must be between 0 and 1000 characters. Received: ${props.description.length} characters`);
    }

    if (props.routeCalculatorName !== undefined && !Token.isUnresolved(props.routeCalculatorName)) {
      if (props.routeCalculatorName.length < 1 || props.routeCalculatorName.length > 100) {
        throw new Error(`\`routeCalculatorName\` must be between 1 and 100 characters, got: ${props.routeCalculatorName.length} characters.`);
      }

      if (!/^[-._\w]+$/.test(props.routeCalculatorName)) {
        throw new Error(`\`routeCalculatorName\` must contain only alphanumeric characters, hyphens, periods and underscores, got: ${props.routeCalculatorName}.`);
      }
    }

    super(scope, id, {
      physicalName: props.routeCalculatorName ?? Lazy.string({ produce: () => generateUniqueId(this) }),
    });

    const routeCalculator = new CfnRouteCalculator(this, 'Resource', {
      calculatorName: this.physicalName,
      dataSource: props.dataSource ?? DataSource.ESRI,
      description: props.description,
    });

    this.routeCalculatorName = routeCalculator.ref;
    this.routeCalculatorArn = routeCalculator.attrArn;
    this.routeCalculatorCreateTime = routeCalculator.attrCreateTime;
    this.routeCalculatorUpdateTime = routeCalculator.attrUpdateTime;
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this route calculator.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: actions,
      resourceArns: [this.routeCalculatorArn],
    });
  }

  /**
   * Grant the given identity permissions to access to a route calculator resource to calculate a route.
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-calculate-route
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee,
      'geo:CalculateRoute',
    );
  }
}
