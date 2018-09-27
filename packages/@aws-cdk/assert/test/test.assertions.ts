import 'source-map-support/register';

import cdk = require('@aws-cdk/cdk');
import cx = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';

import { Stack } from '@aws-cdk/cdk';
import { countResources, exist, expect, haveType, MatchStyle, matchTemplate } from '../lib/index';

passingExample('expect <stack> at <some path> to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  expect(synthStack).at('/TestResource').to(haveType(resourceType));
});
passingExample('expect <stack> at <some path> *not* to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  expect(synthStack).at('/TestResource').notTo(haveType('Foo::Bar'));
});
passingExample('expect <stack> at <some path> to exist', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  expect(synthStack).at('/TestResource').to(exist());
});
passingExample('expect <stack> to match (exactly) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: resourceType }
    }
  };
  expect(synthStack).to(matchTemplate(expected, MatchStyle.EXACT));
});
passingExample('expect <stack> to match (no replaces) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {};
  expect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});
passingExample('sugar for matching stack to a template', () => {
  const stack = new Stack();
  new TestResource(stack, 'TestResource', { type: 'Test::Resource' });
  expect(stack).toMatch({
    Resources: {
      TestResource: {
        Type: 'Test::Resource'
      }
    }
  });
});

failingExample('expect <stack> at <some path> *not* to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  expect(synthStack).at('/TestResource').notTo(haveType(resourceType));
});
failingExample('expect <stack> at <some path> to have <some type>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  expect(synthStack).at('/TestResource').to(haveType('Foo::Bar'));
});
failingExample('expect <stack> at <some path> to exist', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  expect(synthStack).at('/Foo/Bar').to(exist());
});
failingExample('expect <stack> to match (exactly) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: resourceType, DependsOn: ['Something'] }
    }
  };
  expect(synthStack).to(matchTemplate(expected, MatchStyle.EXACT));
});
failingExample('expect <stack> to match (no replaces) <template>', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'TestResource', { type: resourceType });
  });
  const expected = {
    Resources: {
      TestResource: { Type: 'AWS::S3::Bucket' }
    }
  };
  expect(synthStack).to(matchTemplate(expected, MatchStyle.NO_REPLACES));
});

// countResources

passingExample('expect <stack> to count resources - as expected', () => {
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: 'Bar' });
    new TestResource(stack, 'R2', { type: 'Bar' });
    new TestResource(stack, 'R3', { type: 'Foo' });
  });

  expect(synthStack).to(countResources('Bar', 2));
  expect(synthStack).to(countResources('Foo', 1));
});

passingExample('expect <stack> to count resources - expected no resources', () => {
  const resourceType = 'Test::Resource';
  const stack = new Stack();
  expect(stack).to(countResources(resourceType, 0));
});

failingExample('expect <stack> to count resources - more than expected', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType });
    new TestResource(stack, 'R2', { type: resourceType });
  });

  expect(synthStack).to(countResources(resourceType, 1));
});

failingExample('expect <stack> to count resources - less than expected', () => {
  const resourceType = 'Test::Resource';
  const synthStack = synthesizedStack(stack => {
    new TestResource(stack, 'R1', { type: resourceType });
    new TestResource(stack, 'R2', { type: resourceType });
  });

  expect(synthStack).to(countResources(resourceType, 0));
});

function passingExample(title: string, cb: (test: Test) => void) {
  if (!exports.passing) { exports.passing = {}; }
  exports.passing[title] = (test: Test) => {
    cb(test);
    test.done();
  };
}

function failingExample(title: string, cb: (test: Test) => void) {
  if (!exports.failing) { exports.failing = {}; }
  exports.failing[title] = (test: Test) => {
    test.throws(() => {
      cb(test);
    });
    test.done();
  };
}

function synthesizedStack(fn: (stack: cdk.Stack) => void): cx.SynthesizedStack {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');
  fn(stack);
  return app.synthesizeStack(stack.name);
}

interface TestResourceProps extends cdk.ResourceProps {
  type: string;
}

class TestResource extends cdk.Resource {
  constructor(parent: cdk.Construct, name: string, props: TestResourceProps) {
    super(parent, name, props);
  }
}
