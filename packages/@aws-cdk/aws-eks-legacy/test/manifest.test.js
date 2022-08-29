"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const lib_1 = require("../lib");
const util_1 = require("./util");
/* eslint-disable max-len */
cdk_build_tools_1.describeDeprecated('manifest', () => {
    test('basic usage', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'cluster');
        const manifest = [
            {
                apiVersion: 'v1',
                kind: 'Service',
                metadata: {
                    name: 'hello-kubernetes',
                },
                spec: {
                    type: 'LoadBalancer',
                    ports: [
                        { port: 80, targetPort: 8080 },
                    ],
                    selector: {
                        app: 'hello-kubernetes',
                    },
                },
            },
            {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {
                    name: 'hello-kubernetes',
                },
                spec: {
                    replicas: 2,
                    selector: {
                        matchLabels: {
                            app: 'hello-kubernetes',
                        },
                    },
                    template: {
                        metadata: {
                            labels: {
                                app: 'hello-kubernetes',
                            },
                        },
                        spec: {
                            containers: [
                                {
                                    name: 'hello-kubernetes',
                                    image: 'paulbouwer/hello-kubernetes:1.5',
                                    ports: [
                                        { containerPort: 8080 },
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        ];
        // WHEN
        new lib_1.KubernetesResource(stack, 'manifest', {
            cluster,
            manifest,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesResource.RESOURCE_TYPE, {
            Manifest: JSON.stringify(manifest),
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuaWZlc3QudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hbmlmZXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOERBQThEO0FBQzlELGdDQUFxRDtBQUNyRCxpQ0FBMEM7QUFFMUMsNEJBQTRCO0FBRTVCLG9DQUFrQixDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDdkIsUUFBUTtRQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyx1QkFBZ0IsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLElBQUksYUFBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUU5QyxNQUFNLFFBQVEsR0FBRztZQUNmO2dCQUNFLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixJQUFJLEVBQUUsU0FBUztnQkFDZixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLGtCQUFrQjtpQkFDekI7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxjQUFjO29CQUNwQixLQUFLLEVBQUU7d0JBQ0wsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7cUJBQy9CO29CQUNELFFBQVEsRUFBRTt3QkFDUixHQUFHLEVBQUUsa0JBQWtCO3FCQUN4QjtpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLElBQUksRUFBRSxZQUFZO2dCQUNsQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLGtCQUFrQjtpQkFDekI7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLFFBQVEsRUFBRSxDQUFDO29CQUNYLFFBQVEsRUFBRTt3QkFDUixXQUFXLEVBQUU7NEJBQ1gsR0FBRyxFQUFFLGtCQUFrQjt5QkFDeEI7cUJBQ0Y7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLFFBQVEsRUFBRTs0QkFDUixNQUFNLEVBQUU7Z0NBQ04sR0FBRyxFQUFFLGtCQUFrQjs2QkFDeEI7eUJBQ0Y7d0JBQ0QsSUFBSSxFQUFFOzRCQUNKLFVBQVUsRUFBRTtnQ0FDVjtvQ0FDRSxJQUFJLEVBQUUsa0JBQWtCO29DQUN4QixLQUFLLEVBQUUsaUNBQWlDO29DQUN4QyxLQUFLLEVBQUU7d0NBQ0wsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFO3FDQUN4QjtpQ0FDRjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUVGLE9BQU87UUFDUCxJQUFJLHdCQUFrQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDeEMsT0FBTztZQUNQLFFBQVE7U0FDVCxDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBa0IsQ0FBQyxhQUFhLEVBQUU7WUFDaEYsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1NBQ25DLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgZGVzY3JpYmVEZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IENsdXN0ZXIsIEt1YmVybmV0ZXNSZXNvdXJjZSB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyB0ZXN0Rml4dHVyZU5vVnBjIH0gZnJvbSAnLi91dGlsJztcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5kZXNjcmliZURlcHJlY2F0ZWQoJ21hbmlmZXN0JywgKCkgPT4ge1xuICB0ZXN0KCdiYXNpYyB1c2FnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJyk7XG5cbiAgICBjb25zdCBtYW5pZmVzdCA9IFtcbiAgICAgIHtcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ1NlcnZpY2UnLFxuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIHR5cGU6ICdMb2FkQmFsYW5jZXInLFxuICAgICAgICAgIHBvcnRzOiBbXG4gICAgICAgICAgICB7IHBvcnQ6IDgwLCB0YXJnZXRQb3J0OiA4MDgwIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBzZWxlY3Rvcjoge1xuICAgICAgICAgICAgYXBwOiAnaGVsbG8ta3ViZXJuZXRlcycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGFwaVZlcnNpb246ICdhcHBzL3YxJyxcbiAgICAgICAga2luZDogJ0RlcGxveW1lbnQnLFxuICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgIG5hbWU6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIHJlcGxpY2FzOiAyLFxuICAgICAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgICAgICBtYXRjaExhYmVsczoge1xuICAgICAgICAgICAgICBhcHA6ICdoZWxsby1rdWJlcm5ldGVzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgICAgICAgYXBwOiAnaGVsbG8ta3ViZXJuZXRlcycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgICBjb250YWluZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ2hlbGxvLWt1YmVybmV0ZXMnLFxuICAgICAgICAgICAgICAgICAgaW1hZ2U6ICdwYXVsYm91d2VyL2hlbGxvLWt1YmVybmV0ZXM6MS41JyxcbiAgICAgICAgICAgICAgICAgIHBvcnRzOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgY29udGFpbmVyUG9ydDogODA4MCB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBLdWJlcm5ldGVzUmVzb3VyY2Uoc3RhY2ssICdtYW5pZmVzdCcsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtYW5pZmVzdCxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEt1YmVybmV0ZXNSZXNvdXJjZS5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDogSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLFxuICAgIH0pO1xuXG4gIH0pO1xufSk7XG4iXX0=