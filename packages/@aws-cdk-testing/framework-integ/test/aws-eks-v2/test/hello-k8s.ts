export const resources = [
  {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: { name: 'hello-kubernetes' },
    spec: {
      ports: [{ port: 80, targetPort: 8080 }],
      selector: { app: 'hello-kubernetes' },
    },
  },
  {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: { name: 'hello-kubernetes' },
    spec: {
      replicas: 1,
      selector: { matchLabels: { app: 'hello-kubernetes' } },
      template: {
        metadata: {
          labels: { app: 'hello-kubernetes' },
        },
        spec: {
          containers: [
            {
              name: 'hello-kubernetes',
              image: 'paulbouwer/hello-kubernetes:1.5',
              ports: [{ containerPort: 8080 }],
            },
          ],
        },
      },
    },
  },
];
