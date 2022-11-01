import * as path from 'path';
import { ConstructTreeNode, loadTreeFromDir, some } from '../lib/tree';

describe('some', () => {
  const tree: ConstructTreeNode = {
    id: 'App',
    path: '',
    children: {
      Tree: {
        id: 'Tree',
        path: 'Tree',
        constructInfo: {
          fqn: '@aws-cdk/core.Construct',
          version: '1.162.0',
        },
      },
      stack: {
        id: 'stack',
        path: 'stack',
        children: {
          bucket: {
            id: 'bucket',
            path: 'stack/bucket',
            children: {
              Resource: {
                id: 'Resource',
                path: 'stack/bucket/Resource',
                attributes: {
                  'aws:cdk:cloudformation:type': 'AWS::S3::Bucket',
                  'aws:cdk:cloudformation:props': {},
                },
                constructInfo: {
                  fqn: '@aws-cdk/aws-s3.CfnBucket',
                  version: '1.162.0',
                },
              },
            },
            constructInfo: {
              fqn: '@aws-cdk/aws-s3.Bucket',
              version: '1.162.0',
            },
          },
          CDKMetadata: {
            id: 'CDKMetadata',
            path: 'stack/CDKMetadata',
            children: {
              Default: {
                id: 'Default',
                path: 'stack/CDKMetadata/Default',
                constructInfo: {
                  fqn: '@aws-cdk/core.CfnResource',
                  version: '1.162.0',
                },
              },
              Condition: {
                id: 'Condition',
                path: 'stack/CDKMetadata/Condition',
                constructInfo: {
                  fqn: '@aws-cdk/core.CfnCondition',
                  version: '1.162.0',
                },
              },
            },
            constructInfo: {
              fqn: '@aws-cdk/core.Construct',
              version: '1.162.0',
            },
          },
        },
        constructInfo: {
          fqn: '@aws-cdk/core.Stack',
          version: '1.162.0',
        },
      },
    },
    constructInfo: {
      fqn: '@aws-cdk/core.App',
      version: '1.162.0',
    },
  };

  test('tree matches predicate', () => {
    expect(some(tree, node => node.constructInfo?.fqn === '@aws-cdk/aws-s3.Bucket')).toBe(true);
  });

  test('tree does not match predicate', () => {
    expect(some(tree, node => node.constructInfo?.fqn === '@aws-cdk/aws-lambda.Function')).toBe(false);
  });

  test('childless tree', () => {
    const childless = {
      id: 'App',
      path: '',
      constructInfo: {
        fqn: '@aws-cdk/core.App',
        version: '1.162.0',
      },
    };

    expect(some(childless, node => node.path.length > 0)).toBe(false);
  });
});

describe('loadTreeFromDir', () => {
  test('can find tree', () => {
    const tree = loadTreeFromDir(path.join(__dirname, 'cloud-assembly-trees/built-with-1_144_0'));
    expect(tree.id).toEqual('App');
  });

  test('cannot find tree', () => {
    const tree = loadTreeFromDir(path.join(__dirname, 'cloud-assembly-trees/foo'));
    expect(tree).toEqual({});
  });
});