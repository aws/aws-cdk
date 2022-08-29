"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotInterruptHandler = exports.LifecycleLabel = void 0;
var LifecycleLabel;
(function (LifecycleLabel) {
    LifecycleLabel["ON_DEMAND"] = "OnDemand";
    LifecycleLabel["SPOT"] = "Ec2Spot";
})(LifecycleLabel = exports.LifecycleLabel || (exports.LifecycleLabel = {}));
const DEFAULT_NODE_SELECTOR = { lifecycle: LifecycleLabel.SPOT };
function spotInterruptHandler(nodeSelector = DEFAULT_NODE_SELECTOR) {
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
exports.spotInterruptHandler = spotInterruptHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BvdC1pbnRlcnJ1cHQtaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNwb3QtaW50ZXJydXB0LWhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBWSxjQUdYO0FBSEQsV0FBWSxjQUFjO0lBQ3hCLHdDQUFzQixDQUFBO0lBQ3RCLGtDQUFnQixDQUFBO0FBQ2xCLENBQUMsRUFIVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUd6QjtBQUVELE1BQU0scUJBQXFCLEdBQUcsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRWpFLFNBQWdCLG9CQUFvQixDQUFDLGVBQTJDLHFCQUFxQjtJQUNuRyxPQUFPO1FBQ0w7WUFDRSxJQUFJLEVBQUUsYUFBYTtZQUNuQixVQUFVLEVBQUUsOEJBQThCO1lBQzFDLFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsMEJBQTBCO2dCQUNoQyxTQUFTLEVBQUUsU0FBUzthQUNyQjtZQUNELEtBQUssRUFBRTtnQkFDTDtvQkFDRSxTQUFTLEVBQUU7d0JBQ1QsTUFBTTtxQkFDUDtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsWUFBWTtxQkFDYjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsS0FBSzt3QkFDTCxRQUFRO3FCQUNUO2lCQUNGO2dCQUNEO29CQUNFLFNBQVMsRUFBRTt3QkFDVCxFQUFFO3FCQUNIO29CQUNELFNBQVMsRUFBRTt3QkFDVCxHQUFHO3FCQUNKO29CQUNELEtBQUssRUFBRTt3QkFDTCxHQUFHO3FCQUNKO2lCQUNGO2dCQUNEO29CQUNFLFNBQVMsRUFBRTt3QkFDVCwyQkFBMkI7cUJBQzVCO29CQUNELFNBQVMsRUFBRTt3QkFDVCxHQUFHO3FCQUNKO29CQUNELEtBQUssRUFBRTt3QkFDTCxHQUFHO3FCQUNKO2lCQUNGO2dCQUNEO29CQUNFLFNBQVMsRUFBRTt3QkFDVCxzQkFBc0I7cUJBQ3ZCO29CQUNELFNBQVMsRUFBRTt3QkFDVCwyQkFBMkI7cUJBQzVCO29CQUNELEtBQUssRUFBRTt3QkFDTCxLQUFLO3dCQUNMLE1BQU07d0JBQ04sT0FBTzt3QkFDUCxRQUFRO3dCQUNSLFFBQVE7cUJBQ1Q7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxVQUFVLEVBQUUsSUFBSTtZQUNoQixJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsMEJBQTBCO2FBQ2pDO1NBQ0Y7UUFDRDtZQUNFLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsVUFBVSxFQUFFLDhCQUE4QjtZQUMxQyxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLDBCQUEwQjtnQkFDaEMsU0FBUyxFQUFFLFNBQVM7YUFDckI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1I7b0JBQ0UsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsSUFBSSxFQUFFLDBCQUEwQjtvQkFDaEMsU0FBUyxFQUFFLFNBQVM7aUJBQ3JCO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLElBQUksRUFBRSwwQkFBMEI7Z0JBQ2hDLFFBQVEsRUFBRSwyQkFBMkI7YUFDdEM7U0FDRjtRQUNEO1lBQ0UsVUFBVSxFQUFFLGNBQWM7WUFDMUIsSUFBSSxFQUFFLFdBQVc7WUFDakIsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSwwQkFBMEI7Z0JBQ2hDLFNBQVMsRUFBRSxTQUFTO2FBQ3JCO1lBQ0QsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRTtvQkFDUixXQUFXLEVBQUU7d0JBQ1gsR0FBRyxFQUFFLDBCQUEwQjtxQkFDaEM7aUJBQ0Y7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLFFBQVEsRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ04sR0FBRyxFQUFFLDBCQUEwQjt5QkFDaEM7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLGtCQUFrQixFQUFFLDBCQUEwQjt3QkFDOUMsVUFBVSxFQUFFOzRCQUNWO2dDQUNFLElBQUksRUFBRSwwQkFBMEI7Z0NBQ2hDLEtBQUssRUFBRSw0Q0FBNEM7Z0NBQ25ELGVBQWUsRUFBRSxRQUFRO2dDQUN6QixHQUFHLEVBQUU7b0NBQ0g7d0NBQ0UsSUFBSSxFQUFFLFdBQVc7d0NBQ2pCLFNBQVMsRUFBRTs0Q0FDVCxRQUFRLEVBQUU7Z0RBQ1IsU0FBUyxFQUFFLGVBQWU7NkNBQzNCO3lDQUNGO3FDQUNGO29DQUNEO3dDQUNFLElBQUksRUFBRSxVQUFVO3dDQUNoQixTQUFTLEVBQUU7NENBQ1QsUUFBUSxFQUFFO2dEQUNSLFNBQVMsRUFBRSxlQUFlOzZDQUMzQjt5Q0FDRjtxQ0FDRjtvQ0FDRDt3Q0FDRSxJQUFJLEVBQUUsV0FBVzt3Q0FDakIsU0FBUyxFQUFFOzRDQUNULFFBQVEsRUFBRTtnREFDUixTQUFTLEVBQUUsb0JBQW9COzZDQUNoQzt5Q0FDRjtxQ0FDRjtvQ0FDRDt3Q0FDRSxJQUFJLEVBQUUsYUFBYTt3Q0FDbkIsU0FBUyxFQUFFOzRDQUNULFFBQVEsRUFBRTtnREFDUixTQUFTLEVBQUUsY0FBYzs2Q0FDMUI7eUNBQ0Y7cUNBQ0Y7aUNBQ0Y7Z0NBQ0QsU0FBUyxFQUFFO29DQUNULFFBQVEsRUFBRTt3Q0FDUixNQUFNLEVBQUUsTUFBTTt3Q0FDZCxHQUFHLEVBQUUsS0FBSztxQ0FDWDtvQ0FDRCxNQUFNLEVBQUU7d0NBQ04sTUFBTSxFQUFFLE9BQU87d0NBQ2YsR0FBRyxFQUFFLE1BQU07cUNBQ1o7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7d0JBQ0QsWUFBWTtxQkFDYjtpQkFDRjthQUNGO1NBQ0Y7S0FFRixDQUFDO0FBQ0osQ0FBQztBQXZLRCxvREF1S0MiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBMaWZlY3ljbGVMYWJlbCB7XG4gIE9OX0RFTUFORCA9ICdPbkRlbWFuZCcsXG4gIFNQT1QgPSAnRWMyU3BvdCcsXG59XG5cbmNvbnN0IERFRkFVTFRfTk9ERV9TRUxFQ1RPUiA9IHsgbGlmZWN5Y2xlOiBMaWZlY3ljbGVMYWJlbC5TUE9UIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBzcG90SW50ZXJydXB0SGFuZGxlcihub2RlU2VsZWN0b3I6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0gREVGQVVMVF9OT0RFX1NFTEVDVE9SKSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAga2luZDogJ0NsdXN0ZXJSb2xlJyxcbiAgICAgIGFwaVZlcnNpb246ICdyYmFjLmF1dGhvcml6YXRpb24uazhzLmlvL3YxJyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6ICdub2RlLXRlcm1pbmF0aW9uLWhhbmRsZXInLFxuICAgICAgICBuYW1lc3BhY2U6ICdkZWZhdWx0JyxcbiAgICAgIH0sXG4gICAgICBydWxlczogW1xuICAgICAgICB7XG4gICAgICAgICAgYXBpR3JvdXBzOiBbXG4gICAgICAgICAgICAnYXBwcycsXG4gICAgICAgICAgXSxcbiAgICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICAgICdkYWVtb25zZXRzJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHZlcmJzOiBbXG4gICAgICAgICAgICAnZ2V0JyxcbiAgICAgICAgICAgICdkZWxldGUnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhcGlHcm91cHM6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAnKicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICB2ZXJiczogW1xuICAgICAgICAgICAgJyonLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBhcGlHcm91cHM6IFtcbiAgICAgICAgICAgICdyYmFjLmF1dGhvcml6YXRpb24uazhzLmlvJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgICAgJyonLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgdmVyYnM6IFtcbiAgICAgICAgICAgICcqJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgYXBpR3JvdXBzOiBbXG4gICAgICAgICAgICAnYXBpZXh0ZW5zaW9ucy5rOHMuaW8nLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAnY3VzdG9tcmVzb3VyY2VkZWZpbml0aW9ucycsXG4gICAgICAgICAgXSxcbiAgICAgICAgICB2ZXJiczogW1xuICAgICAgICAgICAgJ2dldCcsXG4gICAgICAgICAgICAnbGlzdCcsXG4gICAgICAgICAgICAnd2F0Y2gnLFxuICAgICAgICAgICAgJ2NyZWF0ZScsXG4gICAgICAgICAgICAnZGVsZXRlJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICBraW5kOiAnU2VydmljZUFjY291bnQnLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgbmFtZTogJ25vZGUtdGVybWluYXRpb24taGFuZGxlcicsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAga2luZDogJ0NsdXN0ZXJSb2xlQmluZGluZycsXG4gICAgICBhcGlWZXJzaW9uOiAncmJhYy5hdXRob3JpemF0aW9uLms4cy5pby92MScsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lOiAnbm9kZS10ZXJtaW5hdGlvbi1oYW5kbGVyJyxcbiAgICAgICAgbmFtZXNwYWNlOiAnZGVmYXVsdCcsXG4gICAgICB9LFxuICAgICAgc3ViamVjdHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGtpbmQ6ICdTZXJ2aWNlQWNjb3VudCcsXG4gICAgICAgICAgbmFtZTogJ25vZGUtdGVybWluYXRpb24taGFuZGxlcicsXG4gICAgICAgICAgbmFtZXNwYWNlOiAnZGVmYXVsdCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgcm9sZVJlZjoge1xuICAgICAgICBraW5kOiAnQ2x1c3RlclJvbGUnLFxuICAgICAgICBuYW1lOiAnbm9kZS10ZXJtaW5hdGlvbi1oYW5kbGVyJyxcbiAgICAgICAgYXBpR3JvdXA6ICdyYmFjLmF1dGhvcml6YXRpb24uazhzLmlvJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBhcGlWZXJzaW9uOiAnYXBwcy92MWJldGEyJyxcbiAgICAgIGtpbmQ6ICdEYWVtb25TZXQnLFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgbmFtZTogJ25vZGUtdGVybWluYXRpb24taGFuZGxlcicsXG4gICAgICAgIG5hbWVzcGFjZTogJ2RlZmF1bHQnLFxuICAgICAgfSxcbiAgICAgIHNwZWM6IHtcbiAgICAgICAgc2VsZWN0b3I6IHtcbiAgICAgICAgICBtYXRjaExhYmVsczoge1xuICAgICAgICAgICAgYXBwOiAnbm9kZS10ZXJtaW5hdGlvbi1oYW5kbGVyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgICAgYXBwOiAnbm9kZS10ZXJtaW5hdGlvbi1oYW5kbGVyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBzZXJ2aWNlQWNjb3VudE5hbWU6ICdub2RlLXRlcm1pbmF0aW9uLWhhbmRsZXInLFxuICAgICAgICAgICAgY29udGFpbmVyczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ25vZGUtdGVybWluYXRpb24taGFuZGxlcicsXG4gICAgICAgICAgICAgICAgaW1hZ2U6ICdhbWF6b24vYXdzLW5vZGUtdGVybWluYXRpb24taGFuZGxlcjp2MS4wLjAnLFxuICAgICAgICAgICAgICAgIGltYWdlUHVsbFBvbGljeTogJ0Fsd2F5cycsXG4gICAgICAgICAgICAgICAgZW52OiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdOT0RFX05BTUUnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWVsZFJlZjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRQYXRoOiAnc3BlYy5ub2RlTmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdQT0RfTkFNRScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICAgICAgIGZpZWxkUmVmOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFBhdGg6ICdtZXRhZGF0YS5uYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ05BTUVTUEFDRScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICAgICAgIGZpZWxkUmVmOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFBhdGg6ICdtZXRhZGF0YS5uYW1lc3BhY2UnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU1BPVF9QT0RfSVAnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWVsZFJlZjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRQYXRoOiAnc3RhdHVzLnBvZElQJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczoge1xuICAgICAgICAgICAgICAgICAgcmVxdWVzdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5OiAnNjRNaScsXG4gICAgICAgICAgICAgICAgICAgIGNwdTogJzUwbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGltaXRzOiB7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeTogJzEyOE1pJyxcbiAgICAgICAgICAgICAgICAgICAgY3B1OiAnMTAwbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbm9kZVNlbGVjdG9yLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgXTtcbn0iXX0=