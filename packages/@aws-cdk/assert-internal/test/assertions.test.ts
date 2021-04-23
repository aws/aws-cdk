import * as cdk from '@aws-cdk/core';
import * as cx from '@aws-cdk/cx-api';
import * as constructs from 'constructs';

import { countResources, countResourcesLike, exist, expect as cdkExpect, haveType, MatchStyle, matchTemplate } from '../lib/index';

passingExample('expect <synthStack> at <some path> to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  cdkExpect(synthStack).at('/TestResource').to(haveType(resourceType));
});
passingExample('expect non-synthesized stack at <some path> to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const stack = new cdk.Stack();
  new TestResource(stack, 'TestResource', { type: resourceType });
  cdkExpect(stack).at('/TestResource').to(haveType(resourceType));
});
passingExample('expect <synthStack> at <some path> *not* to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  cdkExpect(synthStack).at('/TestResource').notTo(haveType('Foo::Bar'));
});
passingExample('expect <synthStack> at <some path> to exist', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  cdkExpect(synthStack).at('/TestResource').to(exist());
});
passingExample('expect <synthStack> to match (exactly) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: resourceType },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.EXACT));
});
passingExample('expect <synthStack> to match (no replaces) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {};
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
passingExample('expect <synthStack> to be a superset of <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    // Added
    new TestResource(stack, 'NewResource', { type: 'AWS::S3::Bucket' });
    // Expected
    new TestResource(stack, 'TestResourceA', { type: resourceType });
    new TestResource(stack, 'TestResourceB', { type: resourceType, properties: { Foo: 'Bar' } });
  });
  const expected = {
    Resources: {
      TestResourceA: { Type: 'Test::Resource' },
      TestResourceB: { Type: 'Test::Resource', Properties: { Foo: 'Bar' } },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});
passingExample('sugar for matching stack to a template', () => {
  const stack = new cdk.Stack();
  new TestResource(stack, 'TestResource', { type: 'Test::Resource' });
  cdkExpect(stack).toMatch({
    Resources: {
      TestResource: {
        Type: 'Test::Resource',
      },
    },
  });
});
passingExample('expect <synthStack> to match (no replaces) <template> with parameters', () => {
  const parameterType = 'Test::Parameter';
  const synthStack = synthesizedStack(stack => {
    new TestParameter(stack, 'TestParameter', { type: parameterType });
  });
  const expected = {};
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
passingExample('expect <synthStack> to be a superset of <template> with parameters', () => {
  const parameterType = 'Test::Parameter';
  const synthStack = synthesizedStack(stack => {
    // Added
    new TestResource(stack, 'NewResource', { type: 'AWS::S3::Bucket' });
    // Expected
    new TestParameter(stack, 'TestParameterA', { type: parameterType });
    new TestParameter(stack, 'TestParameterB', { type: parameterType, default: { Foo: 'Bar' } });
  });
  const expected = {
    Parameters: {
      TestParameterA: { Type: 'Test::Parameter' },
      TestParameterB: { Type: 'Test::Parameter', Default: { Foo: 'Bar' } },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});

failingExample('expect <synthStack> at <some path> *not* to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  cdkExpect(synthStack).at('/TestResource').notTo(haveType(resourceType));
});
failingExample('expect <synthStack> at <some path> to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  cdkExpect(synthStack).at('/TestResource').to(haveType('Foo::Bar'));
});
failingExample('expect <synthStack> at <some path> to exist', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  cdkExpect(synthStack).at('/Foo/Bar').to(exist());
});
failingExample('expect <synthStack> to match (exactly) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: resourceType, DependsOn: ['Something'] },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.EXACT));
});
failingExample('expect <synthStack> to match (no replaces) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: 'AWS::S3::Bucket' },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
failingExample('expect <synthStack> to be a superset of <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    // Added
    new TestResource(stack, 'NewResource', { type: 'AWS::S3::Bucket' });
    // Expected
    new TestResource(stack, 'TestResourceA', { type: resourceType });
    // Expected, but has different properties - will break
    new TestResource(stack, 'TestResourceB', { type: resourceType, properties: { Foo: 'Bar' } });
  });
  const expected = {
    Resources: {
      TestResourceA: { Type: 'Test::Resource' },
      TestResourceB: { Type: 'Test::Resource', Properties: { Foo: 'Baz' } },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});
failingExample('expect <synthStack> to match (no replaces) <template> with parameters', () => {
  const parameterType = 'Test::Parameter';
  const synthStack = synthesizedStack(stack => {
    new TestParameter(stack, 'TestParameter', { type: parameterType });
  });
  const expected = {
    Parameters: {
      TestParameter: { Type: 'AWS::S3::Bucket' },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
failingExample('expect <synthStack> to be a superset of <template> with parameters', () => {
  const parameterType = 'Test::Parameter';
  const synthStack = synthesizedStack(stack => {
    // Added
    new TestParameter(stack, 'NewParameter', { type: 'AWS::S3::Bucket' });
    // Expected
    new TestParameter(stack, 'TestParameterA', { type: parameterType });
    // Expected, but has different properties - will break
    new TestParameter(stack, 'TestParameterB', { type: parameterType, default: { Foo: 'Bar' } });
  });
  const expected = {
    Parameters: {
      TestParameterA: { Type: 'Test::Parameter' },
      TestParameterB: { Type: 'Test::Parameter', Default: { Foo: 'Baz' } },
    },
  };
  cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});

// countResources

passingExample('expect <synthStack> to count resources - as expected', () => {
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: 'Bar' });
    new TestResource(stack, 'R2', { type: 'Bar' });
    new TestResource(stack, 'R3', { type: 'Foo' });
  });

  cdkExpect(synthStack).to(countResources('Bar', 2));
  cdkExpect(synthStack).to(countResources('Foo', 1));
});

passingExample('expect <stack> to count resources - expected no resources', () => {
  const resourceType = 'Test::Resource';
  const stack = new cdk.Stack();
  cdkExpect(stack).to(countResources(resourceType, 0));
});

failingExample('expect <synthStack> to count resources - more than expected', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType });
    new TestResource(stack, 'R2', { type: resourceType });
  });

  cdkExpect(synthStack).to(countResources(resourceType, 1));
});

failingExample('expect <synthStack> to count resources - less than expected', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType });
    new TestResource(stack, 'R2', { type: resourceType });
  });

  cdkExpect(synthStack).to(countResources(resourceType, 0));
});

// countResourcesLike

passingExample('expect <synthStack> to count resources like props - as expected', () => {
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: 'Bar', properties: { parentId: 123, name: 'A' } });
    new TestResource(stack, 'R2', { type: 'Bar', properties: { parentId: 123, name: 'B' } });
    new TestResource(stack, 'R3', { type: 'Foo', properties: { parentId: 123 } });
  });

  cdkExpect(synthStack).to(countResourcesLike('Bar', 2, { parentId: 123 }));
  cdkExpect(synthStack).to(countResourcesLike('Foo', 1, { parentId: 123 }));
});

passingExample('expect <stack> to count resources like props - expected no resources', () => {
  const resourceType = 'Test::Resource';
  const stack = new cdk.Stack();
  cdkExpect(stack).to(countResourcesLike(resourceType, 0, { parentId: 123 }));
});

passingExample('expect <stack> to count resources like props - expected no resources', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { parentId: 123, name: 'A' } });
    new TestResource(stack, 'R2', { type: resourceType });
    new TestResource(stack, 'R3', { type: 'Foo', properties: { parentId: 456 } });
  });
  cdkExpect(synthStack).to(countResourcesLike(resourceType, 0, { parentId: 456 }));
});

failingExample('expect <synthStack> to count resources like props - more than expected', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { parentId: 123 } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { parentId: 123 } });
  });

  cdkExpect(synthStack).to(countResourcesLike(resourceType, 1, { parentId: 123 }));
});

passingExample('expect <synthStack> to count resources like props - nested props out of order', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { id: 987, parentInfo: { id: 123, name: 'A' } } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { id: 456, parentInfo: { name: 'A', id: 123 } } });
  });

  cdkExpect(synthStack).to(countResourcesLike(resourceType, 2, { parentInfo: { id: 123, name: 'A' } }));
});

passingExample('expect <synthStack> to count resources like props - nested props incomplete', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { id: 987, parentInfo: { id: 123, name: 'A' } } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { id: 456, parentInfo: { name: 'A', id: 123 } } });
  });

  cdkExpect(synthStack).to(countResourcesLike(resourceType, 2, { parentInfo: { id: 123 } }));
});

failingExample('expect <synthStack> to count resources like props - less than expected', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { parentId: 123 } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { parentId: 123 } });
  });

  cdkExpect(synthStack).to(countResourcesLike(resourceType, 0, { parentId: 123 }));
});

function passingExample(title: string, cb: () => void) {
  describe('passing', () => {
    test(title, cb);
  });
}

function failingExample(title: string, cb: () => void) {
  describe('failing', () => {
    test(title, () => expect(cb).toThrowError());
  });
}

function synthesizedStack(fn: (stack: cdk.Stack) => void): cx.CloudFormationStackArtifact {
  const app = new cdk.App({ context: { [cx.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
  const stack = new cdk.Stack(app, 'TestStack');
  fn(stack);

  const assembly = app.synth();
  return assembly.getStackArtifact(stack.artifactId);
}

interface TestResourceProps extends cdk.CfnResourceProps {
  type: string;
}

class TestResource extends cdk.CfnResource {
  constructor(scope: constructs.Construct, id: string, props: TestResourceProps) {
    super(scope, id, props);
  }
}

interface TestParameterProps extends cdk.CfnParameterProps {
  type: string;
}

class TestParameter extends cdk.CfnParameter {
  constructor(scope: constructs.Construct, id: string, props: TestParameterProps) {
    super(scope, id, props);
  }
}
