"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
let stack;
let td;
const image = ecs.ContainerImage.fromRegistry('test-image');
describe('gelf log driver', () => {
    beforeEach(() => {
        stack = new cdk.Stack();
        td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
    });
    test('create a gelf log driver with minimum options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.GelfLogDriver({
                address: 'my-gelf-address',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'gelf',
                        Options: {
                            'gelf-address': 'my-gelf-address',
                        },
                    },
                }),
            ],
        });
    });
    test('create a gelf log driver using gelf with minimum options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.gelf({
                address: 'my-gelf-address',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'gelf',
                        Options: {
                            'gelf-address': 'my-gelf-address',
                        },
                    },
                }),
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VsZi1sb2ctZHJpdmVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZWxmLWxvZy1kcml2ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLEVBQXNCLENBQUM7QUFDM0IsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFNUQsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hCLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUcxRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsT0FBTztRQUNQLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFO1lBQzNCLEtBQUs7WUFDTCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDO2dCQUM3QixPQUFPLEVBQUUsaUJBQWlCO2FBQzNCLENBQUM7WUFDRixjQUFjLEVBQUUsR0FBRztTQUNwQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7WUFDMUUsb0JBQW9CLEVBQUU7Z0JBQ3BCLGtCQUFLLENBQUMsVUFBVSxDQUFDO29CQUNmLGdCQUFnQixFQUFFO3dCQUNoQixTQUFTLEVBQUUsTUFBTTt3QkFDakIsT0FBTyxFQUFFOzRCQUNQLGNBQWMsRUFBRSxpQkFBaUI7eUJBQ2xDO3FCQUNGO2lCQUNGLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtRQUNwRSxPQUFPO1FBQ1AsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDM0IsS0FBSztZQUNMLE9BQU8sRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDM0IsT0FBTyxFQUFFLGlCQUFpQjthQUMzQixDQUFDO1lBQ0YsY0FBYyxFQUFFLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLG9CQUFvQixFQUFFO2dCQUNwQixrQkFBSyxDQUFDLFVBQVUsQ0FBQztvQkFDZixnQkFBZ0IsRUFBRTt3QkFDaEIsU0FBUyxFQUFFLE1BQU07d0JBQ2pCLE9BQU8sRUFBRTs0QkFDUCxjQUFjLEVBQUUsaUJBQWlCO3lCQUNsQztxQkFDRjtpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vbGliJztcblxubGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5sZXQgdGQ6IGVjcy5UYXNrRGVmaW5pdGlvbjtcbmNvbnN0IGltYWdlID0gZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdC1pbWFnZScpO1xuXG5kZXNjcmliZSgnZ2VsZiBsb2cgZHJpdmVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICB0ZCA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmaW5pdGlvbicpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgZ2VsZiBsb2cgZHJpdmVyIHdpdGggbWluaW11bSBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0ZC5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlLFxuICAgICAgbG9nZ2luZzogbmV3IGVjcy5HZWxmTG9nRHJpdmVyKHtcbiAgICAgICAgYWRkcmVzczogJ215LWdlbGYtYWRkcmVzcycsXG4gICAgICB9KSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMjgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2dlbGYnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnZ2VsZi1hZGRyZXNzJzogJ215LWdlbGYtYWRkcmVzcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgZ2VsZiBsb2cgZHJpdmVyIHVzaW5nIGdlbGYgd2l0aCBtaW5pbXVtIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBlY3MuTG9nRHJpdmVycy5nZWxmKHtcbiAgICAgICAgYWRkcmVzczogJ215LWdlbGYtYWRkcmVzcycsXG4gICAgICB9KSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMjgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2dlbGYnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnZ2VsZi1hZGRyZXNzJzogJ215LWdlbGYtYWRkcmVzcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==