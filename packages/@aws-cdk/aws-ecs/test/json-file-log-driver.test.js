"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const ecs = require("../lib");
let stack;
let td;
const image = ecs.ContainerImage.fromRegistry('test-image');
describe('json file log driver', () => {
    beforeEach(() => {
        stack = new cdk.Stack();
        td = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition');
    });
    test('create a json-file log driver with options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.JsonFileLogDriver({
                env: ['hello'],
            }),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'json-file',
                        Options: {
                            env: 'hello',
                        },
                    },
                }),
            ],
        });
    });
    test('create a json-file log driver without options', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: new ecs.JsonFileLogDriver(),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'json-file',
                    },
                }),
            ],
        });
    });
    test('create a json-file log driver using json-file', () => {
        // WHEN
        td.addContainer('Container', {
            image,
            logging: ecs.LogDrivers.jsonFile(),
            memoryLimitMiB: 128,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'json-file',
                        Options: {},
                    },
                }),
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1maWxlLWxvZy1kcml2ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpzb24tZmlsZS1sb2ctZHJpdmVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQscUNBQXFDO0FBQ3JDLDhCQUE4QjtBQUU5QixJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxFQUFzQixDQUFDO0FBQzNCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRTVELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFHMUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELE9BQU87UUFDUCxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUMzQixLQUFLO1lBQ0wsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDO2dCQUNqQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7YUFDZixDQUFDO1lBQ0YsY0FBYyxFQUFFLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLG9CQUFvQixFQUFFO2dCQUNwQixrQkFBSyxDQUFDLFVBQVUsQ0FBQztvQkFDZixnQkFBZ0IsRUFBRTt3QkFDaEIsU0FBUyxFQUFFLFdBQVc7d0JBQ3RCLE9BQU8sRUFBRTs0QkFDUCxHQUFHLEVBQUUsT0FBTzt5QkFDYjtxQkFDRjtpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsT0FBTztRQUNQLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFO1lBQzNCLEtBQUs7WUFDTCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUU7WUFDcEMsY0FBYyxFQUFFLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLG9CQUFvQixFQUFFO2dCQUNwQixrQkFBSyxDQUFDLFVBQVUsQ0FBQztvQkFDZixnQkFBZ0IsRUFBRTt3QkFDaEIsU0FBUyxFQUFFLFdBQVc7cUJBQ3ZCO2lCQUNGLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtRQUN6RCxPQUFPO1FBQ1AsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDM0IsS0FBSztZQUNMLE9BQU8sRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNsQyxjQUFjLEVBQUUsR0FBRztTQUNwQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7WUFDMUUsb0JBQW9CLEVBQUU7Z0JBQ3BCLGtCQUFLLENBQUMsVUFBVSxDQUFDO29CQUNmLGdCQUFnQixFQUFFO3dCQUNoQixTQUFTLEVBQUUsV0FBVzt3QkFDdEIsT0FBTyxFQUFFLEVBQUU7cUJBQ1o7aUJBQ0YsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uL2xpYic7XG5cbmxldCBzdGFjazogY2RrLlN0YWNrO1xubGV0IHRkOiBlY3MuVGFza0RlZmluaXRpb247XG5jb25zdCBpbWFnZSA9IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QtaW1hZ2UnKTtcblxuZGVzY3JpYmUoJ2pzb24gZmlsZSBsb2cgZHJpdmVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICB0ZCA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmaW5pdGlvbicpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEganNvbi1maWxlIGxvZyBkcml2ZXIgd2l0aCBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0ZC5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlLFxuICAgICAgbG9nZ2luZzogbmV3IGVjcy5Kc29uRmlsZUxvZ0RyaXZlcih7XG4gICAgICAgIGVudjogWydoZWxsbyddLFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdqc29uLWZpbGUnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICBlbnY6ICdoZWxsbycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIGEganNvbi1maWxlIGxvZyBkcml2ZXIgd2l0aG91dCBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0ZC5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlLFxuICAgICAgbG9nZ2luZzogbmV3IGVjcy5Kc29uRmlsZUxvZ0RyaXZlcigpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEyOCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnanNvbi1maWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZSBhIGpzb24tZmlsZSBsb2cgZHJpdmVyIHVzaW5nIGpzb24tZmlsZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGQuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICBpbWFnZSxcbiAgICAgIGxvZ2dpbmc6IGVjcy5Mb2dEcml2ZXJzLmpzb25GaWxlKCksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdqc29uLWZpbGUnLFxuICAgICAgICAgICAgT3B0aW9uczoge30sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19