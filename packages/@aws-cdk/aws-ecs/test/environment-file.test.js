"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cdk = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const ecs = require("../lib");
/* eslint-disable dot-notation */
describe('environment file', () => {
    describe('ecs.EnvironmentFile.fromAsset', () => {
        test('fails if asset is not a single file', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const fileAsset = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles'));
            // THEN
            expect(() => defineContainerDefinition(stack, fileAsset)).toThrow(/Asset must be a single file/);
        });
        test('only one environment file asset object is created even if multiple container definitions use the same file', () => {
            // GIVEN
            const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
            const stack = new cdk.Stack(app);
            const fileAsset = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'));
            // WHEN
            const image = ecs.ContainerImage.fromRegistry('/aws/aws-example-app');
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const containerDefinitionProps = {
                environmentFiles: [fileAsset],
                image,
                memoryLimitMiB: 512,
                taskDefinition,
            };
            new ecs.ContainerDefinition(stack, 'ContainerOne', containerDefinitionProps);
            new ecs.ContainerDefinition(stack, 'ContainerTwo', containerDefinitionProps);
            // THEN
            const assembly = app.synth();
            const synthesized = assembly.stacks[0];
            // container one has an asset, container two does not
            expect(synthesized.assets.length).toEqual(1);
        });
    });
});
function defineContainerDefinition(stack, environmentFile) {
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    return new ecs.ContainerDefinition(stack, 'Container', {
        environmentFiles: [environmentFile],
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        memoryLimitMiB: 512,
        taskDefinition,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQtZmlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52aXJvbm1lbnQtZmlsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLHFDQUFxQztBQUNyQyx5Q0FBeUM7QUFDekMsOEJBQThCO0FBRTlCLGlDQUFpQztBQUVqQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDN0MsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUV2RixPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBRW5HLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDRHQUE0RyxFQUFFLEdBQUcsRUFBRTtZQUN0SCxRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGdDQUFnQyxDQUFDLENBQUMsQ0FBQztZQUV4RyxPQUFPO1lBQ1AsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN0RSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbkUsTUFBTSx3QkFBd0IsR0FBaUM7Z0JBQzdELGdCQUFnQixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUM3QixLQUFLO2dCQUNMLGNBQWMsRUFBRSxHQUFHO2dCQUNuQixjQUFjO2FBQ2YsQ0FBQztZQUVGLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUM3RSxJQUFJLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFFN0UsT0FBTztZQUNQLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM3QixNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZDLHFEQUFxRDtZQUNyRCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyx5QkFBeUIsQ0FBQyxLQUFnQixFQUFFLGVBQW9DO0lBQ3ZGLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVuRSxPQUFPLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7UUFDckQsZ0JBQWdCLEVBQUUsQ0FBQyxlQUFlLENBQUM7UUFDbkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDO1FBQzlELGNBQWMsRUFBRSxHQUFHO1FBQ25CLGNBQWM7S0FDZixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgZG90LW5vdGF0aW9uICovXG5cbmRlc2NyaWJlKCdlbnZpcm9ubWVudCBmaWxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZWNzLkVudmlyb25tZW50RmlsZS5mcm9tQXNzZXQnLCAoKSA9PiB7XG4gICAgdGVzdCgnZmFpbHMgaWYgYXNzZXQgaXMgbm90IGEgc2luZ2xlIGZpbGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBmaWxlQXNzZXQgPSBlY3MuRW52aXJvbm1lbnRGaWxlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGVtby1lbnZmaWxlcycpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGRlZmluZUNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssIGZpbGVBc3NldCkpLnRvVGhyb3coL0Fzc2V0IG11c3QgYmUgYSBzaW5nbGUgZmlsZS8pO1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdvbmx5IG9uZSBlbnZpcm9ubWVudCBmaWxlIGFzc2V0IG9iamVjdCBpcyBjcmVhdGVkIGV2ZW4gaWYgbXVsdGlwbGUgY29udGFpbmVyIGRlZmluaXRpb25zIHVzZSB0aGUgc2FtZSBmaWxlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgICAgY29uc3QgZmlsZUFzc2V0ID0gZWNzLkVudmlyb25tZW50RmlsZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8tZW52ZmlsZXMvdGVzdC1lbnZmaWxlLmVudicpKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgaW1hZ2UgPSBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuICAgICAgY29uc3QgY29udGFpbmVyRGVmaW5pdGlvblByb3BzOiBlY3MuQ29udGFpbmVyRGVmaW5pdGlvblByb3BzID0ge1xuICAgICAgICBlbnZpcm9ubWVudEZpbGVzOiBbZmlsZUFzc2V0XSxcbiAgICAgICAgaW1hZ2UsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfTtcblxuICAgICAgbmV3IGVjcy5Db250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnQ29udGFpbmVyT25lJywgY29udGFpbmVyRGVmaW5pdGlvblByb3BzKTtcbiAgICAgIG5ldyBlY3MuQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0NvbnRhaW5lclR3bycsIGNvbnRhaW5lckRlZmluaXRpb25Qcm9wcyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCBzeW50aGVzaXplZCA9IGFzc2VtYmx5LnN0YWNrc1swXTtcblxuICAgICAgLy8gY29udGFpbmVyIG9uZSBoYXMgYW4gYXNzZXQsIGNvbnRhaW5lciB0d28gZG9lcyBub3RcbiAgICAgIGV4cGVjdChzeW50aGVzaXplZC5hc3NldHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGRlZmluZUNvbnRhaW5lckRlZmluaXRpb24oc3RhY2s6IGNkay5TdGFjaywgZW52aXJvbm1lbnRGaWxlOiBlY3MuRW52aXJvbm1lbnRGaWxlKSB7XG4gIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICByZXR1cm4gbmV3IGVjcy5Db250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnQ29udGFpbmVyJywge1xuICAgIGVudmlyb25tZW50RmlsZXM6IFtlbnZpcm9ubWVudEZpbGVdLFxuICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gIH0pO1xufVxuIl19