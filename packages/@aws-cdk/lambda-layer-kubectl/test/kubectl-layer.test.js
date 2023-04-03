"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('synthesized to a layer version', () => {
    //GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.KubectlLayer(stack, 'MyLayer');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
        Description: '/opt/kubectl/kubectl and /opt/helm/helm',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ViZWN0bC1sYXllci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsia3ViZWN0bC1sYXllci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFzQztBQUN0QyxnQ0FBc0M7QUFFdEMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtJQUMxQyxPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxrQkFBWSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUVuQyxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7UUFDM0UsV0FBVyxFQUFFLHlDQUF5QztLQUN2RCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgS3ViZWN0bExheWVyIH0gZnJvbSAnLi4vbGliJztcblxudGVzdCgnc3ludGhlc2l6ZWQgdG8gYSBsYXllciB2ZXJzaW9uJywgKCkgPT4ge1xuICAvL0dJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgS3ViZWN0bExheWVyKHN0YWNrLCAnTXlMYXllcicpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpMYXllclZlcnNpb24nLCB7XG4gICAgRGVzY3JpcHRpb246ICcvb3B0L2t1YmVjdGwva3ViZWN0bCBhbmQgL29wdC9oZWxtL2hlbG0nLFxuICB9KTtcbn0pO1xuIl19