"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path_1 = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_s3_assets_1 = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('codecommit', () => {
    describe('CodeCommit Repositories', () => {
        test('add an SNS trigger to repository', () => {
            const stack = new core_1.Stack();
            const props = {
                repositoryName: 'MyRepository',
            };
            const snsArn = 'arn:aws:sns:*:123456789012:my_topic';
            new lib_1.Repository(stack, 'MyRepository', props).notify(snsArn);
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyRepository4C4BD5FC: {
                        Type: 'AWS::CodeCommit::Repository',
                        Properties: {
                            RepositoryName: 'MyRepository',
                            Triggers: [
                                {
                                    Events: [
                                        'all',
                                    ],
                                    DestinationArn: 'arn:aws:sns:*:123456789012:my_topic',
                                    Name: 'Default/MyRepository/arn:aws:sns:*:123456789012:my_topic',
                                },
                            ],
                        },
                    },
                },
            });
        });
        test('fails when triggers have duplicate names', () => {
            const stack = new core_1.Stack();
            const myRepository = new lib_1.Repository(stack, 'MyRepository', {
                repositoryName: 'MyRepository',
            }).notify('myTrigger');
            expect(() => myRepository.notify('myTrigger')).toThrow();
        });
        test('can be imported using a Repository ARN', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const repositoryArn = 'arn:aws:codecommit:us-east-1:585695036304:my-repo';
            // WHEN
            const repo = lib_1.Repository.fromRepositoryArn(stack, 'ImportedRepo', repositoryArn);
            // THEN
            expect(stack.resolve(repo.repositoryArn)).toEqual(repositoryArn);
            expect(stack.resolve(repo.repositoryName)).toEqual('my-repo');
        });
        test('Repository can be initialized with contents from a ZIP file', () => {
            // GIVEN
            const app = new core_1.App();
            const stack = new core_1.Stack(app, 'MyStack');
            // WHEN
            new lib_1.Repository(stack, 'Repository', {
                repositoryName: 'MyRepositoryName',
                code: lib_1.Code.fromZipFile(path_1.join(__dirname, 'asset-test.zip')),
            });
            const assembly = app.synth();
            const assets = JSON.parse(fs.readFileSync(path_1.join(assembly.directory, `${stack.stackName}.assets.json`), 'utf-8'));
            // our asset + the template itself
            expect(Object.entries(assets.files)).toHaveLength(2);
        });
        test('Repository can be initialized with contents from a directory', () => {
            // GIVEN
            const app = new core_1.App();
            const stack = new core_1.Stack(app, 'MyStack');
            // WHEN
            new lib_1.Repository(stack, 'Repository', {
                repositoryName: 'MyRepositoryName',
                code: lib_1.Code.fromDirectory(path_1.join(__dirname, 'asset-test')),
            });
            const assembly = app.synth();
            const assets = JSON.parse(fs.readFileSync(path_1.join(assembly.directory, `${stack.stackName}.assets.json`), 'utf-8'));
            // our asset + the template itself
            expect(Object.entries(assets.files)).toHaveLength(2);
        });
        test('Repository can be initialized with contents from an asset', () => {
            // GIVEN
            const app = new core_1.App();
            const stack = new core_1.Stack(app, 'MyStack');
            const readmeAsset = new aws_s3_assets_1.Asset(stack, 'ReadmeAsset', {
                path: path_1.join(__dirname, 'asset-test'),
            });
            // WHEN
            new lib_1.Repository(stack, 'Repository', {
                repositoryName: 'MyRepositoryName',
                code: lib_1.Code.fromAsset(readmeAsset),
            });
            // THEN
            const assembly = app.synth();
            const assets = JSON.parse(fs.readFileSync(path_1.join(assembly.directory, `${stack.stackName}.assets.json`), 'utf-8'));
            // our asset + the template itself
            expect(Object.entries(assets.files)).toHaveLength(2);
        });
        test('Repository throws Error when initialized with file while expecting directory', () => {
            // GIVEN
            const app = new core_1.App();
            const stack = new core_1.Stack(app, 'MyStack');
            const filePath = path_1.join(__dirname, 'asset-test/test.md');
            // THEN
            expect(() => {
                new lib_1.Repository(stack, 'Repository', {
                    repositoryName: 'MyRepositoryName',
                    code: lib_1.Code.fromDirectory(filePath),
                });
            }).toThrow(`'${filePath}' needs to be a path to a directory (resolved to: '${path_1.resolve(filePath)}')`);
        });
        test('Repository throws Error when initialized with directory while expecting file', () => {
            // GIVEN
            const app = new core_1.App();
            const stack = new core_1.Stack(app, 'MyStack');
            const dirPath = path_1.join(__dirname, 'asset-test/');
            // THEN
            expect(() => {
                new lib_1.Repository(stack, 'Repository', {
                    repositoryName: 'MyRepositoryName',
                    code: lib_1.Code.fromZipFile(dirPath),
                });
            }).toThrow(`'${dirPath}' needs to be a path to a ZIP file (resolved to: '${path_1.resolve(dirPath)}')`);
        });
        /**
         * Fix for https://github.com/aws/aws-cdk/issues/10630
         */
        test('can be imported using a Repository ARN and respect the region in clone urls', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const repositoryArn = 'arn:aws:codecommit:us-west-2:585695036304:my-repo';
            // WHEN
            const repo = lib_1.Repository.fromRepositoryArn(stack, 'ImportedRepo', repositoryArn);
            // THEN
            // a fully qualified arn should use the region from the arn
            expect(stack.resolve(repo.repositoryCloneUrlHttp)).toEqual({
                'Fn::Join': [
                    '',
                    [
                        'https://git-codecommit.us-west-2.',
                        { Ref: 'AWS::URLSuffix' },
                        '/v1/repos/my-repo',
                    ],
                ],
            });
            expect(stack.resolve(repo.repositoryCloneUrlSsh)).toEqual({
                'Fn::Join': [
                    '',
                    [
                        'ssh://git-codecommit.us-west-2.',
                        { Ref: 'AWS::URLSuffix' },
                        '/v1/repos/my-repo',
                    ],
                ],
            });
            expect(stack.resolve(repo.repositoryCloneUrlGrc)).toEqual('codecommit::us-west-2://my-repo');
            expect(repo.env.account).toEqual('585695036304');
            expect(repo.env.region).toEqual('us-west-2');
        });
        test('can be imported using just a Repository name (the ARN is deduced)', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            const repo = lib_1.Repository.fromRepositoryName(stack, 'ImportedRepo', 'my-repo');
            // THEN
            expect(stack.resolve(repo.repositoryArn)).toEqual({
                'Fn::Join': ['', [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':codecommit:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':my-repo',
                    ]],
            });
            expect(stack.resolve(repo.repositoryName)).toEqual('my-repo');
            //local name resolution should use stack region
            expect(stack.resolve(repo.repositoryCloneUrlHttp)).toEqual({
                'Fn::Join': [
                    '',
                    [
                        'https://git-codecommit.',
                        { Ref: 'AWS::Region' },
                        '.',
                        { Ref: 'AWS::URLSuffix' },
                        '/v1/repos/my-repo',
                    ],
                ],
            });
            expect(stack.resolve(repo.repositoryCloneUrlGrc)).toEqual({
                'Fn::Join': [
                    '',
                    [
                        'codecommit::',
                        { Ref: 'AWS::Region' },
                        '://my-repo',
                    ],
                ],
            });
        });
        test('grant push', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const repository = new lib_1.Repository(stack, 'Repo', {
                repositoryName: 'repo-name',
            });
            const role = new aws_iam_1.Role(stack, 'Role', {
                assumedBy: new aws_iam_1.ServicePrincipal('ec2.amazonaws.com'),
            });
            // WHEN
            repository.grantPullPush(role);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'codecommit:GitPull',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'Repo02AC86CF',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: 'codecommit:GitPush',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'Repo02AC86CF',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('HTTPS (GRC) clone URL', () => {
            const stack = new core_1.Stack();
            const repository = new lib_1.Repository(stack, 'Repository', {
                repositoryName: 'my-repo',
            });
            expect(stack.resolve(repository.repositoryCloneUrlGrc)).toEqual({
                'Fn::Join': [
                    '',
                    [
                        'codecommit::',
                        { Ref: 'AWS::Region' },
                        '://',
                        { 'Fn::GetAtt': ['Repository22E53BBD', 'Name'] },
                    ],
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWNvbW1pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZWNvbW1pdC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLCtCQUFxQztBQUNyQyxvREFBK0M7QUFDL0MsOENBQTBEO0FBQzFELDBEQUErQztBQUMvQyx3Q0FBMkM7QUFDM0MsZ0NBQTJEO0FBRTNELFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLE1BQU0sS0FBSyxHQUFvQjtnQkFDN0IsY0FBYyxFQUFFLGNBQWM7YUFDL0IsQ0FBQztZQUVGLE1BQU0sTUFBTSxHQUFHLHFDQUFxQyxDQUFDO1lBRXJELElBQUksZ0JBQVUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1RCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7Z0JBQ3hDLFNBQVMsRUFBRTtvQkFDVCxvQkFBb0IsRUFBRTt3QkFDcEIsSUFBSSxFQUFFLDZCQUE2Qjt3QkFDbkMsVUFBVSxFQUFFOzRCQUNWLGNBQWMsRUFBRSxjQUFjOzRCQUM5QixRQUFRLEVBQUU7Z0NBQ1I7b0NBQ0UsTUFBTSxFQUFFO3dDQUNOLEtBQUs7cUNBQ047b0NBQ0QsY0FBYyxFQUFFLHFDQUFxQztvQ0FDckQsSUFBSSxFQUFFLDBEQUEwRDtpQ0FDakU7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsTUFBTSxLQUFLLEdB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QUFDO1FBR0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxnQkFBVSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7Z0JBQ3JELGNBQWMsRUFBRSxTQUFTO2FBQzFCLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5RCxVQUFVLEVBQUU7b0JBQ1YsRUFBRTtvQkFDRjt3QkFDRSxjQUFjO3dCQUNkLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRTt3QkFDdEIsS0FBSzt3QkFDTCxFQUFFLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxFQUFFO3FCQUNqRDtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUdMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IGpvaW4sIHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMy1hc3NldHMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29kZSwgUmVwb3NpdG9yeSwgUmVwb3NpdG9yeVByb3BzIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2NvZGVjb21taXQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdDb2RlQ29tbWl0IFJlcG9zaXRvcmllcycsICgpID0+IHtcbiAgICB0ZXN0KCdhZGQgYW4gU05TIHRyaWdnZXIgdG8gcmVwb3NpdG9yeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHByb3BzOiBSZXBvc2l0b3J5UHJvcHMgPSB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnTXlSZXBvc2l0b3J5JyxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHNuc0FybiA9ICdhcm46YXdzOnNuczoqOjEyMzQ1Njc4OTAxMjpteV90b3BpYyc7XG5cbiAgICAgIG5ldyBSZXBvc2l0b3J5KHN0YWNrLCAnTXlSZXBvc2l0b3J5JywgcHJvcHMpLm5vdGlmeShzbnNBcm4pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgIE15UmVwb3NpdG9yeTRDNEJENUZDOiB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpDb2RlQ29tbWl0OjpSZXBvc2l0b3J5JyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgUmVwb3NpdG9yeU5hbWU6ICdNeVJlcG9zaXRvcnknLFxuICAgICAgICAgICAgICBUcmlnZ2VyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEV2ZW50czogW1xuICAgICAgICAgICAgICAgICAgICAnYWxsJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBEZXN0aW5hdGlvbkFybjogJ2Fybjphd3M6c25zOio6MTIzNDU2Nzg5MDEyOm15X3RvcGljJyxcbiAgICAgICAgICAgICAgICAgIE5hbWU6ICdEZWZhdWx0L015UmVwb3NpdG9yeS9hcm46YXdzOnNuczoqOjEyMzQ1Njc4OTAxMjpteV90b3BpYycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIHdoZW4gdHJpZ2dlcnMgaGF2ZSBkdXBsaWNhdGUgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCBteVJlcG9zaXRvcnkgPSBuZXcgUmVwb3NpdG9yeShzdGFjaywgJ015UmVwb3NpdG9yeScsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdNeVJlcG9zaXRvcnknLFxuICAgICAgfSkubm90aWZ5KCdteVRyaWdnZXInKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG15UmVwb3NpdG9yeS5ub3RpZnkoJ215VHJpZ2dlcicpKS50b1Rocm93KCk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIGltcG9ydGVkIHVzaW5nIGEgUmVwb3NpdG9yeSBBUk4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG9zaXRvcnlBcm4gPSAnYXJuOmF3czpjb2RlY29tbWl0OnVzLWVhc3QtMTo1ODU2OTUwMzYzMDQ6bXktcmVwbyc7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHJlcG8gPSBSZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5QXJuKHN0YWNrLCAnSW1wb3J0ZWRSZXBvJywgcmVwb3NpdG9yeUFybik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeUFybikpLnRvRXF1YWwocmVwb3NpdG9yeUFybik7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShyZXBvLnJlcG9zaXRvcnlOYW1lKSkudG9FcXVhbCgnbXktcmVwbycpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ1JlcG9zaXRvcnkgY2FuIGJlIGluaXRpYWxpemVkIHdpdGggY29udGVudHMgZnJvbSBhIFpJUCBmaWxlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFJlcG9zaXRvcnkoc3RhY2ssICdSZXBvc2l0b3J5Jywge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ015UmVwb3NpdG9yeU5hbWUnLFxuICAgICAgICBjb2RlOiBDb2RlLmZyb21aaXBGaWxlKGpvaW4oX19kaXJuYW1lLCAnYXNzZXQtdGVzdC56aXAnKSksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IGFzc2V0cyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCBgJHtzdGFjay5zdGFja05hbWV9LmFzc2V0cy5qc29uYCksICd1dGYtOCcpKTtcblxuICAgICAgLy8gb3VyIGFzc2V0ICsgdGhlIHRlbXBsYXRlIGl0c2VsZlxuICAgICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKGFzc2V0cy5maWxlcykpLnRvSGF2ZUxlbmd0aCgyKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1JlcG9zaXRvcnkgY2FuIGJlIGluaXRpYWxpemVkIHdpdGggY29udGVudHMgZnJvbSBhIGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBSZXBvc2l0b3J5KHN0YWNrLCAnUmVwb3NpdG9yeScsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdNeVJlcG9zaXRvcnlOYW1lJyxcbiAgICAgICAgY29kZTogQ29kZS5mcm9tRGlyZWN0b3J5KGpvaW4oX19kaXJuYW1lLCAnYXNzZXQtdGVzdCcpKSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgYXNzZXRzID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoam9pbihhc3NlbWJseS5kaXJlY3RvcnksIGAke3N0YWNrLnN0YWNrTmFtZX0uYXNzZXRzLmpzb25gKSwgJ3V0Zi04JykpO1xuXG4gICAgICAvLyBvdXIgYXNzZXQgKyB0aGUgdGVtcGxhdGUgaXRzZWxmXG4gICAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMoYXNzZXRzLmZpbGVzKSkudG9IYXZlTGVuZ3RoKDIpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnUmVwb3NpdG9yeSBjYW4gYmUgaW5pdGlhbGl6ZWQgd2l0aCBjb250ZW50cyBmcm9tIGFuIGFzc2V0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgICAgY29uc3QgcmVhZG1lQXNzZXQgPSBuZXcgQXNzZXQoc3RhY2ssICdSZWFkbWVBc3NldCcsIHtcbiAgICAgICAgcGF0aDogam9pbihfX2Rpcm5hbWUsICdhc3NldC10ZXN0JyksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFJlcG9zaXRvcnkoc3RhY2ssICdSZXBvc2l0b3J5Jywge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ015UmVwb3NpdG9yeU5hbWUnLFxuICAgICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChyZWFkbWVBc3NldCksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IGFzc2V0cyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCBgJHtzdGFjay5zdGFja05hbWV9LmFzc2V0cy5qc29uYCksICd1dGYtOCcpKTtcblxuICAgICAgLy8gb3VyIGFzc2V0ICsgdGhlIHRlbXBsYXRlIGl0c2VsZlxuICAgICAgZXhwZWN0KE9iamVjdC5lbnRyaWVzKGFzc2V0cy5maWxlcykpLnRvSGF2ZUxlbmd0aCgyKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1JlcG9zaXRvcnkgdGhyb3dzIEVycm9yIHdoZW4gaW5pdGlhbGl6ZWQgd2l0aCBmaWxlIHdoaWxlIGV4cGVjdGluZyBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgICAgY29uc3QgZmlsZVBhdGggPSBqb2luKF9fZGlybmFtZSwgJ2Fzc2V0LXRlc3QvdGVzdC5tZCcpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgUmVwb3NpdG9yeShzdGFjaywgJ1JlcG9zaXRvcnknLCB7XG4gICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdNeVJlcG9zaXRvcnlOYW1lJyxcbiAgICAgICAgICBjb2RlOiBDb2RlLmZyb21EaXJlY3RvcnkoZmlsZVBhdGgpLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coYCcke2ZpbGVQYXRofScgbmVlZHMgdG8gYmUgYSBwYXRoIHRvIGEgZGlyZWN0b3J5IChyZXNvbHZlZCB0bzogJyR7cmVzb2x2ZShmaWxlUGF0aCl9JylgKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1JlcG9zaXRvcnkgdGhyb3dzIEVycm9yIHdoZW4gaW5pdGlhbGl6ZWQgd2l0aCBkaXJlY3Rvcnkgd2hpbGUgZXhwZWN0aW5nIGZpbGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgICBjb25zdCBkaXJQYXRoID0gam9pbihfX2Rpcm5hbWUsICdhc3NldC10ZXN0LycpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgUmVwb3NpdG9yeShzdGFjaywgJ1JlcG9zaXRvcnknLCB7XG4gICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdNeVJlcG9zaXRvcnlOYW1lJyxcbiAgICAgICAgICBjb2RlOiBDb2RlLmZyb21aaXBGaWxlKGRpclBhdGgpLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coYCcke2RpclBhdGh9JyBuZWVkcyB0byBiZSBhIHBhdGggdG8gYSBaSVAgZmlsZSAocmVzb2x2ZWQgdG86ICcke3Jlc29sdmUoZGlyUGF0aCl9JylgKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEZpeCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xMDYzMFxuICAgICAqL1xuICAgIHRlc3QoJ2NhbiBiZSBpbXBvcnRlZCB1c2luZyBhIFJlcG9zaXRvcnkgQVJOIGFuZCByZXNwZWN0IHRoZSByZWdpb24gaW4gY2xvbmUgdXJscycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcmVwb3NpdG9yeUFybiA9ICdhcm46YXdzOmNvZGVjb21taXQ6dXMtd2VzdC0yOjU4NTY5NTAzNjMwNDpteS1yZXBvJztcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcmVwbyA9IFJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlBcm4oc3RhY2ssICdJbXBvcnRlZFJlcG8nLCByZXBvc2l0b3J5QXJuKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgLy8gYSBmdWxseSBxdWFsaWZpZWQgYXJuIHNob3VsZCB1c2UgdGhlIHJlZ2lvbiBmcm9tIHRoZSBhcm5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeUNsb25lVXJsSHR0cCkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0LWNvZGVjb21taXQudXMtd2VzdC0yLicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgJy92MS9yZXBvcy9teS1yZXBvJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeUNsb25lVXJsU3NoKSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnc3NoOi8vZ2l0LWNvZGVjb21taXQudXMtd2VzdC0yLicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgJy92MS9yZXBvcy9teS1yZXBvJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeUNsb25lVXJsR3JjKSkudG9FcXVhbCgnY29kZWNvbW1pdDo6dXMtd2VzdC0yOi8vbXktcmVwbycpO1xuXG4gICAgICBleHBlY3QocmVwby5lbnYuYWNjb3VudCkudG9FcXVhbCgnNTg1Njk1MDM2MzA0Jyk7XG4gICAgICBleHBlY3QocmVwby5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgaW1wb3J0ZWQgdXNpbmcganVzdCBhIFJlcG9zaXRvcnkgbmFtZSAodGhlIEFSTiBpcyBkZWR1Y2VkKScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCByZXBvID0gUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUoc3RhY2ssICdJbXBvcnRlZFJlcG8nLCAnbXktcmVwbycpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShyZXBvLnJlcG9zaXRvcnlBcm4pKS50b0VxdWFsKHtcbiAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgJ2FybjonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgJzpjb2RlY29tbWl0OicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAnOm15LXJlcG8nLFxuICAgICAgICBdXSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocmVwby5yZXBvc2l0b3J5TmFtZSkpLnRvRXF1YWwoJ215LXJlcG8nKTtcblxuICAgICAgLy9sb2NhbCBuYW1lIHJlc29sdXRpb24gc2hvdWxkIHVzZSBzdGFjayByZWdpb25cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeUNsb25lVXJsSHR0cCkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2h0dHBzOi8vZ2l0LWNvZGVjb21taXQuJyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAnLicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgJy92MS9yZXBvcy9teS1yZXBvJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlcG8ucmVwb3NpdG9yeUNsb25lVXJsR3JjKSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnY29kZWNvbW1pdDo6JyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAnOi8vbXktcmVwbycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2dyYW50IHB1c2gnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwby1uYW1lJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICByZXBvc2l0b3J5LmdyYW50UHVsbFB1c2gocm9sZSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdjb2RlY29tbWl0OkdpdFB1bGwnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnUmVwbzAyQUM4NkNGJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdjb2RlY29tbWl0OkdpdFB1c2gnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnUmVwbzAyQUM4NkNGJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnSFRUUFMgKEdSQykgY2xvbmUgVVJMJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgcmVwb3NpdG9yeSA9IG5ldyBSZXBvc2l0b3J5KHN0YWNrLCAnUmVwb3NpdG9yeScsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdteS1yZXBvJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShyZXBvc2l0b3J5LnJlcG9zaXRvcnlDbG9uZVVybEdyYykpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2NvZGVjb21taXQ6OicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgJzovLycsXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydSZXBvc2l0b3J5MjJFNTNCQkQnLCAnTmFtZSddIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==