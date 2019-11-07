import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { App, CfnResource, Construct, ITreeInspector, Stack } from '../../lib/index';

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
    class MyCfnResource extends CfnResource {
      constructor(scope: Construct, id: string) {
        super(scope, id, {
          type: 'CDK::UnitTest::MyCfnResource'
        });
      }

      public inspect(inspector: ITreeInspector) {
        inspector.addAttribute('aws:cdk:cloudformation:type', 'CDK::UnitTest::MyCfnResource');
        inspector.addAttribute('aws:cdk:cloudformation:props', this.cfnProperties);
      }

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
  }
};

function readJson(outdir: string, file: string) {
  return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}
