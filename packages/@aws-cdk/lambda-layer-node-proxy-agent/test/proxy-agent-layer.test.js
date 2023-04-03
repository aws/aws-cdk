"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('synthesized to a layer version', () => {
    //GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.NodeProxyAgentLayer(stack, 'MyLayer');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
        Description: '/opt/nodejs/node_modules/proxy-agent',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHktYWdlbnQtbGF5ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb3h5LWFnZW50LWxheWVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXNDO0FBQ3RDLGdDQUE2QztBQUU3QyxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLE9BQU87SUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRTFCLE9BQU87SUFDUCxJQUFJLHlCQUFtQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUUxQyxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLEVBQUU7UUFDM0UsV0FBVyxFQUFFLHNDQUFzQztLQUNwRCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgTm9kZVByb3h5QWdlbnRMYXllciB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ3N5bnRoZXNpemVkIHRvIGEgbGF5ZXIgdmVyc2lvbicsICgpID0+IHtcbiAgLy9HSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IE5vZGVQcm94eUFnZW50TGF5ZXIoc3RhY2ssICdNeUxheWVyJyk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkxheWVyVmVyc2lvbicsIHtcbiAgICBEZXNjcmlwdGlvbjogJy9vcHQvbm9kZWpzL25vZGVfbW9kdWxlcy9wcm94eS1hZ2VudCcsXG4gIH0pO1xufSk7XG4iXX0=