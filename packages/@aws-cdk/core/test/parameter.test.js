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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYW1ldGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJhbWV0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUF1QztBQUN2QyxpQ0FBMEM7QUFDMUMsZ0NBQTBEO0FBRTFELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLHNCQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksa0JBQVksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQy9DLE9BQU8sRUFBRSxFQUFFO1lBQ1gsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsb0JBQW9CO1NBQ2xDLENBQUMsQ0FBQztRQUVILElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXBHLE1BQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN0QyxVQUFVLEVBQUU7Z0JBQ1Ysb0JBQW9CLEVBQUU7b0JBQ3BCLE9BQU8sRUFBRSxFQUFFO29CQUNYLElBQUksRUFBRSxTQUFTO29CQUNmLFdBQVcsRUFBRSxvQkFBb0I7aUJBQ2xDO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxNQUFNO29CQUNaLFVBQVUsRUFBRSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFLEVBQUU7aUJBQ2xFO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5RkFBeUYsRUFBRSxHQUFHLEVBQUU7UUFDbkcsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLGtCQUFZLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDM0QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBDZm5QYXJhbWV0ZXIsIENmblJlc291cmNlLCBTdGFjayB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdwYXJhbWV0ZXInLCAoKSA9PiB7XG4gIHRlc3QoJ3BhcmFtZXRlcnMgY2FuIGJlIHVzZWQgYW5kIHJlZmVyZW5jZWQgdXNpbmcgcGFyYW0ucmVmJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBjaGlsZCA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdDaGlsZCcpO1xuICAgIGNvbnN0IHBhcmFtID0gbmV3IENmblBhcmFtZXRlcihjaGlsZCwgJ015UGFyYW0nLCB7XG4gICAgICBkZWZhdWx0OiAxMCxcbiAgICAgIHR5cGU6ICdJbnRlZ2VyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTXkgZmlyc3QgcGFyYW1ldGVyJyxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywgeyB0eXBlOiAnVHlwZScsIHByb3BlcnRpZXM6IHsgUmVmZXJlbmNlVG9QYXJhbTogcGFyYW0udmFsdWUgfSB9KTtcblxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIENoaWxkTXlQYXJhbTMxNjFCRjVEOiB7XG4gICAgICAgICAgRGVmYXVsdDogMTAsXG4gICAgICAgICAgVHlwZTogJ0ludGVnZXInLFxuICAgICAgICAgIERlc2NyaXB0aW9uOiAnTXkgZmlyc3QgcGFyYW1ldGVyJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnVHlwZScsXG4gICAgICAgICAgUHJvcGVydGllczogeyBSZWZlcmVuY2VUb1BhcmFtOiB7IFJlZjogJ0NoaWxkTXlQYXJhbTMxNjFCRjVEJyB9IH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwYXJhbWV0ZXJzIGFyZSB0b2tlbnMsIHNvIHRoZXkgY2FuIGJlIGFzc2lnbmVkIHdpdGhvdXQgLnJlZiBhbmQgdGhlaXIgUmVmIHdpbGwgYmUgdGFrZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwYXJhbSA9IG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdNeVBhcmFtJywgeyB0eXBlOiAnU3RyaW5nJyB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBhcmFtKSkudG9FcXVhbCh7IFJlZjogJ015UGFyYW0nIH0pO1xuICB9KTtcbn0pO1xuIl19