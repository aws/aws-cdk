export enum LifecycleLabel {
  ON_DEMAND = 'OnDemand',
  SPOT = 'Ec2Spot',
}

const DEFAULT_NODE_SELECTOR = { lifecycle: LifecycleLabel.SPOT };

export function spotInterruptHandler(nodeSelector: { [name: string]: string } = DEFAULT_NODE_SELECTOR) {
  return [
    {
      kind: "ClusterRole",
      apiVersion: "rbac.authorization.k8s.io/v1",
      metadata: {
        name: "spot-interrupt-handler",
        namespace: "default"
      },
      rules: [
        { apiGroups: [ "" ], resources: [ "*" ], verbs: [ "*" ] },
        { apiGroups: [ "rbac.authorization.k8s.io" ], resources: [ "*" ], verbs: [ "*" ] },
        { apiGroups: [ "apiextensions.k8s.io" ], resources: [ "customresourcedefinitions" ], verbs: [ "get", "list", "watch", "create", "delete" ] }
      ]
    },
    {
      apiVersion: "v1",
      kind: "ServiceAccount",
      metadata: {
        name: "spot-interrupt-handler"
      }
    },
    {
      kind: "ClusterRoleBinding",
      apiVersion: "rbac.authorization.k8s.io/v1",
      metadata: {
        name: "spot-interrupt-handler",
        namespace: "default"
      },
      subjects: [ { kind: "ServiceAccount", name: "spot-interrupt-handler", namespace: "default" } ],
      roleRef: { kind: "ClusterRole", name: "spot-interrupt-handler", apiGroup: "rbac.authorization.k8s.io" }
    },
    {
      apiVersion: "apps/v1beta2",
      kind: "DaemonSet",
      metadata: {
        name: "spot-interrupt-handler",
        namespace: "default"
      },
      spec: {
        selector: {
          matchLabels: { app: "spot-interrupt-handler" }
        },
        template: {
          metadata: {
            labels: { app: "spot-interrupt-handler" }
          },
          spec: {
            serviceAccountName: "spot-interrupt-handler",
            containers: [
              {
                name: "spot-interrupt-handler",
                image: "madhuriperi/samplek8spotinterrupt:latest",
                imagePullPolicy: "Always",
                env: [
                  { name: "POD_NAME", valueFrom: { fieldRef: { fieldPath: "metadata.name" } } },
                  { name: "NAMESPACE", valueFrom: { fieldRef: { fieldPath: "metadata.namespace" } } },
                  { name: "SPOT_POD_IP", valueFrom: { fieldRef: { fieldPath: "status.podIP" } } }
                ]
              }
            ],
            nodeSelector
          }
        }
      }
    }
  ];
}