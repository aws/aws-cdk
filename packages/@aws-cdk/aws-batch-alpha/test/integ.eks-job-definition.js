"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ecs_1 = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const batch = require("../lib");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'stack');
new batch.EksJobDefinition(stack, 'EksJobDefn', {
    container: new batch.EksContainerDefinition(stack, 'EksContainer', {
        image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        args: ['foo'],
        command: ['echo foo'],
        env: { foo: 'bar' },
        cpuLimit: 8,
        cpuReservation: 4,
        memoryLimit: aws_cdk_lib_1.Size.mebibytes(8192),
        memoryReservation: aws_cdk_lib_1.Size.mebibytes(8192),
        gpuLimit: 12,
        gpuReservation: 12,
        imagePullPolicy: batch.ImagePullPolicy.ALWAYS,
        name: 'myBigCoolVolume',
        privileged: true,
        readonlyRootFilesystem: false,
        runAsGroup: 1,
        runAsRoot: false,
        runAsUser: 20,
        volumes: [
            batch.EksVolume.emptyDir({
                name: 'woah',
                mountPath: '/mount/path',
                medium: batch.EmptyDirMediumType.MEMORY,
                readonly: true,
                sizeLimit: aws_cdk_lib_1.Size.mebibytes(2048),
            }),
            batch.EksVolume.secret({
                name: 'secretVolumeName',
                secretName: 'secretName',
                mountPath: '/secret/path',
                optional: false,
            }),
            batch.EksVolume.secret({
                name: 'defaultOptionalSettingSecretVolume',
                secretName: 'NewSecretName',
                mountPath: '/secret/path2',
            }),
            batch.EksVolume.hostPath({
                name: 'hostPath',
                hostPath: '/foo/bar',
                mountPath: '/fooasdfadfs',
            }),
        ],
    }),
});
new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWpvYi1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWtzLWpvYi1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQXFEO0FBQ3JELDZDQUErQztBQUMvQyxvREFBb0Q7QUFDcEQsZ0NBQWdDO0FBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFdEMsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUM5QyxTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtRQUNqRSxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7UUFDOUQsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2IsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO1FBQ3JCLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7UUFDbkIsUUFBUSxFQUFFLENBQUM7UUFDWCxjQUFjLEVBQUUsQ0FBQztRQUNqQixXQUFXLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2pDLGlCQUFpQixFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUN2QyxRQUFRLEVBQUUsRUFBRTtRQUNaLGNBQWMsRUFBRSxFQUFFO1FBQ2xCLGVBQWUsRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU07UUFDN0MsSUFBSSxFQUFFLGlCQUFpQjtRQUN2QixVQUFVLEVBQUUsSUFBSTtRQUNoQixzQkFBc0IsRUFBRSxLQUFLO1FBQzdCLFVBQVUsRUFBRSxDQUFDO1FBQ2IsU0FBUyxFQUFFLEtBQUs7UUFDaEIsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUU7WUFDUCxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDdkIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLE1BQU0sRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTTtnQkFDdkMsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsU0FBUyxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzthQUNoQyxDQUFDO1lBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxrQkFBa0I7Z0JBQ3hCLFVBQVUsRUFBRSxZQUFZO2dCQUN4QixTQUFTLEVBQUUsY0FBYztnQkFDekIsUUFBUSxFQUFFLEtBQUs7YUFDaEIsQ0FBQztZQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO2dCQUNyQixJQUFJLEVBQUUsb0NBQW9DO2dCQUMxQyxVQUFVLEVBQUUsZUFBZTtnQkFDM0IsU0FBUyxFQUFFLGVBQWU7YUFDM0IsQ0FBQztZQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUN2QixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFNBQVMsRUFBRSxjQUFjO2FBQzFCLENBQUM7U0FDSDtLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixFQUFFO0lBQ3BELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250YWluZXJJbWFnZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3MnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU2l6ZSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGJhdGNoIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG5cbm5ldyBiYXRjaC5Fa3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRWtzSm9iRGVmbicsIHtcbiAgY29udGFpbmVyOiBuZXcgYmF0Y2guRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0NvbnRhaW5lcicsIHtcbiAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICBhcmdzOiBbJ2ZvbyddLFxuICAgIGNvbW1hbmQ6IFsnZWNobyBmb28nXSxcbiAgICBlbnY6IHsgZm9vOiAnYmFyJyB9LFxuICAgIGNwdUxpbWl0OiA4LFxuICAgIGNwdVJlc2VydmF0aW9uOiA0LFxuICAgIG1lbW9yeUxpbWl0OiBTaXplLm1lYmlieXRlcyg4MTkyKSxcbiAgICBtZW1vcnlSZXNlcnZhdGlvbjogU2l6ZS5tZWJpYnl0ZXMoODE5MiksXG4gICAgZ3B1TGltaXQ6IDEyLFxuICAgIGdwdVJlc2VydmF0aW9uOiAxMixcbiAgICBpbWFnZVB1bGxQb2xpY3k6IGJhdGNoLkltYWdlUHVsbFBvbGljeS5BTFdBWVMsXG4gICAgbmFtZTogJ215QmlnQ29vbFZvbHVtZScsXG4gICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgICByZWFkb25seVJvb3RGaWxlc3lzdGVtOiBmYWxzZSxcbiAgICBydW5Bc0dyb3VwOiAxLFxuICAgIHJ1bkFzUm9vdDogZmFsc2UsXG4gICAgcnVuQXNVc2VyOiAyMCxcbiAgICB2b2x1bWVzOiBbXG4gICAgICBiYXRjaC5Fa3NWb2x1bWUuZW1wdHlEaXIoe1xuICAgICAgICBuYW1lOiAnd29haCcsXG4gICAgICAgIG1vdW50UGF0aDogJy9tb3VudC9wYXRoJyxcbiAgICAgICAgbWVkaXVtOiBiYXRjaC5FbXB0eURpck1lZGl1bVR5cGUuTUVNT1JZLFxuICAgICAgICByZWFkb25seTogdHJ1ZSxcbiAgICAgICAgc2l6ZUxpbWl0OiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICAgIH0pLFxuICAgICAgYmF0Y2guRWtzVm9sdW1lLnNlY3JldCh7XG4gICAgICAgIG5hbWU6ICdzZWNyZXRWb2x1bWVOYW1lJyxcbiAgICAgICAgc2VjcmV0TmFtZTogJ3NlY3JldE5hbWUnLFxuICAgICAgICBtb3VudFBhdGg6ICcvc2VjcmV0L3BhdGgnLFxuICAgICAgICBvcHRpb25hbDogZmFsc2UsXG4gICAgICB9KSxcbiAgICAgIGJhdGNoLkVrc1ZvbHVtZS5zZWNyZXQoe1xuICAgICAgICBuYW1lOiAnZGVmYXVsdE9wdGlvbmFsU2V0dGluZ1NlY3JldFZvbHVtZScsXG4gICAgICAgIHNlY3JldE5hbWU6ICdOZXdTZWNyZXROYW1lJyxcbiAgICAgICAgbW91bnRQYXRoOiAnL3NlY3JldC9wYXRoMicsXG4gICAgICB9KSxcbiAgICAgIGJhdGNoLkVrc1ZvbHVtZS5ob3N0UGF0aCh7XG4gICAgICAgIG5hbWU6ICdob3N0UGF0aCcsXG4gICAgICAgIGhvc3RQYXRoOiAnL2Zvby9iYXInLFxuICAgICAgICBtb3VudFBhdGg6ICcvZm9vYXNkZmFkZnMnLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSksXG59KTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdCYXRjaEVjc0pvYkRlZmluaXRpb25UZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=