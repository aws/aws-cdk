"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constructs_1 = require("constructs");
const util_1 = require("./util");
const lib_1 = require("../lib");
describe('parameter', () => {
    test('parameters can be used and referenced using param.ref', () => {
        const stack = new lib_1.Stack();
        const child = new constructs_1.Construct(stack, 'Child');
        const param = new lib_1.CfnParameter(child, 'MyParam', {
            default: 10,
            type: 'Integer',
            description: 'My first parameter',
        });
        new lib_1.CfnResource(stack, 'Resource', { type: 'Type', properties: { ReferenceToParam: param.value } });
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Parameters: {
                ChildMyParam3161BF5D: {
                    Default: 10,
                    Type: 'Integer',
                    Description: 'My first parameter',
                },
            },
            Resources: {
                Resource: {
                    Type: 'Type',
                    Properties: { ReferenceToParam: { Ref: 'ChildMyParam3161BF5D' } },
                },
            },
        });
    });
    test('parameters are tokens, so they can be assigned without .ref and their Ref will be taken', () => {
        const stack = new lib_1.Stack();
        const param = new lib_1.CfnParameter(stack, 'MyParam', { type: 'String' });
        expect(stack.resolve(param)).toEqual({ Ref: 'MyParam' });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJhbWV0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUF1QztBQUN2QyxpQ0FBMEM7QUFDMUMsZ0NBQTBEO0FBRTFELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLHNCQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksa0JBQVksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQy9DLE9BQU8sRUFBRSxFQUFFO1lBQ1gsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsb0JBQW9CO1NBQ2xDLENBQUMsQ0FBQztRQUVILElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXBHLE1BQU0sQ0FBQyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFVBQVUsRUFBRTtnQkFDVixvQkFBb0IsRUFBRTtvQkFDcEIsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsV0FBVyxFQUFFLG9CQUFvQjtpQkFDbEM7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLE1BQU07b0JBQ1osVUFBVSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxHQUFHLEVBQUUsc0JBQXNCLEVBQUUsRUFBRTtpQkFDbEU7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHlGQUF5RixFQUFFLEdBQUcsRUFBRTtRQUNuRyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksa0JBQVksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFckUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IENmblBhcmFtZXRlciwgQ2ZuUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3BhcmFtZXRlcicsICgpID0+IHtcbiAgdGVzdCgncGFyYW1ldGVycyBjYW4gYmUgdXNlZCBhbmQgcmVmZXJlbmNlZCB1c2luZyBwYXJhbS5yZWYnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGNoaWxkID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ0NoaWxkJyk7XG4gICAgY29uc3QgcGFyYW0gPSBuZXcgQ2ZuUGFyYW1ldGVyKGNoaWxkLCAnTXlQYXJhbScsIHtcbiAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgdHlwZTogJ0ludGVnZXInLFxuICAgICAgZGVzY3JpcHRpb246ICdNeSBmaXJzdCBwYXJhbWV0ZXInLFxuICAgIH0pO1xuXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzb3VyY2UnLCB7IHR5cGU6ICdUeXBlJywgcHJvcGVydGllczogeyBSZWZlcmVuY2VUb1BhcmFtOiBwYXJhbS52YWx1ZSB9IH0pO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgQ2hpbGRNeVBhcmFtMzE2MUJGNUQ6IHtcbiAgICAgICAgICBEZWZhdWx0OiAxMCxcbiAgICAgICAgICBUeXBlOiAnSW50ZWdlcicsXG4gICAgICAgICAgRGVzY3JpcHRpb246ICdNeSBmaXJzdCBwYXJhbWV0ZXInLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdUeXBlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7IFJlZmVyZW5jZVRvUGFyYW06IHsgUmVmOiAnQ2hpbGRNeVBhcmFtMzE2MUJGNUQnIH0gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3BhcmFtZXRlcnMgYXJlIHRva2Vucywgc28gdGhleSBjYW4gYmUgYXNzaWduZWQgd2l0aG91dCAucmVmIGFuZCB0aGVpciBSZWYgd2lsbCBiZSB0YWtlbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBhcmFtID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ015UGFyYW0nLCB7IHR5cGU6ICdTdHJpbmcnIH0pO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocGFyYW0pKS50b0VxdWFsKHsgUmVmOiAnTXlQYXJhbScgfSk7XG4gIH0pO1xufSk7XG4iXX0=