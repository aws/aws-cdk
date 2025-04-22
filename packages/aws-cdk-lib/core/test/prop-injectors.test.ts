import { Match, Template } from '../../assertions';
import { AttributeType, StreamViewType, Table, TableEncryption, TableV2 } from '../../aws-dynamodb';
import { Key } from '../../aws-kms';
import { Code, Function, Runtime } from '../../aws-lambda';
import { BlockPublicAccess, Bucket, BucketEncryption, BucketProps } from '../../aws-s3';
import { Annotations, RemovalPolicy, Stack, Stage } from '../lib';
import { App } from '../lib/app';
import { applyInjectors, findInjectorFromConstruct } from '../lib/private/prop-injectors-helpers';
import { InjectionContext, IPropertyInjector, PropertyInjectors } from '../lib/prop-injectors';

// Define Injectors for our testing
class DoNothingInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor(fqn: string) {
    this.constructUniqueId = fqn;
  }

  inject(originalProps: any, _context: InjectionContext): any {
    return originalProps;
  }
}

const dnBucket = new DoNothingInjector(Bucket.PROPERTY_INJECTION_ID);
const dnFunction = new DoNothingInjector(Function.PROPERTY_INJECTION_ID);
const dnKey = new DoNothingInjector(Key.PROPERTY_INJECTION_ID);

class MyBucketPropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, _context: InjectionContext): any {
    const newProps = {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      ...originalProps,
    };
    return newProps;
  }
}

const bucketInjector = new MyBucketPropsInjector();

class WarningBucketPropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, context: InjectionContext): any {
    if (originalProps.enforceSSL === false) {
      Annotations.of(context.scope).addWarningV2('aws-cdk-lib/core:PropertyInjectors', 'enforceSSL should be set to true');
    }
    return originalProps;
  }
}
const warningBucketInjector = new WarningBucketPropsInjector();

class ErrorBucketPropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, context: InjectionContext): any {
    if (originalProps.enforceSSL === false) {
      throw new Error('enforceSSL should be set to true');
    }
    return originalProps;
  }
}
const errorBucketInjector = new ErrorBucketPropsInjector();

class AccessBucketInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  // Skip property injection if this class attribute is set to true
  private _skip: boolean;

  constructor() {
    this._skip = false;
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: BucketProps, context: InjectionContext): BucketProps {
    const commonInjectionValues = {
      accessControl: undefined,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.KMS,
      enforceSSL: true,
      publicReadAccess: false,
      lifecycleRules: [],
    };

    // Don't set up access logging bucket if this._skip=true
    if (this._skip) {
      return commonInjectionValues;
    }

    let accessLoggingBucket = originalProps.serverAccessLogsBucket;
    if (!accessLoggingBucket) {
      // Set the _skip flag to disable indefinite access log bucket creation loop
      this._skip = true;

      accessLoggingBucket = new Bucket(context.scope, 'access-logging-12345', {
        ...commonInjectionValues,
        removalPolicy: originalProps.removalPolicy ?? RemovalPolicy.RETAIN,
      });

      // reset the _skip flag
      this._skip = false;
    }
    return {
      ...commonInjectionValues,
      serverAccessLogsBucket: accessLoggingBucket,
      ...originalProps,
    };
  }
}

const accessLogBucketInjector = new AccessBucketInjector();

class TablePropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = Table.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, context: InjectionContext): any {
    return {
      encryption: TableEncryption.DEFAULT,
      ...originalProps,
    };
  }
}

class TableV2PropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = TableV2.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, context: InjectionContext): any {
    return {
      deletionProtection: true,
      pointInTimeRecovery: true,
      ...originalProps,
    };
  }
}

describe('PropertyInjectors Attachment', () => {
  test('Attach PropertyInjectors to App', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    new App({
      propertyInjectors: [
        dnBucket,
        dnFunction,
      ],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(
      dnBucket,
      dnFunction,
    );

    mock.mockRestore();
  });

  test('Attach PropertyInjectors to Stage', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    const app = new App();
    new Stage(app, 'MyStage', {
      propertyInjectors: [dnBucket],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(dnBucket);

    mock.mockRestore();
  });

  test('Attach PropertyInjectors to Stack', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    const app = new App();
    const stage = new Stage(app, 'MyStage', {});
    new Stack(stage, 'MyStack', {
      propertyInjectors: [dnFunction],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(dnFunction);

    mock.mockRestore();
  });

  test('Attach PropertyInjectors to Stack without Stage', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    const app = new App();
    new Stack(app, 'MyStack', {
      propertyInjectors: [dnBucket],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(dnBucket);

    mock.mockRestore();
  });
});

describe('PropertyInjectors Tree Traversal', () => {
  test('PropertyInjectors use app over stack', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dnBucket],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [dnFunction],
    });
    const props: BucketProps = {
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
    };

    // WHEN
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual(props);
  });

  test('PropertyInjectors use stack over app', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dnBucket],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        bucketInjector,
        dnKey,
      ],
    });
    const props: BucketProps = {
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
    };

    // WHEN
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual({
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });
  });

  test('PropertyInjectors use stage over app', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dnBucket],
    });
    const stage = new Stage(app, 'MyStage', {
      propertyInjectors: [bucketInjector],
    });
    const stack = new Stack(stage, 'MyStack', {
      propertyInjectors: [
        dnFunction,
        dnKey,
      ],
    });
    const props: BucketProps = {
    };

    // WHEN
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual({
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });
  });

  test('PropertyInjectors in Function scope', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dnBucket],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        dnFunction,
        dnKey,
      ],
    });
    const fn = new Function(stack, 'MyFunc', {
      runtime: Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
      handler: 'index.handler',
      code: Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            body: JSON.stringify('Hello World!'),
          };
        };
      `),
    });
    PropertyInjectors.of(fn).add(bucketInjector);
    const props: BucketProps = {
      blockPublicAccess: undefined,
    };

    // WHEN
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: fn,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual({
      blockPublicAccess: undefined,
      enforceSSL: true,
    });

    // WHEN
    const newProps2 = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps2).toEqual({
      blockPublicAccess: undefined,
    });
  });
});

describe('Bucket Injector', () => {
  test('Accept undefined from originalProp', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [bucketInjector],
    });
    const stack = new Stack(app, 'MyStack', {});
    const props: BucketProps = {
      blockPublicAccess: undefined,
    };

    // WHEN
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual({
      blockPublicAccess: undefined,
      enforceSSL: true,
    });
  });

  test('Use default values', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [bucketInjector],
    });
    const stack = new Stack(app, 'MyStack', {});
    const props: BucketProps = {};

    // WHEN
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual({
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });
  });

  test('Use original values and injector default', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [
        bucketInjector,
        dnFunction,
        dnKey,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const props: BucketProps = {
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
    };

    // WHEN
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual({
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      enforceSSL: true,
    });
  });

  test('Injector throws Warning', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [
        warningBucketInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const mock = jest.spyOn(Annotations.prototype, 'addWarningV2').mockImplementation();

    // WHEN
    const props: BucketProps = {
      enforceSSL: false,
    };
    let newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(
      'aws-cdk-lib/core:PropertyInjectors',
      'enforceSSL should be set to true');
    mock.mockRestore();
    expect(newProps).toEqual(props);

    // WHEN
    const props2: BucketProps = {
      enforceSSL: true,
    };
    newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props2, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual(props2);
  });

  test('Injector throws Error', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [
        errorBucketInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const mock = jest.spyOn(Annotations.prototype, 'addWarningV2').mockImplementation();

    expect(() => {
      // WHEN
      const props: BucketProps = {
        enforceSSL: false,
      };

      applyInjectors(Bucket.PROPERTY_INJECTION_ID, props, {
        scope: stack,
        id: 'TestBucket',
      });
    }).toThrow('enforceSSL should be set to true'); // THEN

    // WHEN
    const props2: BucketProps = {
      enforceSSL: true,
    };
    const newProps = applyInjectors(Bucket.PROPERTY_INJECTION_ID, props2, {
      scope: stack,
      id: 'TestBucket',
    });

    // THEN
    expect(newProps).toEqual(props2);
  });
});

describe('Test Injector by Comparing Templates', () => {
  test('Compare Bucket Injector Templates', () => {
    // GIVEN - with Injector
    const app = new App({
      propertyInjectors: [
        bucketInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const b1 = new Bucket(stack, 'my-bucket-1', {});
    const template = Template.fromStack(stack).toJSON();

    // WHEN - no Injector, but props
    const app2 = new App({});
    const stack2 = new Stack(app2, 'MyStack', {});
    const b2 = new Bucket(stack2, 'my-bucket-1', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    // THEN
    Template.fromStack(stack2).templateMatches(
      Match.exact(template),
    );
  });

  test('Compare AccessLog Bucket Injector Templates', () => {
    // This case is complex because we are creating a bucket within Bucket constructor.
    // GIVEN - with Injector
    const app = new App({
      propertyInjectors: [
        accessLogBucketInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const b1 = new Bucket(stack, 'my-bucket-1', {});
    const template = Template.fromStack(stack).toJSON();

    // WHEN - no Injector, but props
    const app2 = new App({});
    const stack2 = new Stack(app2, 'MyStack', {});
    const accessLog = new Bucket(stack2, 'access-logging-12345', {
      accessControl: undefined,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.KMS,
      enforceSSL: true,
      publicReadAccess: false,
      lifecycleRules: [],
      removalPolicy: RemovalPolicy.RETAIN,
    });
    const b2 = new Bucket(stack2, 'my-bucket-1', {
      accessControl: undefined,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.KMS,
      enforceSSL: true,
      publicReadAccess: false,
      lifecycleRules: [],
      serverAccessLogsBucket: accessLog,
    });

    // THEN
    Template.fromStack(stack2).templateMatches(
      Match.exact(template),
    );
  });
});

describe('DynamoDB Table Injector', () => {
  test('Compare Table and TableV2 Templates', () => {
    // GIVEN - with Injector
    const app = new App({
      propertyInjectors: [
        new TablePropsInjector(),
        new TableV2PropsInjector(),
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    new Table(stack, 'my-table1', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_IMAGE,
    });
    new TableV2(stack, 'my-table2', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
    });
    const template = Template.fromStack(stack).toJSON();

    // WHEN
    const app2 = new App({});
    const stack2 = new Stack(app2, 'MyStack', {});
    new Table(stack2, 'my-table1', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_IMAGE,
      encryption: TableEncryption.DEFAULT,
    });
    new TableV2(stack2, 'my-table2', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      deletionProtection: true,
      pointInTimeRecovery: true,
    });

    // THEN
    Template.fromStack(stack2).templateMatches(
      Match.exact(template),
    );
  });
});

describe('Test findInjectorsFromConstruct', () => {
  test('Has Injectors in app', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dnBucket],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        dnFunction,
        dnKey,
      ],
    });

    // WHEN
    const injector = findInjectorFromConstruct(stack, Bucket.PROPERTY_INJECTION_ID);

    // THEN
    expect(injector?.constructUniqueId).toEqual(Bucket.PROPERTY_INJECTION_ID);
  });

  test('Has Injectors in stack', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dnBucket],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        dnFunction,
        dnKey,
      ],
    });

    // WHEN
    const injector = findInjectorFromConstruct(stack, Function.PROPERTY_INJECTION_ID);

    // THEN
    expect(injector?.constructUniqueId).toEqual(Function.PROPERTY_INJECTION_ID);
  });

  test('No Injectors', () => {
    // GIVEN
    const app = new App({});
    const stack = new Stack(app, 'MyStack', {});

    // WHEN
    const injector = findInjectorFromConstruct(stack, TableV2.PROPERTY_INJECTION_ID);

    // THEN
    expect(injector).toBeUndefined();
  });
});
