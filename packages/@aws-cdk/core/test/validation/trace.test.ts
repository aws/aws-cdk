import { Construct } from 'constructs';
import * as core from '../../lib';
import { ConstructTree } from '../../lib/validation/private/construct-tree';
import { ReportTrace } from '../../lib/validation/private/trace';

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => { return true; });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ReportTrace', () => {
  test('trace includes location when CDK_DEBUG=true', () => {
    // GIVEN
    try {
      process.env.CDK_DEBUG = 'true';
      const app = new core.App({
        treeMetadata: true,
      });
      const stack = new MyStack(app, 'MyStack');
      app.synth();
      const tree = new ConstructTree(app);

      // WHEN
      const trace = new ReportTrace(tree);
      const formatted = trace.formatJson(stack.constructPath);

      // THEN
      expect(formatted).toEqual({
        id: 'MyStack',
        construct: expect.stringMatching(/.*Stack/),
        libraryVersion: expect.any(String),
        location: expect.stringMatching(/Object.<anonymous> \(.*\/trace.test.ts:[0-9]+:[0-9]+\)/),
        path: 'MyStack',
        child: {
          id: 'MyConstruct',
          construct: 'constructs.Construct',
          libraryVersion: expect.any(String),
          location: expect.stringMatching(/new MyStack \(.*\/trace.test.ts:[0-9]+:[0-9]+\)/),
          path: 'MyStack/MyConstruct',
        },
      });
    } finally {
      process.env.CDK_DEBUG = '';
    }
  });

  test('trace does not include location when CDK_DEBUG=false', () => {
    // GIVEN
    const app = new core.App({
      treeMetadata: true,
    });
    const stack = new MyStack(app, 'MyStack');
    app.synth();
    const tree = new ConstructTree(app);

    // WHEN
    const trace = new ReportTrace(tree);
    const formatted = trace.formatJson(stack.constructPath);

    // THEN
    expect(formatted).toEqual({
      id: 'MyStack',
      construct: expect.stringMatching(/.*Stack/),
      libraryVersion: expect.any(String),
      location: "Run with '--debug' to include location info",
      path: 'MyStack',
      child: {
        id: 'MyConstruct',
        construct: 'constructs.Construct',
        libraryVersion: expect.any(String),
        location: "Run with '--debug' to include location info",
        path: 'MyStack/MyConstruct',
      },
    });
  });
});

class MyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new core.CfnResource(this, 'Resource', {
      type: 'AWS::CDK::TestResource',
      properties: {
        testProp1: 'testValue',
      },
    });
  }
}

class MyStack extends core.Stack {
  public readonly constructPath: string;
  constructor(scope: Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
    const myConstruct = new MyConstruct(this, 'MyConstruct');
    this.constructPath = myConstruct.node.path;
  }
}
