"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('lambda platform', () => {
    test('can choose lambda architecture arm64', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'stack');
        // WHEN
        new lib_1.DockerImageFunction(stack, 'Lambda', {
            code: lib_1.DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-arm64-handler')),
            architecture: lib_1.Architecture.ARM_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Architectures: [
                'arm64',
            ],
        });
    });
    test('can choose lambda architecture x86_64', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'stack');
        // WHEN
        new lib_1.DockerImageFunction(stack, 'Lambda', {
            code: lib_1.DockerImageCode.fromImageAsset(path.join(__dirname, 'docker-arm64-handler')),
            architecture: lib_1.Architecture.X86_64,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Architectures: [
                'x86_64',
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLXBsYXRmb3JtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEtcGxhdGZvcm0udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QixvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLGdDQUE0RTtBQUU1RSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDaEQsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUMsT0FBTztRQUNQLElBQUkseUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN2QyxJQUFJLEVBQUUscUJBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztZQUNsRixZQUFZLEVBQUUsa0JBQVksQ0FBQyxNQUFNO1NBQ2xDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtZQUN2RSxhQUFhLEVBQUU7Z0JBQ2IsT0FBTzthQUNSO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLE9BQU87UUFDUCxJQUFJLHlCQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdkMsSUFBSSxFQUFFLHFCQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFDbEYsWUFBWSxFQUFFLGtCQUFZLENBQUMsTUFBTTtTQUNsQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7WUFDdkUsYUFBYSxFQUFFO2dCQUNiLFFBQVE7YUFDVDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFyY2hpdGVjdHVyZSwgRG9ja2VySW1hZ2VDb2RlLCBEb2NrZXJJbWFnZUZ1bmN0aW9uIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2xhbWJkYSBwbGF0Zm9ybScsICgpID0+IHtcbiAgdGVzdCgnY2FuIGNob29zZSBsYW1iZGEgYXJjaGl0ZWN0dXJlIGFybTY0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnc3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgRG9ja2VySW1hZ2VGdW5jdGlvbihzdGFjaywgJ0xhbWJkYScsIHtcbiAgICAgIGNvZGU6IERvY2tlckltYWdlQ29kZS5mcm9tSW1hZ2VBc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnZG9ja2VyLWFybTY0LWhhbmRsZXInKSksXG4gICAgICBhcmNoaXRlY3R1cmU6IEFyY2hpdGVjdHVyZS5BUk1fNjQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsIHtcbiAgICAgIEFyY2hpdGVjdHVyZXM6IFtcbiAgICAgICAgJ2FybTY0JyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBjaG9vc2UgbGFtYmRhIGFyY2hpdGVjdHVyZSB4ODZfNjQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBEb2NrZXJJbWFnZUZ1bmN0aW9uKHN0YWNrLCAnTGFtYmRhJywge1xuICAgICAgY29kZTogRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdkb2NrZXItYXJtNjQtaGFuZGxlcicpKSxcbiAgICAgIGFyY2hpdGVjdHVyZTogQXJjaGl0ZWN0dXJlLlg4Nl82NCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgQXJjaGl0ZWN0dXJlczogW1xuICAgICAgICAneDg2XzY0JyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=