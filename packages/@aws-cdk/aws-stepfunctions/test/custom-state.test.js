"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const sfn = require("../lib");
const render_util_1 = require("./private/render-util");
describe('Custom State', () => {
    let stack;
    let stateJson;
    beforeEach(() => {
        // GIVEN
        stack = new cdk.Stack();
        stateJson = {
            Type: 'Task',
            Resource: 'arn:aws:states:::dynamodb:putItem',
            Parameters: {
                TableName: 'MyTable',
                Item: {
                    id: {
                        S: 'MyEntry',
                    },
                },
            },
            ResultPath: null,
        };
    });
    test('maintains the state Json provided during construction', () => {
        // WHEN
        const customState = new sfn.CustomState(stack, 'Custom', {
            stateJson,
        });
        // THEN
        expect(customState.toStateJson()).toStrictEqual({
            ...stateJson,
            End: true,
        });
    });
    test('can add a next state to the chain', () => {
        // WHEN
        const definition = new sfn.CustomState(stack, 'Custom', {
            stateJson,
        }).next(new sfn.Pass(stack, 'MyPass'));
        // THEN
        expect(render_util_1.render(stack, definition)).toStrictEqual({
            StartAt: 'Custom',
            States: {
                Custom: {
                    Next: 'MyPass',
                    Type: 'Task',
                    Resource: 'arn:aws:states:::dynamodb:putItem',
                    Parameters: {
                        TableName: 'MyTable',
                        Item: {
                            id: {
                                S: 'MyEntry',
                            },
                        },
                    },
                    ResultPath: null,
                },
                MyPass: {
                    Type: 'Pass',
                    End: true,
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXN0YXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tc3RhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsdURBQStDO0FBRS9DLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLElBQUksS0FBZ0IsQ0FBQztJQUNyQixJQUFJLFNBQWMsQ0FBQztJQUVuQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsUUFBUTtRQUNSLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixTQUFTLEdBQUc7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxtQ0FBbUM7WUFDN0MsVUFBVSxFQUFFO2dCQUNWLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixJQUFJLEVBQUU7b0JBQ0osRUFBRSxFQUFFO3dCQUNGLENBQUMsRUFBRSxTQUFTO3FCQUNiO2lCQUNGO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1FBQ2pFLE9BQU87UUFDUCxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN2RCxTQUFTO1NBQ1YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDOUMsR0FBRyxTQUFTO1lBQ1osR0FBRyxFQUFFLElBQUk7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7UUFDN0MsT0FBTztRQUNQLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ3RELFNBQVM7U0FDVixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUV2QyxPQUFPO1FBQ1AsTUFBTSxDQUFDLG9CQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUM3QztZQUNFLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7b0JBQ2QsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLG1DQUFtQztvQkFDN0MsVUFBVSxFQUFFO3dCQUNWLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixJQUFJLEVBQUU7NEJBQ0osRUFBRSxFQUFFO2dDQUNGLENBQUMsRUFBRSxTQUFTOzZCQUNiO3lCQUNGO3FCQUNGO29CQUNELFVBQVUsRUFBRSxJQUFJO2lCQUNqQjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLE1BQU07b0JBQ1osR0FBRyxFQUFFLElBQUk7aUJBQ1Y7YUFDRjtTQUNGLENBQ0YsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzZm4gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJy4vcHJpdmF0ZS9yZW5kZXItdXRpbCc7XG5cbmRlc2NyaWJlKCdDdXN0b20gU3RhdGUnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICBsZXQgc3RhdGVKc29uOiBhbnk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBzdGF0ZUpzb24gPSB7XG4gICAgICBUeXBlOiAnVGFzaycsXG4gICAgICBSZXNvdXJjZTogJ2Fybjphd3M6c3RhdGVzOjo6ZHluYW1vZGI6cHV0SXRlbScsXG4gICAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIFRhYmxlTmFtZTogJ015VGFibGUnLFxuICAgICAgICBJdGVtOiB7XG4gICAgICAgICAgaWQ6IHtcbiAgICAgICAgICAgIFM6ICdNeUVudHJ5JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFJlc3VsdFBhdGg6IG51bGwsXG4gICAgfTtcbiAgfSk7XG5cbiAgdGVzdCgnbWFpbnRhaW5zIHRoZSBzdGF0ZSBKc29uIHByb3ZpZGVkIGR1cmluZyBjb25zdHJ1Y3Rpb24nLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGN1c3RvbVN0YXRlID0gbmV3IHNmbi5DdXN0b21TdGF0ZShzdGFjaywgJ0N1c3RvbScsIHtcbiAgICAgIHN0YXRlSnNvbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoY3VzdG9tU3RhdGUudG9TdGF0ZUpzb24oKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICAuLi5zdGF0ZUpzb24sXG4gICAgICBFbmQ6IHRydWUsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgYSBuZXh0IHN0YXRlIHRvIHRoZSBjaGFpbicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IG5ldyBzZm4uQ3VzdG9tU3RhdGUoc3RhY2ssICdDdXN0b20nLCB7XG4gICAgICBzdGF0ZUpzb24sXG4gICAgfSkubmV4dChuZXcgc2ZuLlBhc3Moc3RhY2ssICdNeVBhc3MnKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcihzdGFjaywgZGVmaW5pdGlvbikpLnRvU3RyaWN0RXF1YWwoXG4gICAgICB7XG4gICAgICAgIFN0YXJ0QXQ6ICdDdXN0b20nLFxuICAgICAgICBTdGF0ZXM6IHtcbiAgICAgICAgICBDdXN0b206IHtcbiAgICAgICAgICAgIE5leHQ6ICdNeVBhc3MnLFxuICAgICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOnN0YXRlczo6OmR5bmFtb2RiOnB1dEl0ZW0nLFxuICAgICAgICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBUYWJsZU5hbWU6ICdNeVRhYmxlJyxcbiAgICAgICAgICAgICAgSXRlbToge1xuICAgICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgICBTOiAnTXlFbnRyeScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXN1bHRQYXRoOiBudWxsLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTXlQYXNzOiB7XG4gICAgICAgICAgICBUeXBlOiAnUGFzcycsXG4gICAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG59KTsiXX0=