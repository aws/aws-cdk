import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { App, CfnParameter, CfnResource, Construct, Lazy, Stack, TreeInspector } from '../../lib/index';

abstract class AbstractCfnResource extends CfnResource {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      type: 'CDK::UnitTest::MyCfnResource'
    });
  }

  public inspect(inspector: TreeInspector) {
    inspector.addAttribute('aws:cdk:cloudformation:type', 'CDK::UnitTest::MyCfnResource');
    inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
  }

  protected abstract get cfnProperties(): { [key: string]: any };
}

export = {
  'tree metadata is generated as expected'(test: Test) {
    const app = new App();

    const stack = new Stack(app, 'mystack');
    new Construct(stack, 'myconstruct');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    test.ok(treeArtifact);

    test.deepEqual(readJson(assembly.directory, treeArtifact!.file), {
      version: 'tree-0.1',
      tree: {
        id: 'App',
        path: '',
        children: {
          Tree: {
            id: 'Tree',
            path: 'Tree'
          },
          mystack: {
            id: 'mystack',
            path: 'mystack',
            children: {
              myconstruct: {
                id: 'myconstruct',
                path: 'mystack/myconstruct'
              }
            }
          }
        }
      }
    });
    test.done();
  },

  'tree metadata for a Cfn resource'(test: Test) {
    class MyCfnResource extends AbstractCfnResource {
      protected get cfnProperties(): { [key: string]: any } {
        return {
          mystringpropkey: 'mystringpropval',
          mylistpropkey: ['listitem1'],
          mystructpropkey: {
            myboolpropkey: true,
            mynumpropkey: 50
          }
        };
      }
    }

    const app = new App();
    const stack = new Stack(app, 'mystack');
    new MyCfnResource(stack, 'mycfnresource');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    test.ok(treeArtifact);

    test.deepEqual(readJson(assembly.directory, treeArtifact!.file), {
      version: 'tree-0.1',
      tree: {
        id: 'App',
        path: '',
        children: {
          Tree: {
            id: 'Tree',
            path: 'Tree'
          },
          mystack: {
            id: 'mystack',
            path: 'mystack',
            children: {
              mycfnresource: {
                id: 'mycfnresource',
                path: 'mystack/mycfnresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    mystringpropkey: 'mystringpropval',
                    mylistpropkey: ['listitem1'],
                    mystructpropkey: {
                      myboolpropkey: true,
                      mynumpropkey: 50
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    test.done();
  },

  'token resolution & cfn parameter'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'mystack');
    const cfnparam = new CfnParameter(stack, 'mycfnparam');

    class MyCfnResource extends AbstractCfnResource {
      protected get cfnProperties(): { [key: string]: any } {
        return {
          lazykey: Lazy.stringValue({ produce: () => 'LazyResolved!' }),
          cfnparamkey: cfnparam
        };
      }
    }

    new MyCfnResource(stack, 'mycfnresource');

    const assembly = app.synth();
    const treeArtifact = assembly.tree();
    test.ok(treeArtifact);

    test.deepEqual(readJson(assembly.directory, treeArtifact!.file), {
      version: 'tree-0.1',
      tree: {
        id: 'App',
        path: '',
        children: {
          Tree: {
            id: 'Tree',
            path: 'Tree'
          },
          mystack: {
            id: 'mystack',
            path: 'mystack',
            children: {
              mycfnparam: {
                id: 'mycfnparam',
                path: 'mystack/mycfnparam'
              },
              mycfnresource: {
                id: 'mycfnresource',
                path: 'mystack/mycfnresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    lazykey: 'LazyResolved!',
                    cfnparamkey: { Ref: 'mycfnparam' }
                  }
                }
              }
            }
          }
        }
      }
    });
    test.done();
  },

  'cross-stack tokens'(test: Test) {
    class MyFirstResource extends AbstractCfnResource {
      public readonly lazykey: string;

      constructor(scope: Construct, id: string) {
        super(scope, id);
        this.lazykey = Lazy.stringValue({ produce: () => 'LazyResolved!' });
      }

      protected get cfnProperties(): { [key: string]: any } {
        return {
          lazykey: this.lazykey
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
          myprop: this.myprop
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
    test.ok(treeArtifact);

    test.deepEqual(readJson(assembly.directory, treeArtifact!.file), {
      version: 'tree-0.1',
      tree: {
        id: 'App',
        path: '',
        children: {
          Tree: {
            id: 'Tree',
            path: 'Tree'
          },
          myfirststack: {
            id: 'myfirststack',
            path: 'myfirststack',
            children: {
              myfirstresource: {
                id: 'myfirstresource',
                path: 'myfirststack/myfirstresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    lazykey: 'LazyResolved!'
                  }
                }
              }
            }
          },
          mysecondstack: {
            id: 'mysecondstack',
            path: 'mysecondstack',
            children: {
              mysecondresource: {
                id: 'mysecondresource',
                path: 'mysecondstack/mysecondresource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'CDK::UnitTest::MyCfnResource',
                  'aws:cdk:cloudformation:props': {
                    myprop: 'LazyResolved!'
                  }
                }
              }
            }
          }
        }
      }
    });

    test.done();
  }
};

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}
