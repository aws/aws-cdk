"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('auth-token', () => {
    test('AuthorizationToken.grantRead()', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'User');
        // WHEN
        lib_1.AuthorizationToken.grantRead(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'ecr:GetAuthorizationToken',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        });
    });
    test('PublicGalleryAuthorizationToken.grantRead()', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'User');
        // WHEN
        lib_1.PublicGalleryAuthorizationToken.grantRead(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'ecr-public:GetAuthorizationToken',
                            'sts:GetServiceBearerToken',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC10b2tlbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aC10b2tlbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyx3Q0FBc0M7QUFDdEMsZ0NBQTZFO0FBRTdFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV6QyxPQUFPO1FBQ1Asd0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRW5DLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSwyQkFBMkI7d0JBQ25DLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFFBQVEsRUFBRSxHQUFHO3FCQUNkO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDdkQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV6QyxPQUFPO1FBQ1AscUNBQStCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhELE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRTs0QkFDTixrQ0FBa0M7NEJBQ2xDLDJCQUEyQjt5QkFDNUI7d0JBQ0QsTUFBTSxFQUFFLE9BQU87d0JBQ2YsUUFBUSxFQUFFLEdBQUc7cUJBQ2Q7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEF1dGhvcml6YXRpb25Ub2tlbiwgUHVibGljR2FsbGVyeUF1dGhvcml6YXRpb25Ub2tlbiB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdhdXRoLXRva2VuJywgKCkgPT4ge1xuICB0ZXN0KCdBdXRob3JpemF0aW9uVG9rZW4uZ3JhbnRSZWFkKCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgQXV0aG9yaXphdGlvblRva2VuLmdyYW50UmVhZCh1c2VyKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2VjcjpHZXRBdXRob3JpemF0aW9uVG9rZW4nLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnUHVibGljR2FsbGVyeUF1dGhvcml6YXRpb25Ub2tlbi5ncmFudFJlYWQoKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBQdWJsaWNHYWxsZXJ5QXV0aG9yaXphdGlvblRva2VuLmdyYW50UmVhZCh1c2VyKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnZWNyLXB1YmxpYzpHZXRBdXRob3JpemF0aW9uVG9rZW4nLFxuICAgICAgICAgICAgICAnc3RzOkdldFNlcnZpY2VCZWFyZXJUb2tlbicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==