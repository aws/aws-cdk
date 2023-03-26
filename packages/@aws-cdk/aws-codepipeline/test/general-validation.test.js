"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const artifact_1 = require("../lib/artifact");
const pipeline_1 = require("../lib/pipeline");
const validation_1 = require("../lib/private/validation");
const fake_source_action_1 = require("./fake-source-action");
describe('general validation', () => {
    test('name validation', () => {
        const cases = [
            { name: 'BlahBleep123.@-_', shouldPassValidation: true, explanation: 'should be valid' },
            { name: '', shouldPassValidation: false, explanation: 'the empty string should be invalid' },
            { name: ' BlahBleep', shouldPassValidation: false, explanation: 'spaces should be invalid' },
            { name: '!BlahBleep', shouldPassValidation: false, explanation: '\'!\' should be invalid' },
        ];
        cases.forEach(testCase => {
            const name = testCase.name;
            const validationBlock = () => { validation_1.validateName('test thing', name); };
            if (testCase.shouldPassValidation) {
                expect(validationBlock).not.toThrow();
            }
            else {
                expect(validationBlock).toThrow();
            }
        });
    });
    describe('Stage validation', () => {
        test('should fail if Stage has no Actions', () => {
            const stage = stageForTesting();
            expect(stage.validate().length).toEqual(1);
        });
    });
    describe('Pipeline validation', () => {
        test('should fail if Pipeline has no Stages', () => {
            const stack = new cdk.Stack();
            const pipeline = new pipeline_1.Pipeline(stack, 'Pipeline');
            expect(pipeline.node.validate().length).toEqual(1);
        });
        test('should fail if Pipeline has a Source Action in a non-first Stage', () => {
            const stack = new cdk.Stack();
            const pipeline = new pipeline_1.Pipeline(stack, 'Pipeline');
            pipeline.addStage({
                stageName: 'FirstStage',
                actions: [
                    new fake_source_action_1.FakeSourceAction({
                        actionName: 'FakeSource',
                        output: new artifact_1.Artifact(),
                    }),
                ],
            });
            expect(pipeline.node.validate().length).toEqual(1);
        });
    });
});
function stageForTesting() {
    const stack = new cdk.Stack();
    const pipeline = new pipeline_1.Pipeline(stack, 'Pipeline');
    return pipeline.addStage({ stageName: 'stage' });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbC12YWxpZGF0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZW5lcmFsLXZhbGlkYXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUVyQyw4Q0FBMkM7QUFDM0MsOENBQTJDO0FBQzNDLDBEQUF5RDtBQUN6RCw2REFBd0Q7QUFReEQsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzNCLE1BQU0sS0FBSyxHQUE2QjtZQUN0QyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFO1lBQ3hGLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLG9DQUFvQyxFQUFFO1lBQzVGLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLDBCQUEwQixFQUFFO1lBQzVGLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLHlCQUF5QixFQUFFO1NBQzVGLENBQUM7UUFFRixLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDM0IsTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFLEdBQUcseUJBQVksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxRQUFRLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ2pDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDdkM7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxNQUFNLEtBQUssR0FBRyxlQUFlLEVBQUUsQ0FBQztZQUVoQyxNQUFNLENBQUUsS0FBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUNuQyxJQUFJLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQ2pELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFakQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsRUFBRTtZQUM1RSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRWpELFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hCLFNBQVMsRUFBRSxZQUFZO2dCQUN2QixPQUFPLEVBQUU7b0JBQ1AsSUFBSSxxQ0FBZ0IsQ0FBQzt3QkFDbkIsVUFBVSxFQUFFLFlBQVk7d0JBQ3hCLE1BQU0sRUFBRSxJQUFJLG1CQUFRLEVBQUU7cUJBQ3ZCLENBQUM7aUJBQ0g7YUFDRixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxlQUFlO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakQsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElTdGFnZSB9IGZyb20gJy4uL2xpYi9hY3Rpb24nO1xuaW1wb3J0IHsgQXJ0aWZhY3QgfSBmcm9tICcuLi9saWIvYXJ0aWZhY3QnO1xuaW1wb3J0IHsgUGlwZWxpbmUgfSBmcm9tICcuLi9saWIvcGlwZWxpbmUnO1xuaW1wb3J0IHsgdmFsaWRhdGVOYW1lIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvdmFsaWRhdGlvbic7XG5pbXBvcnQgeyBGYWtlU291cmNlQWN0aW9uIH0gZnJvbSAnLi9mYWtlLXNvdXJjZS1hY3Rpb24nO1xuXG5pbnRlcmZhY2UgTmFtZVZhbGlkYXRpb25UZXN0Q2FzZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgc2hvdWxkUGFzc1ZhbGlkYXRpb246IGJvb2xlYW47XG4gIGV4cGxhbmF0aW9uOiBzdHJpbmc7XG59XG5cbmRlc2NyaWJlKCdnZW5lcmFsIHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ25hbWUgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBjYXNlczogTmFtZVZhbGlkYXRpb25UZXN0Q2FzZVtdID0gW1xuICAgICAgeyBuYW1lOiAnQmxhaEJsZWVwMTIzLkAtXycsIHNob3VsZFBhc3NWYWxpZGF0aW9uOiB0cnVlLCBleHBsYW5hdGlvbjogJ3Nob3VsZCBiZSB2YWxpZCcgfSxcbiAgICAgIHsgbmFtZTogJycsIHNob3VsZFBhc3NWYWxpZGF0aW9uOiBmYWxzZSwgZXhwbGFuYXRpb246ICd0aGUgZW1wdHkgc3RyaW5nIHNob3VsZCBiZSBpbnZhbGlkJyB9LFxuICAgICAgeyBuYW1lOiAnIEJsYWhCbGVlcCcsIHNob3VsZFBhc3NWYWxpZGF0aW9uOiBmYWxzZSwgZXhwbGFuYXRpb246ICdzcGFjZXMgc2hvdWxkIGJlIGludmFsaWQnIH0sXG4gICAgICB7IG5hbWU6ICchQmxhaEJsZWVwJywgc2hvdWxkUGFzc1ZhbGlkYXRpb246IGZhbHNlLCBleHBsYW5hdGlvbjogJ1xcJyFcXCcgc2hvdWxkIGJlIGludmFsaWQnIH0sXG4gICAgXTtcblxuICAgIGNhc2VzLmZvckVhY2godGVzdENhc2UgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IHRlc3RDYXNlLm5hbWU7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uQmxvY2sgPSAoKSA9PiB7IHZhbGlkYXRlTmFtZSgndGVzdCB0aGluZycsIG5hbWUpOyB9O1xuICAgICAgaWYgKHRlc3RDYXNlLnNob3VsZFBhc3NWYWxpZGF0aW9uKSB7XG4gICAgICAgIGV4cGVjdCh2YWxpZGF0aW9uQmxvY2spLm5vdC50b1Rocm93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBlY3QodmFsaWRhdGlvbkJsb2NrKS50b1Rocm93KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdTdGFnZSB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ3Nob3VsZCBmYWlsIGlmIFN0YWdlIGhhcyBubyBBY3Rpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhZ2UgPSBzdGFnZUZvclRlc3RpbmcoKTtcblxuICAgICAgZXhwZWN0KChzdGFnZSBhcyBhbnkpLnZhbGlkYXRlKCkubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnUGlwZWxpbmUgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdzaG91bGQgZmFpbCBpZiBQaXBlbGluZSBoYXMgbm8gU3RhZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBQaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG5cbiAgICAgIGV4cGVjdChwaXBlbGluZS5ub2RlLnZhbGlkYXRlKCkubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2hvdWxkIGZhaWwgaWYgUGlwZWxpbmUgaGFzIGEgU291cmNlIEFjdGlvbiBpbiBhIG5vbi1maXJzdCBTdGFnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScpO1xuXG4gICAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICAgIHN0YWdlTmFtZTogJ0ZpcnN0U3RhZ2UnLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0Zha2VTb3VyY2UnLFxuICAgICAgICAgICAgb3V0cHV0OiBuZXcgQXJ0aWZhY3QoKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QocGlwZWxpbmUubm9kZS52YWxpZGF0ZSgpLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gc3RhZ2VGb3JUZXN0aW5nKCk6IElTdGFnZSB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBwaXBlbGluZSA9IG5ldyBQaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG4gIHJldHVybiBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ3N0YWdlJyB9KTtcbn1cbiJdfQ==