"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const ssm = require("@aws-cdk/aws-ssm");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
let stack;
let td;
let secret;
const image = ecs.ContainerImage.fromRegistry('test-image');
describe('splunk log driver', () => {
    beforeEach(() => {
        stack = new cdk.Stack();
        td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
        secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'my-splunk-token');
    });
    test('create a splunk log driver with minimum options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.SplunkLogDriver({
                secretToken: ecs.Secret.fromSecretsManager(secret),
                url: 'my-splunk-url',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'splunk',
                        Options: {
                            'splunk-url': 'my-splunk-url',
                        },
                        SecretOptions: [{
                                Name: 'splunk-token',
                                ValueFrom: {
                                    'Fn::Join': ['', ['arn:',
                                            { Ref: 'AWS::Partition' }, ':secretsmanager:', { Ref: 'AWS::Region' }, ':',
                                            { Ref: 'AWS::AccountId' }, ':secret:my-splunk-token']],
                                },
                            }],
                    },
                }),
            ],
        });
    });
    test('create a splunk log driver using splunk with minimum options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.splunk({
                secretToken: ecs.Secret.fromSecretsManager(secret),
                url: 'my-splunk-url',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'splunk',
                        Options: {
                            'splunk-url': 'my-splunk-url',
                        },
                        SecretOptions: [{
                                Name: 'splunk-token',
                                ValueFrom: {
                                    'Fn::Join': ['', ['arn:',
                                            { Ref: 'AWS::Partition' }, ':secretsmanager:', { Ref: 'AWS::Region' }, ':',
                                            { Ref: 'AWS::AccountId' }, ':secret:my-splunk-token']],
                                },
                            }],
                    },
                }),
            ],
        });
    });
    test('create a splunk log driver using splunk with sourcetype defined', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.splunk({
                secretToken: ecs.Secret.fromSecretsManager(secret),
                url: 'my-splunk-url',
                sourceType: 'my-source-type',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'splunk',
                        Options: {
                            'splunk-url': 'my-splunk-url',
                            'splunk-sourcetype': 'my-source-type',
                        },
                        SecretOptions: [{
                                Name: 'splunk-token',
                                ValueFrom: {
                                    'Fn::Join': ['', ['arn:',
                                            { Ref: 'AWS::Partition' }, ':secretsmanager:', { Ref: 'AWS::Region' }, ':',
                                            { Ref: 'AWS::AccountId' }, ':secret:my-splunk-token']],
                                },
                            }],
                    },
                }),
            ],
        });
    });
    test('create a splunk log driver using secret splunk token from a new secret', () => {
        const secret2 = new secretsmanager.Secret(stack, 'Secret2');
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.splunk({
                secretToken: ecs.Secret.fromSecretsManager(secret2),
                url: 'my-splunk-url',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'splunk',
                        Options: {
                            'splunk-url': 'my-splunk-url',
                        },
                        SecretOptions: [
                            {
                                Name: 'splunk-token',
                                ValueFrom: {
                                    Ref: 'Secret244EA3BB5',
                                },
                            },
                        ],
                    },
                }),
            ],
        });
    });
    test('create a splunk log driver using secret splunk token from systems manager parameter store', () => {
        const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
            parameterName: '/token',
            version: 1,
        });
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.splunk({
                secretToken: ecs.Secret.fromSsmParameter(parameter),
                url: 'my-splunk-url',
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'splunk',
                        Options: {
                            'splunk-url': 'my-splunk-url',
                        },
                        SecretOptions: [
                            {
                                Name: 'splunk-token',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {
                                                Ref: 'AWS::Partition',
                                            },
                                            ':ssm:',
                                            {
                                                Ref: 'AWS::Region',
                                            },
                                            ':',
                                            {
                                                Ref: 'AWS::AccountId',
                                            },
                                            ':parameter/token',
                                        ],
                                    ],
                                },
                            },
                        ],
                    },
                }),
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsdW5rLWxvZy1kcml2ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNwbHVuay1sb2ctZHJpdmVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsOERBQThEO0FBQzlELHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLEVBQXNCLENBQUM7QUFDM0IsSUFBSSxNQUE4QixDQUFDO0FBQ25DLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRTVELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDeEQsTUFBTSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxPQUFPO1FBQ1AsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDM0IsS0FBSztZQUNMLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQy9CLFdBQVcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztnQkFDbEQsR0FBRyxFQUFFLGVBQWU7YUFDckIsQ0FBQztZQUNGLGNBQWMsRUFBRSxHQUFHO1NBQ3BCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNB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QUUsYUFBYTs2Q0FDbkI7NENBQ0QsR0FBRzs0Q0FDSDtnREFDRSxHQUFHLEVBQUUsZ0JBQWdCOzZDQUN0Qjs0Q0FDRCxrQkFBa0I7eUNBQ25CO3FDQUNGO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJ0Bhd3MtY2RrL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vbGliJztcblxubGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5sZXQgdGQ6IGVjcy5UYXNrRGVmaW5pdGlvbjtcbmxldCBzZWNyZXQ6IHNlY3JldHNtYW5hZ2VyLklTZWNyZXQ7XG5jb25zdCBpbWFnZSA9IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QtaW1hZ2UnKTtcblxuZGVzY3JpYmUoJ3NwbHVuayBsb2cgZHJpdmVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICB0ZCA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmaW5pdGlvbicpO1xuICAgIHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0TmFtZVYyKHN0YWNrLCAnU2VjcmV0JywgJ215LXNwbHVuay10b2tlbicpO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBzcGx1bmsgbG9nIGRyaXZlciB3aXRoIG1pbmltdW0gb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IG5ldyBlY3MuU3BsdW5rTG9nRHJpdmVyKHtcbiAgICAgICAgc2VjcmV0VG9rZW46IGVjcy5TZWNyZXQuZnJvbVNlY3JldHNNYW5hZ2VyKHNlY3JldCksXG4gICAgICAgIHVybDogJ215LXNwbHVuay11cmwnLFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdzcGx1bmsnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnc3BsdW5rLXVybCc6ICdteS1zcGx1bmstdXJsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZWNyZXRPcHRpb25zOiBbe1xuICAgICAgICAgICAgICBOYW1lOiAnc3BsdW5rLXRva2VuJyxcbiAgICAgICAgICAgICAgVmFsdWVGcm9tOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpzZWNyZXRzbWFuYWdlcjonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnNlY3JldDpteS1zcGx1bmstdG9rZW4nXV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHNwbHVuayBsb2cgZHJpdmVyIHVzaW5nIHNwbHVuayB3aXRoIG1pbmltdW0gb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Mb2dEcml2ZXJzLnNwbHVuayh7XG4gICAgICAgIHNlY3JldFRva2VuOiBlY3MuU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlcihzZWNyZXQpLFxuICAgICAgICB1cmw6ICdteS1zcGx1bmstdXJsJyxcbiAgICAgIH0pLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEyOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnc3BsdW5rJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ3NwbHVuay11cmwnOiAnbXktc3BsdW5rLXVybCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VjcmV0T3B0aW9uczogW3tcbiAgICAgICAgICAgICAgTmFtZTogJ3NwbHVuay10b2tlbicsXG4gICAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgWydhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6c2VjcmV0c21hbmFnZXI6JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpzZWNyZXQ6bXktc3BsdW5rLXRva2VuJ11dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgYSBzcGx1bmsgbG9nIGRyaXZlciB1c2luZyBzcGx1bmsgd2l0aCBzb3VyY2V0eXBlIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBlY3MuTG9nRHJpdmVycy5zcGx1bmsoe1xuICAgICAgICBzZWNyZXRUb2tlbjogZWNzLlNlY3JldC5mcm9tU2VjcmV0c01hbmFnZXIoc2VjcmV0KSxcbiAgICAgICAgdXJsOiAnbXktc3BsdW5rLXVybCcsXG4gICAgICAgIHNvdXJjZVR5cGU6ICdteS1zb3VyY2UtdHlwZScsXG4gICAgICB9KSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMjgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ3NwbHVuaycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdzcGx1bmstdXJsJzogJ215LXNwbHVuay11cmwnLFxuICAgICAgICAgICAgICAnc3BsdW5rLXNvdXJjZXR5cGUnOiAnbXktc291cmNlLXR5cGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNlY3JldE9wdGlvbnM6IFt7XG4gICAgICAgICAgICAgIE5hbWU6ICdzcGx1bmstdG9rZW4nLFxuICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnNlY3JldHNtYW5hZ2VyOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JyxcbiAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6c2VjcmV0Om15LXNwbHVuay10b2tlbiddXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEgc3BsdW5rIGxvZyBkcml2ZXIgdXNpbmcgc2VjcmV0IHNwbHVuayB0b2tlbiBmcm9tIGEgbmV3IHNlY3JldCcsICgpID0+IHtcbiAgICBjb25zdCBzZWNyZXQyID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldDInKTtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Mb2dEcml2ZXJzLnNwbHVuayh7XG4gICAgICAgIHNlY3JldFRva2VuOiBlY3MuU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlcihzZWNyZXQyKSxcbiAgICAgICAgdXJsOiAnbXktc3BsdW5rLXVybCcsXG4gICAgICB9KSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMjgsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ3NwbHVuaycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdzcGx1bmstdXJsJzogJ215LXNwbHVuay11cmwnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNlY3JldE9wdGlvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdzcGx1bmstdG9rZW4nLFxuICAgICAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnU2VjcmV0MjQ0RUEzQkI1JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIHNwbHVuayBsb2cgZHJpdmVyIHVzaW5nIHNlY3JldCBzcGx1bmsgdG9rZW4gZnJvbSBzeXN0ZW1zIG1hbmFnZXIgcGFyYW1ldGVyIHN0b3JlJywgKCkgPT4ge1xuICAgIGNvbnN0IHBhcmFtZXRlciA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXMoc3RhY2ssICdQYXJhbWV0ZXInLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnL3Rva2VuJyxcbiAgICAgIHZlcnNpb246IDEsXG4gICAgfSk7XG4gICAgLy8gV0hFTlxuICAgIHRkLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2UsXG4gICAgICBsb2dnaW5nOiBlY3MuTG9nRHJpdmVycy5zcGx1bmsoe1xuICAgICAgICBzZWNyZXRUb2tlbjogZWNzLlNlY3JldC5mcm9tU3NtUGFyYW1ldGVyKHBhcmFtZXRlciksXG4gICAgICAgIHVybDogJ215LXNwbHVuay11cmwnLFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdzcGx1bmsnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnc3BsdW5rLXVybCc6ICdteS1zcGx1bmstdXJsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZWNyZXRPcHRpb25zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnc3BsdW5rLXRva2VuJyxcbiAgICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpwYXJhbWV0ZXIvdG9rZW4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=