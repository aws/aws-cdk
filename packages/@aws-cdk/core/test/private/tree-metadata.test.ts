import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Construct } from 'constructs';
import { App, CfnParameter, CfnResource, Lazy, Stack, TreeInspector } from '../../lib/index';

abstract class AbstractCfnResource extends CfnResource {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      type: 'CDK::UnitTest::MyCfnResource',
    });
  }

  public inspect(inspector: TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', 'CDK::UnitTest::MyCfnResource');
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected abstract override get cfnProperties(): { [key: string]: any };
}

describe('tree metadata', () => {
  test('tree metadata is generated as expected', () => {
    const app = new App();

    const stack = new Stack(app, 'mystack');
    new Construct(stack, 'myconstruct');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    expect(treeArtifact).toBeDefined();

    expect(readJson(assembly.directory, treeArtifact!.file)).toEqual({
      version: 'tree-0.1',
      tree: expect.objectContaining({
        id: 'App',
        path: '',
        children: {
          Tree: expect.objectContaining({
            id: 'Tree',
            path: 'Tree',
          }),
          mystack: expect.objectContaining({
            id: 'mystack',
            path: 'mystack',
            children: {
              BootstrapVersion: {
                constructInfo: {
                  fqn: '@aws-cdk/core.CfnParameter',
                  version: expect.any(String),
                },
                id: 'BootstrapVersion',
                path: 'mystack/BootstrapVersion',
              },
              CheckBootstrapVersion: {
                constructInfo: {
                  fqn: '@aws-cdk/core.CfnRule',
                  version: expect.any(String),
                },
                id: 'CheckBootstrapVersion',
                path: 'mystack/CheckBootstrapVersion',
              },
              myconstruct: expect.objectContaining({
                id: 'myconstruct',
                path: 'mystack/myconstruct',
              }),
            },
          }),
        },
      }),
    });
  });

  test('tree metadata for a Cfn resource', () => {
    class MyCfnResource extends AbstractCfnResource {
      protected get cfnProperties(): { [key: string]: any } {
        return {
          mystringpropkey: 'mystringpropval',
          mylistpropkey: ['listitem1'],
          mystructpropkey: {
            myboolpropkey: true,
            mynumpropkey: 50,
          },
        };
      }
    }

    const app = new App();
    const stack = new Stack(app, 'mystack');
    new MyCfnResource(stack, 'mycfnresource');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    expect(treeArtifact).toBeDefined();

    expect(readJson(assembly.directory, treeArtifact!.file)).toEqual({
      version: 'tree-0.1',
      tree: expect.objectContaining({
        id: 'App',
        path: '',
        children: {
          Tree: expect.objectContaining({
            id: 'Tree',
            path: 'Tree',
          }),
          mystack: expect.objectContaining({
            id: 'mystack',
            path: 'mystack',
            children: expect.objectContaining({
              mycfnresource: expect.objectContaining({
                id: 'mycfnresource',
                path: 'mystack/mycfnresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    mystringpropkey: 'mystringpropval',
                    mylistpropkey: ['listitem1'],
                    mystructpropkey: {
                      myboolpropkey: true,
                      mynumpropkey: 50,
                    },
                  },
                },
              }),
            }),
          }),
        },
      }),
    });

  });

  test('tree metadata has construct class & version in there', () => {
    // The runtime metadata this test relies on is only available if the most
    // recent compile has happened using 'jsii', as the jsii compiler injects
    // this metadata.
    //
    // If the most recent compile was using 'tsc', the metadata will not have
    // been injected, and the test will fail.
    //
    // People may choose to run `tsc` directly (instead of `yarn build` for
    // example) to escape the additional TSC compilation time that is necessary
    // to run 'eslint', or the additional time that 'jsii' needs to analyze the
    // type system), this test is allowed to fail if we're not running on CI.
    //
    // If the compile of this library has been done using `tsc`, the runtime
    // information will always find `constructs.Construct` as the construct
    // identifier, since `constructs` will have had a release build done using `jsii`.
    //
    // If this test is running on CodeBuild, we will require that the more specific
    // class names are found. If this test is NOT running on CodeBuild, we will
    // allow the specific class name (for a 'jsii' build) or the generic
    // 'constructs.Construct' class name (for a 'tsc' build).
    const app = new App();

    const stack = new Stack(app, 'mystack');
    new CfnResource(stack, 'myconstruct', { type: 'Aws::Some::Resource' });

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    expect(treeArtifact).toBeDefined();

    const codeBuild = !!process.env.CODEBUILD_BUILD_ID;

    expect(readJson(assembly.directory, treeArtifact!.file)).toEqual({
      version: 'tree-0.1',
      tree: expect.objectContaining({
        children: expect.objectContaining({
          mystack: expect.objectContaining({
            constructInfo: {
              fqn: expect.stringMatching(codeBuild ? /\bStack$/ : /\bStack$|^constructs.Construct$/),
              version: expect.any(String),
            },
            children: expect.objectContaining({
              myconstruct: expect.objectContaining({
                constructInfo: {
                  fqn: expect.stringMatching(codeBuild ? /\bCfnResource$/ : /\bCfnResource$|^constructs.Construct$/),
                  version: expect.any(String),
                },
              }),
            }),
          }),
        }),
      }),
    });


  });

  test('token resolution & cfn parameter', () => {
    const app = new App();
    const stack = new Stack(app, 'mystack');
    const cfnparam = new CfnParameter(stack, 'mycfnparam');

    class MyCfnResource extends AbstractCfnResource {
      protected get cfnProperties(): { [key: string]: any } {
        return {
          lazykey: Lazy.string({ produce: () => 'LazyResolved!' }),
          cfnparamkey: cfnparam,
        };
      }
    }

    new MyCfnResource(stack, 'mycfnresource');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    expect(treeArtifact).toBeDefined();

    expect(readJson(assembly.directory, treeArtifact!.file)).toEqual({
      version: 'tree-0.1',
      tree: expect.objectContaining({
        id: 'App',
        path: '',
        children: {
          Tree: expect.objectContaining({
            id: 'Tree',
            path: 'Tree',
          }),
          mystack: expect.objectContaining({
            id: 'mystack',
            path: 'mystack',
            children: expect.objectContaining({
              mycfnparam: expect.objectContaining({
                id: 'mycfnparam',
                path: 'mystack/mycfnparam',
              }),
              mycfnresource: expect.objectContaining({
                id: 'mycfnresource',
                path: 'mystack/mycfnresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    lazykey: 'LazyResolved!',
                    cfnparamkey: { Ref: 'mycfnparam' },
                  },
                },
              }),
            }),
          }),
        },
      }),
    });

  });

  test('cross-stack tokens', () => {
    class MyFirstResource extends AbstractCfnResource {
      public readonly lazykey: string;

      constructor(scope: Construct, id: string) {
        super(scope, id);
        this.lazykey = Lazy.string({ produce: () => 'LazyResolved!' });
      }

      protected get cfnProperties(): { [key: string]: any } {
        return {
          lazykey: this.lazykey,
        };
      }
    }

    class MySecondResource extends AbstractCfnResource {
      public readonly myprop: string;

      constructor(scope: Construct, id: string, myprop: string) {
        super(scope, id);
        this.myprop = myprop;
      }

      protected get cfnProperties(): { [key: string]: any } {
        return {
          myprop: this.myprop,
        };
      }
    }

    const app = new App();
    const firststack = new Stack(app, 'myfirststack');
    const firstres = new MyFirstResource(firststack, 'myfirstresource');
    const secondstack = new Stack(app, 'mysecondstack');
    new MySecondResource(secondstack, 'mysecondresource', firstres.lazykey);

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    expect(treeArtifact).toBeDefined();

    expect(readJson(assembly.directory, treeArtifact!.file)).toEqual({
      version: 'tree-0.1',
      tree: expect.objectContaining({
        id: 'App',
        path: '',
        children: {
          Tree: expect.objectContaining({
            id: 'Tree',
            path: 'Tree',
          }),
          myfirststack: expect.objectContaining({
            id: 'myfirststack',
            path: 'myfirststack',
            children: expect.objectContaining({
              myfirstresource: expect.objectContaining({
                id: 'myfirstresource',
                path: 'myfirststack/myfirstresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    lazykey: 'LazyResolved!',
                  },
                },
              }),
            }),
          }),
          mysecondstack: expect.objectContaining({
            id: 'mysecondstack',
            path: 'mysecondstack',
            children: expect.objectContaining({
              mysecondresource: expect.objectContaining({
                id: 'mysecondresource',
                path: 'mysecondstack/mysecondresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    myprop: 'LazyResolved!',
                  },
                },
              }),
            }),
          }),
        },
      }),
    });
  });

  test('tree metadata can be disabled', () => {
    // GIVEN
    const app = new App({
      treeMetadata: false,
    });

    // WHEN
    const stack = new Stack(app, 'mystack');
    new Construct(stack, 'myconstruct');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();

    // THEN
    expect(treeArtifact).not.toBeDefined();
  });

  test('failing nodes', () => {
    class MyCfnResource extends CfnResource {
      public inspect(_: TreeInspector) {
        throw new Error('Forcing an inspect error');
      }
    }

    const app = new App();
    const stack = new Stack(app, 'mystack');
    new MyCfnResource(stack, 'mycfnresource', {
      type: 'CDK::UnitTest::MyCfnResource',
    });

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    expect(treeArtifact).toBeDefined();

    const treenode = app.node.findChild('Tree');

    const warn = treenode.node.metadata.find((md) => {
      return md.type === cxschema.ArtifactMetadataEntryType.WARN
        && /Forcing an inspect error/.test(md.data as string)
        && /mycfnresource/.test(md.data as string);
    });
    expect(warn).toBeDefined();

    // assert that the rest of the construct tree is rendered
    expect(readJson(assembly.directory, treeArtifact!.file)).toEqual({
      version: 'tree-0.1',
      tree: expect.objectContaining({
        id: 'App',
        path: '',
        children: {
          Tree: expect.objectContaining({
            id: 'Tree',
            path: 'Tree',
          }),
          mystack: expect.objectContaining({
            id: 'mystack',
            path: 'mystack',
          }),
        },
      }),
    });


  });
});

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}
