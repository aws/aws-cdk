"use strict";
const nodeunit = require("nodeunit");
const lib_1 = require("../lib");
const SAMPLE_MANIFEST = {
    schema: "cloud-assembly/1.0",
    drops: {
        "PipelineStack": {
            type: "npm://@aws-cdk/aws-cloudformation.StackDrop",
            environment: "aws://123456789012/eu-west-1",
            properties: {
                template: "stacks/PipelineStack.yml"
            }
        },
        "ServiceStack-beta": {
            type: "npm://@aws-cdk/aws-cloudformation.StackDrop",
            environment: "aws://123456789012/eu-west-1",
            properties: {
                template: "stacks/ServiceStack-beta.yml",
                stackPolicy: "stacks/ServiceStack-beta.stack-policy.json",
                parameters: {
                    image: "${DockerImage.exactImageId}",
                    websiteFilesBucket: "${StaticFiles.bucketName}",
                    websiteFilesKeyPrefix: "${StaticFiles.keyPrefix}",
                }
            }
        },
        "ServiceStack-prod": {
            type: "npm://@aws-cdk/aws-cloudformation.StackDrop",
            environment: "aws://123456789012/eu-west-1",
            properties: {
                template: "stacks/ServiceStack-prod.yml",
                stackPolicy: "stacks/ServiceStack-prod.stack-policy.json",
                parameters: {
                    image: "${DockerImage.exactImageId}",
                    websiteFilesBucket: "${StaticFiles.bucketName}",
                    websiteFilesKeyPrefix: "${StaticFiles.keyPrefix}",
                }
            }
        },
        "DockerImage": {
            type: "npm://@aws-cdk/aws-ecr.DockerImageDrop",
            environment: "aws://123456789012/eu-west-1",
            properties: {
                savedImage: "docker/docker-image.tar",
                imageName: "${PipelineStack.ecrImageName}"
            }
        },
        "StaticFiles": {
            type: "npm://@aws-cdk/assets.DirectoryDrop",
            environment: "aws://123456789012/eu-west-1",
            properties: {
                directory: "assets/static-website",
                bucketName: "${PipelineStack.stagingBucket}"
            }
        }
    }
};
module.exports = nodeunit.testCase({
    validateManifest: {
        'successfully loads the example manifest'(test) {
            test.doesNotThrow(() => lib_1.validateManifest(SAMPLE_MANIFEST));
            test.done();
        },
        'rejects a document where the schema is invalid'(test) {
            const badManifest = JSON.parse(JSON.stringify(SAMPLE_MANIFEST));
            badManifest.schema = 'foo/1.0-bar';
            test.throws(() => lib_1.validateManifest(badManifest), /instance\.schema is not one of enum values/);
            test.done();
        },
        'rejects a document without drops'(test) {
            const badManifest = JSON.parse(JSON.stringify(SAMPLE_MANIFEST));
            delete badManifest.drops;
            test.throws(() => lib_1.validateManifest(badManifest), /instance requires property "drops"/);
            test.done();
        },
        'rejects a document with an illegal Logical ID'(test) {
            const badManifest = JSON.parse(JSON.stringify(SAMPLE_MANIFEST));
            badManifest.drops['Pipeline.Stack'] = badManifest.drops.PipelineStack;
            test.throws(() => lib_1.validateManifest(badManifest), /Invalid logical ID: Pipeline\.Stack/);
            test.done();
        },
        'rejects a document with unresolved dependsOn'(test) {
            const badManifest = JSON.parse(JSON.stringify(SAMPLE_MANIFEST));
            badManifest.drops.PipelineStack.dependsOn = ['DoesNotExist'];
            test.throws(() => lib_1.validateManifest(badManifest), /PipelineStack depends on undefined drop through dependsOn DoesNotExist/);
            test.done();
        },
        'rejects a document with direct circular dependency via dependsOn'(test) {
            const badManifest = JSON.parse(JSON.stringify(SAMPLE_MANIFEST));
            badManifest.drops.PipelineStack.dependsOn = ['PipelineStack'];
            test.throws(() => lib_1.validateManifest(badManifest), /PipelineStack => dependsOn PipelineStack/);
            test.done();
        },
        'rejects a document with indirect circular dependency'(test) {
            const badManifest = JSON.parse(JSON.stringify(SAMPLE_MANIFEST));
            badManifest.drops.StaticFiles.dependsOn = ['ServiceStack-beta'];
            test.throws(() => lib_1.validateManifest(badManifest), 
            // tslint:disable-next-line:max-line-length
            /StaticFiles => dependsOn ServiceStack-beta => ServiceStack-beta\.properties\.parameters\.websiteFilesKeyPrefix "\${StaticFiles\.keyPrefix}"/);
            test.done();
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC52YWxpZGF0ZS1tYW5pZmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudmFsaWRhdGUtbWFuaWZlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFDQUFzQztBQUN0QyxnQ0FBMEM7QUFzRDFDLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLE1BQU0sRUFBRSxvQkFBb0I7SUFDNUIsS0FBSyxFQUFFO1FBQ0wsZUFBZSxFQUFFO1lBQ2YsSUFBSSxFQUFFLDZDQUE2QztZQUNuRCxXQUFXLEVBQUUsOEJBQThCO1lBQzNDLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsMEJBQTBCO2FBQ3JDO1NBQ0Y7UUFDRCxtQkFBbUIsRUFBRTtZQUNuQixJQUFJLEVBQUUsNkNBQTZDO1lBQ25ELFdBQVcsRUFBRSw4QkFBOEI7WUFDM0MsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRSw4QkFBOEI7Z0JBQ3hDLFdBQVcsRUFBRSw0Q0FBNEM7Z0JBQ3pELFVBQVUsRUFBRTtvQkFDVixLQUFLLEVBQUUsNkJBQTZCO29CQUNwQyxrQkFBa0IsRUFBRSwyQkFBMkI7b0JBQy9DLHFCQUFxQixFQUFFLDBCQUEwQjtpQkFDbEQ7YUFDRjtTQUNGO1FBQ0QsbUJBQW1CLEVBQUU7WUFDbkIsSUFBSSxFQUFFLDZDQUE2QztZQUNuRCxXQUFXLEVBQUUsOEJBQThCO1lBQzNDLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsOEJBQThCO2dCQUN4QyxXQUFXLEVBQUUsNENBQTRDO2dCQUN6RCxVQUFVLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLDZCQUE2QjtvQkFDcEMsa0JBQWtCLEVBQUUsMkJBQTJCO29CQUMvQyxxQkFBcUIsRUFBRSwwQkFBMEI7aUJBQ2xEO2FBQ0Y7U0FDRjtRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSx3Q0FBd0M7WUFDOUMsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLHlCQUF5QjtnQkFDckMs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QXNELENBQUMsSUFBbUI7WUFDeEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDaEUsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFnQixDQUFDLFdBQVcsQ0FBQztZQUNuQywyQ0FBMkM7WUFDM0MsNklBQTZJLENBQUMsQ0FBQztZQUMzSixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbm9kZXVuaXQgPSByZXF1aXJlKCdub2RldW5pdCcpO1xuaW1wb3J0IHsgdmFsaWRhdGVNYW5pZmVzdCB9IGZyb20gJy4uL2xpYic7XG5cbmV4cG9ydCA9IG5vZGV1bml0LnRlc3RDYXNlKHtcbiAgdmFsaWRhdGVNYW5pZmVzdDoge1xuICAgICdzdWNjZXNzZnVsbHkgbG9hZHMgdGhlIGV4YW1wbGUgbWFuaWZlc3QnKHRlc3Q6IG5vZGV1bml0LlRlc3QpIHtcbiAgICAgIHRlc3QuZG9lc05vdFRocm93KCgpID0+IHZhbGlkYXRlTWFuaWZlc3QoU0FNUExFX01BTklGRVNUKSk7XG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuICAgICdyZWplY3RzIGEgZG9jdW1lbnQgd2hlcmUgdGhlIHNjaGVtYSBpcyBpbnZhbGlkJyh0ZXN0OiBub2RldW5pdC5UZXN0KSB7XG4gICAgICBjb25zdCBiYWRNYW5pZmVzdCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoU0FNUExFX01BTklGRVNUKSk7XG4gICAgICBiYWRNYW5pZmVzdC5zY2hlbWEgPSAnZm9vLzEuMC1iYXInO1xuICAgICAgdGVzdC50aHJvd3MoKCkgPT4gdmFsaWRhdGVNYW5pZmVzdChiYWRNYW5pZmVzdCksXG4gICAgICAgICAgICAgICAgICAvaW5zdGFuY2VcXC5zY2hlbWEgaXMgbm90IG9uZSBvZiBlbnVtIHZhbHVlcy8pO1xuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcbiAgICAncmVqZWN0cyBhIGRvY3VtZW50IHdpdGhvdXQgZHJvcHMnKHRlc3Q6IG5vZGV1bml0LlRlc3QpIHtcbiAgICAgIGNvbnN0IGJhZE1hbmlmZXN0ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShTQU1QTEVfTUFOSUZFU1QpKTtcbiAgICAgIGRlbGV0ZSBiYWRNYW5pZmVzdC5kcm9wcztcbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHZhbGlkYXRlTWFuaWZlc3QoYmFkTWFuaWZlc3QpLFxuICAgICAgICAgICAgICAgICAgL2luc3RhbmNlIHJlcXVpcmVzIHByb3BlcnR5IFwiZHJvcHNcIi8pO1xuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcbiAgICAncmVqZWN0cyBhIGRvY3VtZW50IHdpdGggYW4gaWxsZWdhbCBMb2dpY2FsIElEJyh0ZXN0OiBub2RldW5pdC5UZXN0KSB7XG4gICAgICBjb25zdCBiYWRNYW5pZmVzdCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoU0FNUExFX01BTklGRVNUKSk7XG4gICAgICBiYWRNYW5pZmVzdC5kcm9wc1snUGlwZWxpbmUuU3RhY2snXSA9IGJhZE1hbmlmZXN0LmRyb3BzLlBpcGVsaW5lU3RhY2s7XG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB2YWxpZGF0ZU1hbmlmZXN0KGJhZE1hbmlmZXN0KSxcbiAgICAgICAgICAgICAgICAgIC9JbnZhbGlkIGxvZ2ljYWwgSUQ6IFBpcGVsaW5lXFwuU3RhY2svKTtcbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG4gICAgJ3JlamVjdHMgYSBkb2N1bWVudCB3aXRoIHVucmVzb2x2ZWQgZGVwZW5kc09uJyh0ZXN0OiBub2RldW5pdC5UZXN0KSB7XG4gICAgICBjb25zdCBiYWRNYW5pZmVzdCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoU0FNUExFX01BTklGRVNUKSk7XG4gICAgICBiYWRNYW5pZmVzdC5kcm9wcy5QaXBlbGluZVN0YWNrLmRlcGVuZHNPbiA9IFsnRG9lc05vdEV4aXN0J107XG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB2YWxpZGF0ZU1hbmlmZXN0KGJhZE1hbmlmZXN0KSxcbiAgICAgICAgICAgICAgICAgIC9QaXBlbGluZVN0YWNrIGRlcGVuZHMgb24gdW5kZWZpbmVkIGRyb3AgdGhyb3VnaCBkZXBlbmRzT24gRG9lc05vdEV4aXN0Lyk7XG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuICAgICdyZWplY3RzIGEgZG9jdW1lbnQgd2l0aCBkaXJlY3QgY2lyY3VsYXIgZGVwZW5kZW5jeSB2aWEgZGVwZW5kc09uJyh0ZXN0OiBub2RldW5pdC5UZXN0KSB7XG4gICAgICBjb25zdCBiYWRNYW5pZmVzdCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoU0FNUExFX01BTklGRVNUKSk7XG4gICAgICBiYWRNYW5pZmVzdC5kcm9wcy5QaXBlbGluZVN0YWNrLmRlcGVuZHNPbiA9IFsnUGlwZWxpbmVTdGFjayddO1xuICAgICAgdGVzdC50aHJvd3MoKCkgPT4gdmFsaWRhdGVNYW5pZmVzdChiYWRNYW5pZmVzdCksXG4gICAgICAgICAgICAgICAgICAvUGlwZWxpbmVTdGFjayA9PiBkZXBlbmRzT24gUGlwZWxpbmVTdGFjay8pO1xuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcbiAgICAncmVqZWN0cyBhIGRvY3VtZW50IHdpdGggaW5kaXJlY3QgY2lyY3VsYXIgZGVwZW5kZW5jeScodGVzdDogbm9kZXVuaXQuVGVzdCkge1xuICAgICAgY29uc3QgYmFkTWFuaWZlc3QgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KFNBTVBMRV9NQU5JRkVTVCkpO1xuICAgICAgYmFkTWFuaWZlc3QuZHJvcHMuU3RhdGljRmlsZXMuZGVwZW5kc09uID0gWydTZXJ2aWNlU3RhY2stYmV0YSddO1xuICAgICAgdGVzdC50aHJvd3MoKCkgPT4gdmFsaWRhdGVNYW5pZmVzdChiYWRNYW5pZmVzdCksXG4gICAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgICAgICAvU3RhdGljRmlsZXMgPT4gZGVwZW5kc09uIFNlcnZpY2VTdGFjay1iZXRhID0+IFNlcnZpY2VTdGFjay1iZXRhXFwucHJvcGVydGllc1xcLnBhcmFtZXRlcnNcXC53ZWJzaXRlRmlsZXNLZXlQcmVmaXggXCJcXCR7U3RhdGljRmlsZXNcXC5rZXlQcmVmaXh9XCIvKTtcbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH1cbiAgfVxufSk7XG5cbmNvbnN0IFNBTVBMRV9NQU5JRkVTVCA9IHtcbiAgc2NoZW1hOiBcImNsb3VkLWFzc2VtYmx5LzEuMFwiLFxuICBkcm9wczoge1xuICAgIFwiUGlwZWxpbmVTdGFja1wiOiB7XG4gICAgICB0eXBlOiBcIm5wbTovL0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbi5TdGFja0Ryb3BcIixcbiAgICAgIGVudmlyb25tZW50OiBcImF3czovLzEyMzQ1Njc4OTAxMi9ldS13ZXN0LTFcIixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGVtcGxhdGU6IFwic3RhY2tzL1BpcGVsaW5lU3RhY2sueW1sXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiU2VydmljZVN0YWNrLWJldGFcIjoge1xuICAgICAgdHlwZTogXCJucG06Ly9AYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24uU3RhY2tEcm9wXCIsXG4gICAgICBlbnZpcm9ubWVudDogXCJhd3M6Ly8xMjM0NTY3ODkwMTIvZXUtd2VzdC0xXCIsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRlbXBsYXRlOiBcInN0YWNrcy9TZXJ2aWNlU3RhY2stYmV0YS55bWxcIixcbiAgICAgICAgc3RhY2tQb2xpY3k6IFwic3RhY2tzL1NlcnZpY2VTdGFjay1iZXRhLnN0YWNrLXBvbGljeS5qc29uXCIsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBpbWFnZTogXCIke0RvY2tlckltYWdlLmV4YWN0SW1hZ2VJZH1cIixcbiAgICAgICAgICB3ZWJzaXRlRmlsZXNCdWNrZXQ6IFwiJHtTdGF0aWNGaWxlcy5idWNrZXROYW1lfVwiLFxuICAgICAgICAgIHdlYnNpdGVGaWxlc0tleVByZWZpeDogXCIke1N0YXRpY0ZpbGVzLmtleVByZWZpeH1cIixcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgXCJTZXJ2aWNlU3RhY2stcHJvZFwiOiB7XG4gICAgICB0eXBlOiBcIm5wbTovL0Bhd3MtY2RrL2F3cy1jbG91ZGZvcm1hdGlvbi5TdGFja0Ryb3BcIixcbiAgICAgIGVudmlyb25tZW50OiBcImF3czovLzEyMzQ1Njc4OTAxMi9ldS13ZXN0LTFcIixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGVtcGxhdGU6IFwic3RhY2tzL1NlcnZpY2VTdGFjay1wcm9kLnltbFwiLFxuICAgICAgICBzdGFja1BvbGljeTogXCJzdGFja3MvU2VydmljZVN0YWNrLXByb2Quc3RhY2stcG9saWN5Lmpzb25cIixcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIGltYWdlOiBcIiR7RG9ja2VySW1hZ2UuZXhhY3RJbWFnZUlkfVwiLFxuICAgICAgICAgIHdlYnNpdGVGaWxlc0J1Y2tldDogXCIke1N0YXRpY0ZpbGVzLmJ1Y2tldE5hbWV9XCIsXG4gICAgICAgICAgd2Vic2l0ZUZpbGVzS2V5UHJlZml4OiBcIiR7U3RhdGljRmlsZXMua2V5UHJlZml4fVwiLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcIkRvY2tlckltYWdlXCI6IHtcbiAgICAgIHR5cGU6IFwibnBtOi8vQGF3cy1jZGsvYXdzLWVjci5Eb2NrZXJJbWFnZURyb3BcIixcbiAgICAgIGVudmlyb25tZW50OiBcImF3czovLzEyMzQ1Njc4OTAxMi9ldS13ZXN0LTFcIixcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc2F2ZWRJbWFnZTogXCJkb2NrZXIvZG9ja2VyLWltYWdlLnRhclwiLFxuICAgICAgICBpbWFnZU5hbWU6IFwiJHtQaXBlbGluZVN0YWNrLmVjckltYWdlTmFtZX1cIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJTdGF0aWNGaWxlc1wiOiB7XG4gICAgICB0eXBlOiBcIm5wbTovL0Bhd3MtY2RrL2Fzc2V0cy5EaXJlY3RvcnlEcm9wXCIsXG4gICAgICBlbnZpcm9ubWVudDogXCJhd3M6Ly8xMjM0NTY3ODkwMTIvZXUtd2VzdC0xXCIsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGRpcmVjdG9yeTogXCJhc3NldHMvc3RhdGljLXdlYnNpdGVcIixcbiAgICAgICAgYnVja2V0TmFtZTogXCIke1BpcGVsaW5lU3RhY2suc3RhZ2luZ0J1Y2tldH1cIlxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiJdfQ==