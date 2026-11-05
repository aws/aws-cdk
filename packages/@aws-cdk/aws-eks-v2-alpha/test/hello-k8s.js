"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = void 0;
exports.resources = [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVsbG8tazhzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVsbG8tazhzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsU0FBUyxHQUFHO0lBQ3ZCO1FBQ0UsVUFBVSxFQUFFLElBQUk7UUFDaEIsSUFBSSxFQUFFLFNBQVM7UUFDZixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7UUFDdEMsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUN2QyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7U0FDdEM7S0FDRjtJQUNEO1FBQ0UsVUFBVSxFQUFFLFNBQVM7UUFDckIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1FBQ3RDLElBQUksRUFBRTtZQUNKLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUU7WUFDdEQsUUFBUSxFQUFFO2dCQUNSLFFBQVEsRUFBRTtvQkFDUixNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7aUJBQ3BDO2dCQUNELElBQUksRUFBRTtvQkFDSixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsSUFBSSxFQUFFLGtCQUFrQjs0QkFDeEIsS0FBSyxFQUFFLGlDQUFpQzs0QkFDeEMsS0FBSyxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUM7eUJBQ2pDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCByZXNvdXJjZXMgPSBbXG4gIHtcbiAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgIGtpbmQ6ICdTZXJ2aWNlJyxcbiAgICBtZXRhZGF0YTogeyBuYW1lOiAnaGVsbG8ta3ViZXJuZXRlcycgfSxcbiAgICBzcGVjOiB7XG4gICAgICBwb3J0czogW3sgcG9ydDogODAsIHRhcmdldFBvcnQ6IDgwODAgfV0sXG4gICAgICBzZWxlY3RvcjogeyBhcHA6ICdoZWxsby1rdWJlcm5ldGVzJyB9LFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBhcGlWZXJzaW9uOiAnYXBwcy92MScsXG4gICAga2luZDogJ0RlcGxveW1lbnQnLFxuICAgIG1ldGFkYXRhOiB7IG5hbWU6ICdoZWxsby1rdWJlcm5ldGVzJyB9LFxuICAgIHNwZWM6IHtcbiAgICAgIHJlcGxpY2FzOiAxLFxuICAgICAgc2VsZWN0b3I6IHsgbWF0Y2hMYWJlbHM6IHsgYXBwOiAnaGVsbG8ta3ViZXJuZXRlcycgfSB9LFxuICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBsYWJlbHM6IHsgYXBwOiAnaGVsbG8ta3ViZXJuZXRlcycgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIGNvbnRhaW5lcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ2hlbGxvLWt1YmVybmV0ZXMnLFxuICAgICAgICAgICAgICBpbWFnZTogJ3BhdWxib3V3ZXIvaGVsbG8ta3ViZXJuZXRlczoxLjUnLFxuICAgICAgICAgICAgICBwb3J0czogW3sgY29udGFpbmVyUG9ydDogODA4MCB9XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbl07XG4iXX0=