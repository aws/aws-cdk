import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';

import * as appmesh from '../lib';

export = {
  'When creating a Mesh': {
    'with no spec applied': {
      'should defaults to DROP_ALL egress filter'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new appmesh.Mesh(stack, 'mesh', { meshName: 'test-mesh' });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::Mesh', {
            Spec: {
            },
          }),
        );

        test.done();
      },
    },

    'with spec applied': {
      'should take egress filter from props'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
          egressFilter: appmesh.MeshFilterType.ALLOW_ALL,
        });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::Mesh', {
            Spec: {
              EgressFilter: {
                Type: 'ALLOW_ALL',
              },
            },
          }),
        );

        test.done();
      },
    },
  },

  'When adding a Virtual Router to existing mesh': {
    'with at least one complete port mappings': {
      'should create proper router'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualRouter('router');

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::VirtualRouter', {
            Spec: {
              Listeners: [
                {
                  PortMapping: {
                    Port: 8080,
                    Protocol: 'http',
                  },
                },
              ],
            },
          }),
        );

        test.done();
      },
    },
  },

  'VirtualService can use CloudMap service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });
    const vpc = new ec2.Vpc(stack, 'vpc');
    const namespace = new cloudmap.PrivateDnsNamespace(stack, 'test-namespace', {
      vpc,
      name: 'domain.local',
    });
    const service = namespace.createService('Svc');

    // WHEN
    new appmesh.VirtualNode(stack, 'test-node', {
      mesh,
      serviceDiscovery: appmesh.ServiceDiscovery.cloudMap({
        service: service,
      }),
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::AppMesh::VirtualNode', {
      Spec: {
        ServiceDiscovery: {
          AWSCloudMap: {
            NamespaceName: 'domain.local',
            ServiceName: { 'Fn::GetAtt': ['testnamespaceSvcB55702EC', 'Name'] },
          },
        },
      },
    }));

    test.done();
  },

  'When adding a VirtualNode to a mesh': {
    'with empty default listeners and backends': {
      'should create default resource'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
        });

        // THEN
        expect(stack).to(
          haveResource('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              // Specifically: no Listeners and Backends
              ServiceDiscovery: {
                DNS: {
                  Hostname: 'test.domain.local',
                },
              },
            },
          }),
        );

        test.done();
      },
    },
    'with added listeners': {
      'should create listener resource'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
          })],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              Listeners: [
                {
                  PortMapping: {
                    Port: 8080,
                    Protocol: 'http',
                  },
                },
              ],
            },
          }),
        );

        test.done();
      },
    },
    'with added listeners with healthchecks': {
      'should create healthcheck resource'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
            healthCheck: {
              healthyThreshold: 3,
              path: '/',
              interval: cdk.Duration.seconds(5), // min
              timeout: cdk.Duration.seconds(2), // min
              unhealthyThreshold: 2,
            },
          })],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            MeshName: {
              'Fn::GetAtt': ['meshACDFE68E', 'MeshName'],
            },
            Spec: {
              Listeners: [
                {
                  HealthCheck: {
                    HealthyThreshold: 3,
                    IntervalMillis: 5000,
                    Path: '/',
                    Port: 8080,
                    Protocol: 'http',
                    TimeoutMillis: 2000,
                    UnhealthyThreshold: 2,
                  },
                },
              ],
            },
          }),
        );

        test.done();
      },
    },
    'with backends': {
      'should create resource with service backends'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        const mesh = new appmesh.Mesh(stack, 'mesh', {
          meshName: 'test-mesh',
        });

        const service1 = new appmesh.VirtualService(stack, 'service-1', {
          virtualServiceName: 'service1.domain.local',
          virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh),
        });

        mesh.addVirtualNode('test-node', {
          serviceDiscovery: appmesh.ServiceDiscovery.dns('test.domain.local'),
          listeners: [appmesh.VirtualNodeListener.http({
            port: 8080,
          })],
          backends: [appmesh.Backend.virtualService(service1)],
        });

        // THEN
        expect(stack).to(
          haveResourceLike('AWS::AppMesh::VirtualNode', {
            Spec: {
              Backends: [
                {
                  VirtualService: {
                    VirtualServiceName: {
                      'Fn::GetAtt': ['service1A48078CF', 'VirtualServiceName'],
                    },
                  },
                },
              ],
            },
          }),
        );

        test.done();
      },
    },
  },
  'Can construct a mesh from a name'(test: Test) {
    // WHEN
    const stack2 = new cdk.Stack();
    const mesh2 = appmesh.Mesh.fromMeshName(stack2, 'imported-mesh', 'abc');

    new appmesh.VirtualService(stack2, 'service', {
      virtualServiceName: 'test.domain.local',
      virtualServiceProvider: appmesh.VirtualServiceProvider.none(mesh2),
    });

    // THEN
    expect(stack2).to(
      haveResourceLike('AWS::AppMesh::VirtualService', {
        MeshName: 'abc',
        Spec: {},
        VirtualServiceName: 'test.domain.local',
      }),
    );

    test.done();
  },
  'Can grant an identity all read permissions for a given mesh'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    // WHEN
    const user = new iam.User(stack, 'test');
    mesh.grantRead(user);

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'appmesh:DescribeMesh',
              'appmesh:ListMeshes',
              'appmesh:DescribeVirtualService',
              'appmesh:ListVirtualServices',
              'appmesh:DescribeVirtualRouter',
              'appmesh:ListVirtualRouter',
              'appmesh:DescribeRoute',
              'appmesh:ListRoutes',
              'appmesh:DescribeVirtualNode',
              'appmesh:ListVirtualNodes',
              'appmesh:DescribeVirtualGateway',
              'appmesh:ListVirtualGateways',
              'appmesh:DescribeGatewayRoute',
              'appmesh:ListGatewayRoutes',
            ],
            Effect: 'Allow',
            Resource: [
              {
                Ref: 'meshACDFE68E',
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualNode/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualRouter/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualRouter/*/route/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualGateway/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualGateway/*/gatewayRoute/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualService/*',
                ]],
              },
            ],
          },
        ],
      },
    }));

    test.done();
  },
  'Can grant an identity all write permissions for a given mesh'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const mesh = new appmesh.Mesh(stack, 'mesh', {
      meshName: 'test-mesh',
    });

    // WHEN
    const user = new iam.User(stack, 'test');
    mesh.grantWrite(user);

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'appmesh:CreateMesh',
              'appmesh:UpdateMesh',
              'appmesh:DeleteMesh',
              'appmesh:CreateVirtualNode',
              'appmesh:UpdateVirtualNode',
              'appmesh:DeleteVirtualNode',
              'appmesh:CreateVirtualRouter',
              'appmesh:UpdateVirtualRouter',
              'appmesh:DeleteVirtualRouter',
              'appmesh:CreateRoute',
              'appmesh:UpdateRoute',
              'appmesh:DeleteRoute',
              'appmesh:CreateVirtualGateway',
              'appmesh:UpdateVirtualGateway',
              'appmesh:DeleteVirtualGateway',
              'appmesh:CreateGatewayRoute',
              'appmesh:UpdateGatewayRoute',
              'appmesh:DeleteGatewayRoute',
              'appmesh:CreateVirtualService',
              'appmesh:UpdateVirtualService',
              'appmesh:DeleteVirtualService',
              'appmesh:TagResource',
              'appmesh:UntagResource',
            ],
            Effect: 'Allow',
            Resource: [
              {
                Ref: 'meshACDFE68E',
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualNode/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualRouter/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualRouter/*/route/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualGateway/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualGateway/*/gatewayRoute/*',
                ]],
              },
              {
                'Fn::Join': ['', [
                  { Ref: 'meshACDFE68E' },
                  '/virtualService/*',
                ]],
              },
            ],
          },
        ],
      },
    }));

    test.done();
  },
};
