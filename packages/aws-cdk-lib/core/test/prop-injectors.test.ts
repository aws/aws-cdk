import { Construct } from 'constructs';
import { Annotations, Resource, Stack, Stage } from '../lib';
import { App } from '../lib/app';
import { applyInjectors, findInjectorFromConstruct } from '../lib/private/prop-injectors-helpers';
import { propertyInjectable } from '../lib/prop-injectable';
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

interface TestConstructProps {
  readonly prop1?: string;
  readonly prop2?: string;
}

// Define Test Construct that is injectable
@propertyInjectable
class TestConstruct extends Resource {
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.core.TestConstruct';

  constructor(scope: Construct, id: string, props: TestConstructProps = {}) {
    super(scope, id);
  }
}

@propertyInjectable
class TestConstruct2 extends Resource {
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.core.TestConstruct2';

  constructor(scope: Construct, id: string, props: TestConstructProps = {}) {
    super(scope, id);
  }
}

const dn1 = new DoNothingInjector(TestConstruct.PROPERTY_INJECTION_ID);
const dn2 = new DoNothingInjector(TestConstruct2.PROPERTY_INJECTION_ID);

class TestConstructPropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = TestConstruct.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, _context: InjectionContext): any {
    const newProps = {
      prop1: 'correctValue',
      ...originalProps,
    };
    return newProps;
  }
}

const testInjector = new TestConstructPropsInjector();

class WarningPropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = TestConstruct.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, context: InjectionContext): any {
    if (originalProps.prop1 === 'badValue') {
      Annotations.of(context.scope).addWarningV2('aws-cdk-lib/core:PropertyInjectors', 'prop1 has badValue');
    }
    return originalProps;
  }
}
const warningInjector = new WarningPropsInjector();

class ErrorPropsInjector implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor() {
    this.constructUniqueId = TestConstruct.PROPERTY_INJECTION_ID;
  }

  inject(originalProps: any, context: InjectionContext): any {
    if (originalProps.prop1 === 'veryBadValue') {
      throw new Error('prop1 has veryBadValue');
    }
    return originalProps;
  }
}
const errorInjector = new ErrorPropsInjector();

describe('PropertyInjectors Attachment', () => {
  test('Attach PropertyInjectors to App', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    new App({
      propertyInjectors: [
        dn1,
        dn2,
      ],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(
      dn1,
      dn2,
    );

    mock.mockRestore();
  });

  test('Attach PropertyInjectors to Stage', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    const app = new App();
    new Stage(app, 'MyStage', {
      propertyInjectors: [dn1],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(dn1);

    mock.mockRestore();
  });

  test('Attach PropertyInjectors to Stack', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    const app = new App();
    const stage = new Stage(app, 'MyStage', {});
    new Stack(stage, 'MyStack', {
      propertyInjectors: [dn1],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(dn1);

    mock.mockRestore();
  });

  test('Attach PropertyInjectors to Stack without Stage', () => {
    // GIVEN
    const mock = jest.spyOn(PropertyInjectors.prototype, 'add').mockImplementation();

    // WHEN
    const app = new App();
    new Stack(app, 'MyStack', {
      propertyInjectors: [dn1],
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(dn1);

    mock.mockRestore();
  });
});

describe('PropertyInjectors Tree Traversal', () => {
  test('PropertyInjectors use app over stack', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dn1],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [dn2],
    });
    const props: TestConstructProps = {
      prop1: 'abc',
    };

    // WHEN
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual(props);
  });

  test('PropertyInjectors use stack over app', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dn1],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        testInjector,
        dn2,
      ],
    });
    const props: TestConstructProps = {
    };

    // WHEN
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestConstruct1',
    });

    // THEN
    expect(newProps).toEqual({
      prop1: 'correctValue',
    });
  });

  test('PropertyInjectors use stage over app', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dn1],
    });
    const stage = new Stage(app, 'MyStage', {
      propertyInjectors: [testInjector],
    });
    const stack = new Stack(stage, 'MyStack', {
      propertyInjectors: [
        dn2,
      ],
    });
    const props: TestConstructProps = {
    };

    // WHEN
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual({
      prop1: 'correctValue',
    });
  });

  test('PropertyInjectors in Function scope', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dn1],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        dn2
      ],
    });
    const tc2 = new TestConstruct2(stack, 'MyFunc', {});
    PropertyInjectors.of(tc2).add(testInjector);
    const props: TestConstructProps = {
    };

    // WHEN
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: tc2,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual({
      prop1: 'correctValue',
    });
  });
});

describe('TestConstruct Injector', () => {
  test('Accept undefined from originalProp', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [testInjector],
    });
    const stack = new Stack(app, 'MyStack', {});
    const props: TestConstructProps = {
      prop2: undefined,
    };

    // WHEN
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual({
      prop1: 'correctValue',
      prop2: undefined,
    });
  });

  test('Use default values', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [testInjector],
    });
    const stack = new Stack(app, 'MyStack', {});
    const props: TestConstructProps = {};

    // WHEN
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual({
      prop1: 'correctValue',
    });
  });

  test('Use original values and injector default', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [
        testInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const props: TestConstructProps = {
      prop2: 'value2',
    };

    // WHEN
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual({
      prop2: 'value2',
      prop1: 'correctValue',
    });
  });

  test('Injector throws Warning', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [
        warningInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const mock = jest.spyOn(Annotations.prototype, 'addWarningV2').mockImplementation();

    // WHEN
    const props: TestConstructProps = {
      prop1: 'badValue',
    };
    let newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(mock).toHaveBeenCalledWith(
      'aws-cdk-lib/core:PropertyInjectors',
      'prop1 has badValue');
    mock.mockRestore();
    expect(newProps).toEqual(props);

    // WHEN
    const props2: TestConstructProps = {
      prop1: 'someValue',
    };
    newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props2, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual(props2);
  });

  test('Injector throws Error', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [
        errorInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const mock = jest.spyOn(Annotations.prototype, 'addWarningV2').mockImplementation();

    expect(() => {
      // WHEN
      const props: TestConstructProps = {
        prop1: 'veryBadValue',
      };

      applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
        scope: stack,
        id: 'TestConstruct',
      });
    }).toThrow('prop1 has veryBadValue'); // THEN

    // WHEN
    const props2: TestConstructProps = {
      prop1: 'myTestValue',
    };
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props2, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual(props2);
  });
});

describe('Test Warning', () => {
  test('Injector throws Error', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [
        errorInjector,
      ],
    });
    const stack = new Stack(app, 'MyStack', {});
    const mock = jest.spyOn(Annotations.prototype, 'addWarningV2').mockImplementation();

    expect(() => {
      // WHEN
      const props: TestConstructProps = {
        prop1: 'veryBadValue',
      };

      applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props, {
        scope: stack,
        id: 'TestConstruct',
      });
    }).toThrow('prop1 has veryBadValue'); // THEN

    // WHEN
    const props2: TestConstructProps = {
      prop1: 'value1',
    };
    const newProps = applyInjectors(TestConstruct.PROPERTY_INJECTION_ID, props2, {
      scope: stack,
      id: 'TestConstruct',
    });

    // THEN
    expect(newProps).toEqual(props2);
  });
});

describe('Test findInjectorsFromConstruct', () => {
  test('Has Injectors in app', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [testInjector],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        dn2
      ],
    });

    // WHEN
    const injector = findInjectorFromConstruct(stack, TestConstruct.PROPERTY_INJECTION_ID);

    // THEN
    expect(injector?.constructUniqueId).toEqual(TestConstruct.PROPERTY_INJECTION_ID);
  });

  test('Has Injectors in stack', () => {
    // GIVEN
    const app = new App({
      propertyInjectors: [dn1],
    });
    const stack = new Stack(app, 'MyStack', {
      propertyInjectors: [
        dn2
      ],
    });

    // WHEN
    const injector = findInjectorFromConstruct(stack, TestConstruct2.PROPERTY_INJECTION_ID);

    // THEN
    expect(injector?.constructUniqueId).toEqual(TestConstruct2.PROPERTY_INJECTION_ID);
  });

  test('No Injectors', () => {
    // GIVEN
    const app = new App({});
    const stack = new Stack(app, 'MyStack', {});

    // WHEN
    const injector = findInjectorFromConstruct(stack, TestConstruct2.PROPERTY_INJECTION_ID);

    // THEN
    expect(injector).toBeUndefined();
  });
});
