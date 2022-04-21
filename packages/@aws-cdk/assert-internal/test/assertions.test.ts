import * as cdk from '@aws-cdk/core';
import * as cx from '@aws-cdk/cx-api';
import * as constructs from 'constructs';

import { countResources, countResourcesLike, exist, expect as cdkExpect, haveType, MatchStyle, matchTemplate } from '../lib/index';

passingExample('expect <synthStack> at <some path> to have <some type>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  await cdkExpect(synthStack).at('/TestResource').to(haveType(resourceType));
});
passingExample('expect non-synthesized stack at <some path> to have <some type>', async () => {
  const resourceType = 'Test::Resource';
  const stack = new cdk.Stack();
  new TestResource(stack, 'TestResource', { type: resourceType });
  await cdkExpect(stack).at('/TestResource').to(haveType(resourceType));
});
passingExample('expect <synthStack> at <some path> *not* to have <some type>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  await cdkExpect(synthStack).at('/TestResource').notTo(haveType('Foo::Bar'));
});
passingExample('expect <synthStack> at <some path> to exist', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  await cdkExpect(synthStack).at('/TestResource').to(exist());
});
passingExample('expect <synthStack> to match (exactly) <template>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: resourceType },
    },
  };
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.EXACT));
});
passingExample('expect <synthStack> to match (no replaces) <template>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {};
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
passingExample('expect <synthStack> to be a superset of <template>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
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
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});
passingExample('sugar for matching stack to a template', async () => {
  const stack = new cdk.Stack();
  new TestResource(stack, 'TestResource', { type: 'Test::Resource' });
  await cdkExpect(stack).toMatch({
    Resources: {
      TestResource: {
        Type: 'Test::Resource',
      },
    },
  });
});
passingExample('expect <synthStack> to match (no replaces) <template> with parameters', async () => {
  const parameterType = 'Test::Parameter';
  const synthStack = await synthesizedStack(stack => {
    new TestParameter(stack, 'TestParameter', { type: parameterType });
  });
  const expected = {};
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
passingExample('expect <synthStack> to be a superset of <template> with parameters', async () => {
  const parameterType = 'Test::Parameter';
  const synthStack = await synthesizedStack(stack => {
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
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});

failingExample('expect <synthStack> at <some path> *not* to have <some type>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  await cdkExpect(synthStack).at('/TestResource').notTo(haveType(resourceType));
});
failingExample('expect <synthStack> at <some path> to have <some type>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  await cdkExpect(synthStack).at('/TestResource').to(haveType('Foo::Bar'));
});
failingExample('expect <synthStack> at <some path> to exist', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  await cdkExpect(synthStack).at('/Foo/Bar').to(exist());
});
failingExample('expect <synthStack> to match (exactly) <template>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: resourceType, DependsOn: ['Something'] },
    },
  };
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.EXACT));
});
failingExample('expect <synthStack> to match (no replaces) <template>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: 'AWS::S3::Bucket' },
    },
  };
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
failingExample('expect <synthStack> to be a superset of <template>', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
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
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});
failingExample('expect <synthStack> to match (no replaces) <template> with parameters', async () => {
  const parameterType = 'Test::Parameter';
  const synthStack = await synthesizedStack(stack => {
    new TestParameter(stack, 'TestParameter', { type: parameterType });
  });
  const expected = {
    Parameters: {
      TestParameter: { Type: 'AWS::S3::Bucket' },
    },
  };
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
failingExample('expect <synthStack> to be a superset of <template> with parameters', async () => {
  const parameterType = 'Test::Parameter';
  const synthStack = await synthesizedStack(stack => {
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
  await cdkExpect(synthStack).to(matchTemplate(expected, MatchStyle.SUPERSET));
});

// countResources

passingExample('expect <synthStack> to count resources - as expected', async () => {
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: 'Bar' });
    new TestResource(stack, 'R2', { type: 'Bar' });
    new TestResource(stack, 'R3', { type: 'Foo' });
  });

  await cdkExpect(synthStack).to(countResources('Bar', 2));
  await cdkExpect(synthStack).to(countResources('Foo', 1));
});

passingExample('expect <stack> to count resources - expected no resources', async () => {
  const resourceType = 'Test::Resource';
  const stack = new cdk.Stack();
  await cdkExpect(stack).to(countResources(resourceType, 0));
});

failingExample('expect <synthStack> to count resources - more than expected', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType });
    new TestResource(stack, 'R2', { type: resourceType });
  });

  await cdkExpect(synthStack).to(countResources(resourceType, 1));
});

failingExample('expect <synthStack> to count resources - less than expected', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType });
    new TestResource(stack, 'R2', { type: resourceType });
  });

  await cdkExpect(synthStack).to(countResources(resourceType, 0));
});

// countResourcesLike

passingExample('expect <synthStack> to count resources like props - as expected', async () => {
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: 'Bar', properties: { parentId: 123, name: 'A' } });
    new TestResource(stack, 'R2', { type: 'Bar', properties: { parentId: 123, name: 'B' } });
    new TestResource(stack, 'R3', { type: 'Foo', properties: { parentId: 123 } });
  });

  await cdkExpect(synthStack).to(countResourcesLike('Bar', 2, { parentId: 123 }));
  await cdkExpect(synthStack).to(countResourcesLike('Foo', 1, { parentId: 123 }));
});

passingExample('expect <stack> to count resources like props - expected no resources', async () => {
  const resourceType = 'Test::Resource';
  const stack = new cdk.Stack();
  await cdkExpect(stack).to(countResourcesLike(resourceType, 0, { parentId: 123 }));
});

passingExample('expect <stack> to count resources like props - expected no resources', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { parentId: 123, name: 'A' } });
    new TestResource(stack, 'R2', { type: resourceType });
    new TestResource(stack, 'R3', { type: 'Foo', properties: { parentId: 456 } });
  });
  await cdkExpect(synthStack).to(countResourcesLike(resourceType, 0, { parentId: 456 }));
});

failingExample('expect <synthStack> to count resources like props - more than expected', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { parentId: 123 } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { parentId: 123 } });
  });

  await cdkExpect(synthStack).to(countResourcesLike(resourceType, 1, { parentId: 123 }));
});

passingExample('expect <synthStack> to count resources like props - nested props out of order', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { id: 987, parentInfo: { id: 123, name: 'A' } } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { id: 456, parentInfo: { name: 'A', id: 123 } } });
  });

  await cdkExpect(synthStack).to(countResourcesLike(resourceType, 2, { parentInfo: { id: 123, name: 'A' } }));
});

passingExample('expect <synthStack> to count resources like props - nested props incomplete', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { id: 987, parentInfo: { id: 123, name: 'A' } } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { id: 456, parentInfo: { name: 'A', id: 123 } } });
  });

  await cdkExpect(synthStack).to(countResourcesLike(resourceType, 2, { parentInfo: { id: 123 } }));
});

failingExample('expect <synthStack> to count resources like props - less than expected', async () => {
  const resourceType = 'Test::Resource';
  const synthStack = await synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType, properties: { parentId: 123 } });
    new TestResource(stack, 'R2', { type: resourceType, properties: { parentId: 123 } });
  });

  await cdkExpect(synthStack).to(countResourcesLike(resourceType, 0, { parentId: 123 }));
});

function passingExample(title: string, cb: () => void) {
  describe('passing', () => {
    test(title, cb);
  });
}

function failingExample(title: string, cb: () => Promise<void>) {
  describe('failing', () => {
    test(title, async () => {
      await expect(cb).rejects.toThrowError();
    });
  });
}

async function synthesizedStack(fn: (stack: cdk.Stack) => void): Promise<cx.CloudFormationStackArtifact> {
  const app = new cdk.App({ context: { [cx.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
  const stack = new cdk.Stack(app, 'TestStack');
  fn(stack);

  const assembly = await app.synth();
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
