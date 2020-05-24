export enum LifecycleLabel {
  ON_DEMAND = 'OnDemand',
  SPOT = 'Ec2Spot',
}

const DEFAULT_NODE_SELECTOR = { lifecycle: LifecycleLabel.SPOT };

export function spotInterruptHandler(nodeSelector: { [name: string]: string } = DEFAULT_NODE_SELECTOR) {
  return [
    {
      kind: 'ClusterRole',
      apiVersion: 'rbac.authorization.k8s.io/v1',
      metadata: {
        name: 'node-termination-handler',
        namespace: 'default',
      },
      rules: [
        {
          apiGroups: [
            'apps',
          ],
          resources: [
            'daemonsets',
          ],
          verbs: [
            'get',
            'delete',
          ],
        },
        {
          apiGroups: [
            '',
          ],
          resources: [
            '*',
          ],
          verbs: [
            '*',
          ],
        },
        {
          apiGroups: [
            'rbac.authorization.k8s.io',
          ],
          resources: [
            '*',
          ],
          verbs: [
            '*',
          ],
        },
        {
          apiGroups: [
            'apiextensions.k8s.io',
          ],
          resources: [
            'customresourcedefinitions',
          ],
          verbs: [
            'get',
            'list',
            'watch',
            'create',
            'delete',
          ],
        },
      ],
    },
    {
      apiVersion: 'v1',
      kind: 'ServiceAccount',
      metadata: {
        name: 'node-termination-handler',
      },
    },
    {
      kind: 'ClusterRoleBinding',
      apiVersion: 'rbac.authorization.k8s.io/v1',
      metadata: {
        name: 'node-termination-handler',
        namespace: 'default',
      },
      subjects: [
        {
          kind: 'ServiceAccount',
          name: 'node-termination-handler',
          namespace: 'default',
        },
      ],
      roleRef: {
        kind: 'ClusterRole',
        name: 'node-termination-handler',
        apiGroup: 'rbac.authorization.k8s.io',
      },
    },
    {
      apiVersion: 'apps/v1beta2',
      kind: 'DaemonSet',
      metadata: {
        name: 'node-termination-handler',
        namespace: 'default',
      },
      spec: {
        selector: {
          matchLabels: {
            app: 'node-termination-handler',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'node-termination-handler',
            },
          },
          spec: {
            serviceAccountName: 'node-termination-handler',
            containers: [
              {
                name: 'node-termination-handler',
                image: 'amazon/aws-node-termination-handler:v1.0.0',
                imagePullPolicy: 'Always',
                env: [
                  {
                    name: 'NODE_NAME',
                    valueFrom: {
                      fieldRef: {
                        fieldPath: 'spec.nodeName',
                      },
                    },
                  },
                  {
                    name: 'POD_NAME',
                    valueFrom: {
                      fieldRef: {
                        fieldPath: 'metadata.name',
                      },
                    },
                  },
                  {
                    name: 'NAMESPACE',
                    valueFrom: {
                      fieldRef: {
                        fieldPath: 'metadata.namespace',
                      },
                    },
                  },
                  {
                    name: 'SPOT_POD_IP',
                    valueFrom: {
                      fieldRef: {
                        fieldPath: 'status.podIP',
                      },
                    },
                  },
                ],
                resources: {
                  requests: {
                    memory: '64Mi',
                    cpu: '50m',
                  },
                  limits: {
                    memory: '128Mi',
                    cpu: '100m',
                  },
                },
              },
            ],
            nodeSelector,
          },
        },
      },
    },

  ];
}