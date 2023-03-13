"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkResource = exports.mkStack = void 0;
const fs = require("fs");
const path = require("path");
const cxschema = require("aws-cdk-lib/cloud-assembly-schema");
const cxapi = require("aws-cdk-lib/cx-api");
function mkStack(template) {
    const assembly = new cxapi.CloudAssemblyBuilder();
    assembly.addArtifact('test', {
        type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
        environment: cxapi.EnvironmentUtils.format('123456789012', 'bermuda-triangle-1'),
        properties: {
            templateFile: 'template.json',
        },
    });
    fs.writeFileSync(path.join(assembly.outdir, 'template.json'), JSON.stringify(template));
    return assembly.buildAssembly().getStackByName('test');
}
exports.mkStack = mkStack;
function mkResource(props) {
    return mkStack({
        Resources: {
            SomeResource: {
                Type: 'Some::Resource',
                Properties: props,
            },
        },
    });
}
exports.mkResource = mkResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWQtYXJ0aWZhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbG91ZC1hcnRpZmFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDhEQUE4RDtBQUM5RCw0Q0FBNEM7QUFFNUMsU0FBZ0IsT0FBTyxDQUFDLFFBQWE7SUFDbkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNsRCxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtRQUMzQixJQUFJLEVBQUUsUUFBUSxDQUFDLFlBQVksQ0FBQyx3QkFBd0I7UUFDcEQsV0FBVyxFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLG9CQUFvQixDQUFDO1FBQ2hGLFVBQVUsRUFBRTtZQUNWLFlBQVksRUFBRSxlQUFlO1NBQzlCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLE9BQU8sUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBWkQsMEJBWUM7QUFFRCxTQUFnQixVQUFVLENBQUMsS0FBVTtJQUNuQyxPQUFPLE9BQU8sQ0FBQztRQUNiLFNBQVMsRUFBRTtZQUNULFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixVQUFVLEVBQUUsS0FBSzthQUNsQjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVRELGdDQVNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ2F3cy1jZGstbGliL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdhd3MtY2RrLWxpYi9jeC1hcGknO1xuXG5leHBvcnQgZnVuY3Rpb24gbWtTdGFjayh0ZW1wbGF0ZTogYW55KTogY3hhcGkuQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0IHtcbiAgY29uc3QgYXNzZW1ibHkgPSBuZXcgY3hhcGkuQ2xvdWRBc3NlbWJseUJ1aWxkZXIoKTtcbiAgYXNzZW1ibHkuYWRkQXJ0aWZhY3QoJ3Rlc3QnLCB7XG4gICAgdHlwZTogY3hzY2hlbWEuQXJ0aWZhY3RUeXBlLkFXU19DTE9VREZPUk1BVElPTl9TVEFDSyxcbiAgICBlbnZpcm9ubWVudDogY3hhcGkuRW52aXJvbm1lbnRVdGlscy5mb3JtYXQoJzEyMzQ1Njc4OTAxMicsICdiZXJtdWRhLXRyaWFuZ2xlLTEnKSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICB0ZW1wbGF0ZUZpbGU6ICd0ZW1wbGF0ZS5qc29uJyxcbiAgICB9LFxuICB9KTtcblxuICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihhc3NlbWJseS5vdXRkaXIsICd0ZW1wbGF0ZS5qc29uJyksIEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSk7XG4gIHJldHVybiBhc3NlbWJseS5idWlsZEFzc2VtYmx5KCkuZ2V0U3RhY2tCeU5hbWUoJ3Rlc3QnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1rUmVzb3VyY2UocHJvcHM6IGFueSk6IGN4YXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCB7XG4gIHJldHVybiBta1N0YWNrKHtcbiAgICBSZXNvdXJjZXM6IHtcbiAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiBwcm9wcyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59Il19