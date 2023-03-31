"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = void 0;
exports.resources = [
    {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: { name: 'hello-kubernetes' },
        spec: {
            type: 'LoadBalancer',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVsbG8tazhzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVsbG8tazhzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsU0FBUyxHQUFHO0lBQ3ZCO1FBQ0UsVUFBVSxFQUFFLElBQUk7UUFDaEIsSUFBSSxFQUFFLFNBQVM7UUFDZixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7UUFDdEMsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLGNBQWM7WUFDcEIsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUN2QyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7U0FDdEM7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLFNBQVM7UUFDckIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1FBQ3RDLElBQUksRUFBRTtZQUNKLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUU7WUFDdEQsUUFBUSxFQUFFO2dCQUNSLFFBQVEsRUFBRTtvQkFDUixNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7aUJBQ3BDO2dCQUNELElBQUksRUFBRTtvQkFDSixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsSUFBSSxFQUFFLGtCQUFrQjs0QkFDeEIsS0FBSyxFQUFFLGlDQUFpQzs0QkFDeEMsS0FBSyxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUM7eUJBQ2pDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCByZXNvdXJjZXMgPSBbXG4gIHtcbiAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgIGtpbmQ6ICdTZXJ2aWNlJyxcbiAgICBtZXRhZGF0YTogeyBuYW1lOiAnaGVsbG8ta3ViZXJuZXRlcycgfSxcbiAgICBzcGVjOiB7XG4gICAgICB0eXBlOiAnTG9hZEJhbGFuY2VyJyxcbiAgICAgIHBvcnRzOiBbeyBwb3J0OiA4MCwgdGFyZ2V0UG9ydDogODA4MCB9XSxcbiAgICAgIHNlbGVjdG9yOiB7IGFwcDogJ2hlbGxvLWt1YmVybmV0ZXMnIH0sXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGFwaVZlcnNpb246ICdhcHBzL3YxJyxcbiAgICBraW5kOiAnRGVwbG95bWVudCcsXG4gICAgbWV0YWRhdGE6IHsgbmFtZTogJ2hlbGxvLWt1YmVybmV0ZXMnIH0sXG4gICAgc3BlYzoge1xuICAgICAgcmVwbGljYXM6IDEsXG4gICAgICBzZWxlY3RvcjogeyBtYXRjaExhYmVsczogeyBhcHA6ICdoZWxsby1rdWJlcm5ldGVzJyB9IH0sXG4gICAgICB0ZW1wbGF0ZToge1xuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIGxhYmVsczogeyBhcHA6ICdoZWxsby1rdWJlcm5ldGVzJyB9LFxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgY29udGFpbmVyczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnaGVsbG8ta3ViZXJuZXRlcycsXG4gICAgICAgICAgICAgIGltYWdlOiAncGF1bGJvdXdlci9oZWxsby1rdWJlcm5ldGVzOjEuNScsXG4gICAgICAgICAgICAgIHBvcnRzOiBbeyBjb250YWluZXJQb3J0OiA4MDgwIH1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXTsiXX0=