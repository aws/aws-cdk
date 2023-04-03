"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as cdk from '@aws-cdk/core';
const codebuild = require("../lib");
/* eslint-disable quote-props */
/* eslint-disable quotes */
describe('Test BuildSpec merge', () => {
    test('merge two simple specs', () => {
        const lhs = codebuild.BuildSpec.fromObject({
            phases: {
                pre_build: {
                    commands: [
                        'install',
                    ],
                },
            },
        });
        const rhs = codebuild.BuildSpec.fromObject({
            phases: {
                build: {
                    commands: 'build',
                },
            },
        });
        const merged = codebuild.mergeBuildSpecs(lhs, rhs);
        expect(merged.spec).toEqual({
            phases: {
                pre_build: {
                    commands: [
                        'install',
                    ],
                },
                build: {
                    commands: [
                        'build',
                    ],
                },
            },
        });
    });
    test('merge command lists', () => {
        const lhs = codebuild.BuildSpec.fromObject({
            phases: {
                build: {
                    commands: [
                        'build1',
                    ],
                },
            },
        });
        const rhs = codebuild.BuildSpec.fromObject({
            phases: {
                build: {
                    commands: 'build2',
                },
            },
        });
        const merged = codebuild.mergeBuildSpecs(lhs, rhs);
        expect(merged.spec).toEqual({
            phases: {
                build: {
                    commands: [
                        'build1',
                        'build2',
                    ],
                },
            },
        });
    });
    test('do not merge artifacts', () => {
        const lhs = codebuild.BuildSpec.fromObject({
            phases: {
                build: {
                    commands: [
                        'build1',
                    ],
                },
            },
            artifacts: {
                'base-directory': 'subdir/cdk.out',
            },
        });
        const rhs = codebuild.BuildSpec.fromObject({
            phases: {
                build: {
                    commands: [
                        'build2',
                    ],
                },
            },
            artifacts: {
                'base-directory': 'subdir/cdk.out',
            },
        });
        expect(() => {
            codebuild.mergeBuildSpecs(lhs, rhs);
        }).toThrow();
    });
    test('merge complex example', () => {
        const cdkSpec = codebuild.BuildSpec.fromObject({
            env: {
                'variables': {
                    NPM_TOKEN: 'supersecret',
                },
            },
            phases: {
                pre_build: {
                    commands: [
                        'install1',
                    ],
                },
                build: {
                    commands: [
                        'build1',
                        'test1',
                        'cdk synth',
                    ],
                },
            },
        });
        const userSpec = codebuild.BuildSpec.fromObject({
            version: 0.2,
            env: {
                'variables': {
                    JAVA_HOME: '/usr/lib/jvm/java-8-openjdk-amd64',
                },
                'parameter-store': {
                    LOGIN_PASSWORD: '/CodeBuild/dockerLoginPassword',
                },
            },
            phases: {
                install: {
                    commands: [
                        'echo Entered the install phase...',
                        'apt-get update -y',
                        'apt-get install -y maven',
                    ],
                    finally: [
                        'echo This always runs even if the update or install command fails',
                    ],
                },
                pre_build: {
                    commands: [
                        'echo Entered the pre_build phase...',
                        'docker login -u User -p $LOGIN_PASSWORD',
                    ],
                    finally: [
                        'echo This always runs even if the login command fails',
                    ],
                },
                build: {
                    commands: [
                        'echo Entered the build phase...',
                        'echo Build started on `date`',
                        'mvn install',
                    ],
                    finally: [
                        'echo This always runs even if the install command fails',
                    ],
                },
                post_build: {
                    commands: [
                        'echo Entered the post_build phase...',
                        'echo Build completed on `date`',
                    ],
                },
            },
            reports: {
                'arn:aws:codebuild:your-region:your-aws-account-id:report-group/report-group-name-1': {
                    'files': [
                        '**/*',
                    ],
                    'base-directory': 'target/tests/reports',
                    'discard-paths': 'no',
                },
                'reportGroupCucumberJson': {
                    'files': [
                        'cucumber/target/cucumber-tests.xml',
                    ],
                    'discard-paths': 'yes',
                    'file-format': 'CUCUMBERJSON',
                },
            },
            artifacts: {
                'files': [
                    'target/messageUtil-1.0.jar',
                ],
                'discard-paths': 'yes',
                'secondary-artifacts': {
                    artifact1: {
                        'files': [
                            'target/artifact-1.0.jar',
                        ],
                        'discard-paths': 'yes',
                    },
                    artifact2: {
                        'files': [
                            'target/artifact-2.0.jar',
                        ],
                        'discard-paths': 'yes',
                    },
                },
            },
            cache: {
                paths: [
                    '/root/.m2/**/*',
                ],
            },
        });
        const merged = codebuild.mergeBuildSpecs(userSpec, cdkSpec);
        expect(merged.spec).toEqual({
            version: 0.2,
            env: {
                'variables': {
                    JAVA_HOME: '/usr/lib/jvm/java-8-openjdk-amd64',
                    NPM_TOKEN: 'supersecret',
                },
                'parameter-store': {
                    LOGIN_PASSWORD: '/CodeBuild/dockerLoginPassword',
                },
            },
            phases: {
                install: {
                    commands: [
                        'echo Entered the install phase...',
                        'apt-get update -y',
                        'apt-get install -y maven',
                    ],
                    finally: [
                        'echo This always runs even if the update or install command fails',
                    ],
                },
                pre_build: {
                    commands: [
                        'echo Entered the pre_build phase...',
                        'docker login -u User -p $LOGIN_PASSWORD',
                        'install1',
                    ],
                    finally: [
                        'echo This always runs even if the login command fails',
                    ],
                },
                build: {
                    commands: [
                        'echo Entered the build phase...',
                        'echo Build started on `date`',
                        'mvn install',
                        'build1',
                        'test1',
                        'cdk synth',
                    ],
                    finally: [
                        'echo This always runs even if the install command fails',
                    ],
                },
                post_build: {
                    commands: [
                        'echo Entered the post_build phase...',
                        'echo Build completed on `date`',
                    ],
                },
            },
            reports: {
                'arn:aws:codebuild:your-region:your-aws-account-id:report-group/report-group-name-1': {
                    'files': [
                        '**/*',
                    ],
                    'base-directory': 'target/tests/reports',
                    'discard-paths': 'no',
                },
                'reportGroupCucumberJson': {
                    'files': [
                        'cucumber/target/cucumber-tests.xml',
                    ],
                    'discard-paths': 'yes',
                    'file-format': 'CUCUMBERJSON',
                },
            },
            artifacts: {
                'files': [
                    'target/messageUtil-1.0.jar',
                ],
                'discard-paths': 'yes',
                'secondary-artifacts': {
                    artifact1: {
                        'files': [
                            'target/artifact-1.0.jar',
                        ],
                        'discard-paths': 'yes',
                    },
                    artifact2: {
                        'files': [
                            'target/artifact-2.0.jar',
                        ],
                        'discard-paths': 'yes',
                    },
                },
            },
            cache: {
                paths: [
                    '/root/.m2/**/*',
                ],
            },
        });
    });
    test('override duplicate reports', () => {
        const lhs = codebuild.BuildSpec.fromObject({
            phases: {
                pre_build: {
                    commands: [
                        'install',
                    ],
                },
            },
            reports: {
                'report1': {
                    'files': [
                        'report1/a',
                    ],
                    'discard-paths': 'no',
                    'base-directory': 'target/tests/reports',
                },
                'report2': {
                    'files': [
                        'cucumber/target/cucumber-tests.xml',
                    ],
                    'discard-paths': 'yes',
                    'file-format': 'CUCUMBERJSON',
                },
            },
        });
        const rhs = codebuild.BuildSpec.fromObject({
            phases: {
                build: {
                    commands: [
                        'build',
                    ],
                },
            },
            reports: {
                'report1': {
                    'files': [
                        'report1/b',
                        'report1/b2',
                    ],
                    'base-directory': 'target/tests/reportsB',
                },
                'report3': {
                    'files': [
                        'cucumber/target/cucumber-tests.xml',
                    ],
                    'discard-paths': 'yes',
                    'file-format': 'CUCUMBERJSON',
                },
            },
        });
        const merged = codebuild.mergeBuildSpecs(lhs, rhs);
        expect(merged.spec).toEqual({
            phases: {
                pre_build: {
                    commands: [
                        'install',
                    ],
                },
                build: {
                    commands: [
                        'build',
                    ],
                },
            },
            reports: {
                'report1': {
                    'files': [
                        'report1/b',
                        'report1/b2',
                    ],
                    'base-directory': 'target/tests/reportsB',
                },
                'report2': {
                    'files': [
                        'cucumber/target/cucumber-tests.xml',
                    ],
                    'discard-paths': 'yes',
                    'file-format': 'CUCUMBERJSON',
                },
                'report3': {
                    'files': [
                        'cucumber/target/cucumber-tests.xml',
                    ],
                    'discard-paths': 'yes',
                    'file-format': 'CUCUMBERJSON',
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3BlYy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVpbGQtc3BlYy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDO0FBQ3hDLG9DQUFvQztBQUVwQyxnQ0FBZ0M7QUFDaEMsMkJBQTJCO0FBRTNCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtRQUNsQyxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN6QyxNQUFNLEVBQUU7Z0JBQ04sU0FBUyxFQUFFO29CQUNULFFBQVEsRUFBRTt3QkFDUixTQUFTO3FCQUNWO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN6QyxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxPQUFPO2lCQUNsQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFFLE1BQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDbkMsTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRTtvQkFDVCxRQUFRLEVBQUU7d0JBQ1IsU0FBUztxQkFDVjtpQkFDRjtnQkFDRCxLQUFLLEVBQUU7b0JBQ0wsUUFBUSxFQUFFO3dCQUNSLE9BQU87cUJBQ1I7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUMvQixNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN6QyxNQUFNLEVBQUU7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LE9BQU8sRUFBRTt3QkFDUCxvQ0FBb0M7cUJBQ3JDO29CQUNELGVBQWUsRUFBRSxLQUFLO29CQUN0QixhQUFhLEVBQUUsY0FBYztpQkFDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sQ0FBRSxNQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ25DLE1BQU0sRUFBRTtnQkFDTixTQUFTLEVBQUU7b0JBQ1QsUUFBUSxFQUFFO3dCQUNSLFNBQVM7cUJBQ1Y7aUJBQ0Y7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRTt3QkFDUixPQUFPO3FCQUNSO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFO29CQUNULE9BQU8sRUFBRTt3QkFDUCxXQUFXO3dCQUNYLFlBQVk7cUJBQ2I7b0JBQ0QsZ0JBQWdCLEVBQUUsdUJBQXVCO2lCQUMxQztnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsT0FBTyxFQUFFO3dCQUNQLG9DQUFvQztxQkFDckM7b0JBQ0QsZUFBZSxFQUFFLEtBQUs7b0JBQ3RCLGFBQWEsRUFBRSxjQUFjO2lCQUM5QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsT0FBTyxFQUFFO3dCQUNQLG9DQUFvQztxQkFDckM7b0JBQ0QsZUFBZSxFQUFFLEtBQUs7b0JBQ3RCLGFBQWEsRUFBRSxjQUFjO2lCQUM5QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGVzICovXG5cbmRlc2NyaWJlKCdUZXN0IEJ1aWxkU3BlYyBtZXJnZScsICgpID0+IHtcbiAgdGVzdCgnbWVyZ2UgdHdvIHNpbXBsZSBzcGVjcycsICgpID0+IHtcbiAgICBjb25zdCBsaHMgPSBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgcGhhc2VzOiB7XG4gICAgICAgIHByZV9idWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnaW5zdGFsbCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcmhzID0gY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgIHBoYXNlczoge1xuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiAnYnVpbGQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lcmdlZCA9IGNvZGVidWlsZC5tZXJnZUJ1aWxkU3BlY3MobGhzLCByaHMpO1xuXG4gICAgZXhwZWN0KChtZXJnZWQgYXMgYW55KS5zcGVjKS50b0VxdWFsKHtcbiAgICAgIHBoYXNlczoge1xuICAgICAgICBwcmVfYnVpbGQ6IHtcbiAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgJ2luc3RhbGwnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICdidWlsZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21lcmdlIGNvbW1hbmQgbGlzdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgbGhzID0gY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgIHBoYXNlczoge1xuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnYnVpbGQxJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCByaHMgPSBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgcGhhc2VzOiB7XG4gICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgY29tbWFuZHM6ICdidWlsZDInLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lcmdlZCA9IGNvZGVidWlsZC5tZXJnZUJ1aWxkU3BlY3MobGhzLCByaHMpO1xuXG4gICAgZXhwZWN0KChtZXJnZWQgYXMgYW55KS5zcGVjKS50b0VxdWFsKHtcbiAgICAgIHBoYXNlczoge1xuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnYnVpbGQxJyxcbiAgICAgICAgICAgICdidWlsZDInLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkbyBub3QgbWVyZ2UgYXJ0aWZhY3RzJywgKCkgPT4ge1xuICAgIGNvbnN0IGxocyA9IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICBwaGFzZXM6IHtcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgJ2J1aWxkMScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ3N1YmRpci9jZGsub3V0JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcmhzID0gY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgIHBoYXNlczoge1xuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnYnVpbGQyJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAnYmFzZS1kaXJlY3RvcnknOiAnc3ViZGlyL2Nkay5vdXQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjb2RlYnVpbGQubWVyZ2VCdWlsZFNwZWNzKGxocywgcmhzKTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ21lcmdlIGNvbXBsZXggZXhhbXBsZScsICgpID0+IHtcbiAgICBjb25zdCBjZGtTcGVjID0gY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgIGVudjoge1xuICAgICAgICAndmFyaWFibGVzJzoge1xuICAgICAgICAgIE5QTV9UT0tFTjogJ3N1cGVyc2VjcmV0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwaGFzZXM6IHtcbiAgICAgICAgcHJlX2J1aWxkOiB7XG4gICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICdpbnN0YWxsMScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgJ2J1aWxkMScsXG4gICAgICAgICAgICAndGVzdDEnLFxuICAgICAgICAgICAgJ2NkayBzeW50aCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgdXNlclNwZWMgPSBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgdmVyc2lvbjogMC4yLFxuICAgICAgZW52OiB7XG4gICAgICAgICd2YXJpYWJsZXMnOiB7XG4gICAgICAgICAgSkFWQV9IT01FOiAnL3Vzci9saWIvanZtL2phdmEtOC1vcGVuamRrLWFtZDY0JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ3BhcmFtZXRlci1zdG9yZSc6IHtcbiAgICAgICAgICBMT0dJTl9QQVNTV09SRDogJy9Db2RlQnVpbGQvZG9ja2VyTG9naW5QYXNzd29yZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGhhc2VzOiB7XG4gICAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgJ2VjaG8gRW50ZXJlZCB0aGUgaW5zdGFsbCBwaGFzZS4uLicsXG4gICAgICAgICAgICAnYXB0LWdldCB1cGRhdGUgLXknLFxuICAgICAgICAgICAgJ2FwdC1nZXQgaW5zdGFsbCAteSBtYXZlbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBmaW5hbGx5OiBbXG4gICAgICAgICAgICAnZWNobyBUaGlzIGFsd2F5cyBydW5zIGV2ZW4gaWYgdGhlIHVwZGF0ZSBvciBpbnN0YWxsIGNvbW1hbmQgZmFpbHMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHByZV9idWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnZWNobyBFbnRlcmVkIHRoZSBwcmVfYnVpbGQgcGhhc2UuLi4nLFxuICAgICAgICAgICAgJ2RvY2tlciBsb2dpbiAtdSBVc2VyIC1wICRMT0dJTl9QQVNTV09SRCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBmaW5hbGx5OiBbXG4gICAgICAgICAgICAnZWNobyBUaGlzIGFsd2F5cyBydW5zIGV2ZW4gaWYgdGhlIGxvZ2luIGNvbW1hbmQgZmFpbHMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICdlY2hvIEVudGVyZWQgdGhlIGJ1aWxkIHBoYXNlLi4uJyxcbiAgICAgICAgICAgICdlY2hvIEJ1aWxkIHN0YXJ0ZWQgb24gYGRhdGVgJyxcbiAgICAgICAgICAgICdtdm4gaW5zdGFsbCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBmaW5hbGx5OiBbXG4gICAgICAgICAgICAnZWNobyBUaGlzIGFsd2F5cyBydW5zIGV2ZW4gaWYgdGhlIGluc3RhbGwgY29tbWFuZCBmYWlscycsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgcG9zdF9idWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnZWNobyBFbnRlcmVkIHRoZSBwb3N0X2J1aWxkIHBoYXNlLi4uJyxcbiAgICAgICAgICAgICdlY2hvIEJ1aWxkIGNvbXBsZXRlZCBvbiBgZGF0ZWAnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVwb3J0czoge1xuICAgICAgICAnYXJuOmF3czpjb2RlYnVpbGQ6eW91ci1yZWdpb246eW91ci1hd3MtYWNjb3VudC1pZDpyZXBvcnQtZ3JvdXAvcmVwb3J0LWdyb3VwLW5hbWUtMSc6IHtcbiAgICAgICAgICAnZmlsZXMnOiBbXG4gICAgICAgICAgICAnKiovKicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnYmFzZS1kaXJlY3RvcnknOiAndGFyZ2V0L3Rlc3RzL3JlcG9ydHMnLFxuICAgICAgICAgICdkaXNjYXJkLXBhdGhzJzogJ25vJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ3JlcG9ydEdyb3VwQ3VjdW1iZXJKc29uJzoge1xuICAgICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAgICdjdWN1bWJlci90YXJnZXQvY3VjdW1iZXItdGVzdHMueG1sJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdkaXNjYXJkLXBhdGhzJzogJ3llcycsXG4gICAgICAgICAgJ2ZpbGUtZm9ybWF0JzogJ0NVQ1VNQkVSSlNPTicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAndGFyZ2V0L21lc3NhZ2VVdGlsLTEuMC5qYXInLFxuICAgICAgICBdLFxuICAgICAgICAnZGlzY2FyZC1wYXRocyc6ICd5ZXMnLFxuICAgICAgICAnc2Vjb25kYXJ5LWFydGlmYWN0cyc6IHtcbiAgICAgICAgICBhcnRpZmFjdDE6IHtcbiAgICAgICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAgICAgJ3RhcmdldC9hcnRpZmFjdC0xLjAuamFyJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnZGlzY2FyZC1wYXRocyc6ICd5ZXMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXJ0aWZhY3QyOiB7XG4gICAgICAgICAgICAnZmlsZXMnOiBbXG4gICAgICAgICAgICAgICd0YXJnZXQvYXJ0aWZhY3QtMi4wLmphcicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ2Rpc2NhcmQtcGF0aHMnOiAneWVzJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNhY2hlOiB7XG4gICAgICAgIHBhdGhzOiBbXG4gICAgICAgICAgJy9yb290Ly5tMi8qKi8qJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZXJnZWQgPSBjb2RlYnVpbGQubWVyZ2VCdWlsZFNwZWNzKHVzZXJTcGVjLCBjZGtTcGVjKTtcblxuICAgIGV4cGVjdCgobWVyZ2VkIGFzIGFueSkuc3BlYykudG9FcXVhbCh7XG4gICAgICB2ZXJzaW9uOiAwLjIsXG4gICAgICBlbnY6IHtcbiAgICAgICAgJ3ZhcmlhYmxlcyc6IHtcbiAgICAgICAgICBKQVZBX0hPTUU6ICcvdXNyL2xpYi9qdm0vamF2YS04LW9wZW5qZGstYW1kNjQnLFxuICAgICAgICAgIE5QTV9UT0tFTjogJ3N1cGVyc2VjcmV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ3BhcmFtZXRlci1zdG9yZSc6IHtcbiAgICAgICAgICBMT0dJTl9QQVNTV09SRDogJy9Db2RlQnVpbGQvZG9ja2VyTG9naW5QYXNzd29yZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGhhc2VzOiB7XG4gICAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgJ2VjaG8gRW50ZXJlZCB0aGUgaW5zdGFsbCBwaGFzZS4uLicsXG4gICAgICAgICAgICAnYXB0LWdldCB1cGRhdGUgLXknLFxuICAgICAgICAgICAgJ2FwdC1nZXQgaW5zdGFsbCAteSBtYXZlbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBmaW5hbGx5OiBbXG4gICAgICAgICAgICAnZWNobyBUaGlzIGFsd2F5cyBydW5zIGV2ZW4gaWYgdGhlIHVwZGF0ZSBvciBpbnN0YWxsIGNvbW1hbmQgZmFpbHMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHByZV9idWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnZWNobyBFbnRlcmVkIHRoZSBwcmVfYnVpbGQgcGhhc2UuLi4nLFxuICAgICAgICAgICAgJ2RvY2tlciBsb2dpbiAtdSBVc2VyIC1wICRMT0dJTl9QQVNTV09SRCcsXG4gICAgICAgICAgICAnaW5zdGFsbDEnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZmluYWxseTogW1xuICAgICAgICAgICAgJ2VjaG8gVGhpcyBhbHdheXMgcnVucyBldmVuIGlmIHRoZSBsb2dpbiBjb21tYW5kIGZhaWxzJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnZWNobyBFbnRlcmVkIHRoZSBidWlsZCBwaGFzZS4uLicsXG4gICAgICAgICAgICAnZWNobyBCdWlsZCBzdGFydGVkIG9uIGBkYXRlYCcsXG4gICAgICAgICAgICAnbXZuIGluc3RhbGwnLFxuICAgICAgICAgICAgJ2J1aWxkMScsXG4gICAgICAgICAgICAndGVzdDEnLFxuICAgICAgICAgICAgJ2NkayBzeW50aCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBmaW5hbGx5OiBbXG4gICAgICAgICAgICAnZWNobyBUaGlzIGFsd2F5cyBydW5zIGV2ZW4gaWYgdGhlIGluc3RhbGwgY29tbWFuZCBmYWlscycsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgcG9zdF9idWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnZWNobyBFbnRlcmVkIHRoZSBwb3N0X2J1aWxkIHBoYXNlLi4uJyxcbiAgICAgICAgICAgICdlY2hvIEJ1aWxkIGNvbXBsZXRlZCBvbiBgZGF0ZWAnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVwb3J0czoge1xuICAgICAgICAnYXJuOmF3czpjb2RlYnVpbGQ6eW91ci1yZWdpb246eW91ci1hd3MtYWNjb3VudC1pZDpyZXBvcnQtZ3JvdXAvcmVwb3J0LWdyb3VwLW5hbWUtMSc6IHtcbiAgICAgICAgICAnZmlsZXMnOiBbXG4gICAgICAgICAgICAnKiovKicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnYmFzZS1kaXJlY3RvcnknOiAndGFyZ2V0L3Rlc3RzL3JlcG9ydHMnLFxuICAgICAgICAgICdkaXNjYXJkLXBhdGhzJzogJ25vJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ3JlcG9ydEdyb3VwQ3VjdW1iZXJKc29uJzoge1xuICAgICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAgICdjdWN1bWJlci90YXJnZXQvY3VjdW1iZXItdGVzdHMueG1sJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdkaXNjYXJkLXBhdGhzJzogJ3llcycsXG4gICAgICAgICAgJ2ZpbGUtZm9ybWF0JzogJ0NVQ1VNQkVSSlNPTicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAndGFyZ2V0L21lc3NhZ2VVdGlsLTEuMC5qYXInLFxuICAgICAgICBdLFxuICAgICAgICAnZGlzY2FyZC1wYXRocyc6ICd5ZXMnLFxuICAgICAgICAnc2Vjb25kYXJ5LWFydGlmYWN0cyc6IHtcbiAgICAgICAgICBhcnRpZmFjdDE6IHtcbiAgICAgICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAgICAgJ3RhcmdldC9hcnRpZmFjdC0xLjAuamFyJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnZGlzY2FyZC1wYXRocyc6ICd5ZXMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXJ0aWZhY3QyOiB7XG4gICAgICAgICAgICAnZmlsZXMnOiBbXG4gICAgICAgICAgICAgICd0YXJnZXQvYXJ0aWZhY3QtMi4wLmphcicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ2Rpc2NhcmQtcGF0aHMnOiAneWVzJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNhY2hlOiB7XG4gICAgICAgIHBhdGhzOiBbXG4gICAgICAgICAgJy9yb290Ly5tMi8qKi8qJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ292ZXJyaWRlIGR1cGxpY2F0ZSByZXBvcnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IGxocyA9IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICBwaGFzZXM6IHtcbiAgICAgICAgcHJlX2J1aWxkOiB7XG4gICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICdpbnN0YWxsJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlcG9ydHM6IHtcbiAgICAgICAgJ3JlcG9ydDEnOiB7XG4gICAgICAgICAgJ2ZpbGVzJzogW1xuICAgICAgICAgICAgJ3JlcG9ydDEvYScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnZGlzY2FyZC1wYXRocyc6ICdubycsXG4gICAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ3RhcmdldC90ZXN0cy9yZXBvcnRzJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ3JlcG9ydDInOiB7XG4gICAgICAgICAgJ2ZpbGVzJzogW1xuICAgICAgICAgICAgJ2N1Y3VtYmVyL3RhcmdldC9jdWN1bWJlci10ZXN0cy54bWwnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ2Rpc2NhcmQtcGF0aHMnOiAneWVzJyxcbiAgICAgICAgICAnZmlsZS1mb3JtYXQnOiAnQ1VDVU1CRVJKU09OJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgcmhzID0gY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgIHBoYXNlczoge1xuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgICAnYnVpbGQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVwb3J0czoge1xuICAgICAgICAncmVwb3J0MSc6IHtcbiAgICAgICAgICAnZmlsZXMnOiBbXG4gICAgICAgICAgICAncmVwb3J0MS9iJyxcbiAgICAgICAgICAgICdyZXBvcnQxL2IyJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdiYXNlLWRpcmVjdG9yeSc6ICd0YXJnZXQvdGVzdHMvcmVwb3J0c0InLFxuICAgICAgICB9LFxuICAgICAgICAncmVwb3J0Myc6IHtcbiAgICAgICAgICAnZmlsZXMnOiBbXG4gICAgICAgICAgICAnY3VjdW1iZXIvdGFyZ2V0L2N1Y3VtYmVyLXRlc3RzLnhtbCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnZGlzY2FyZC1wYXRocyc6ICd5ZXMnLFxuICAgICAgICAgICdmaWxlLWZvcm1hdCc6ICdDVUNVTUJFUkpTT04nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1lcmdlZCA9IGNvZGVidWlsZC5tZXJnZUJ1aWxkU3BlY3MobGhzLCByaHMpO1xuXG4gICAgZXhwZWN0KChtZXJnZWQgYXMgYW55KS5zcGVjKS50b0VxdWFsKHtcbiAgICAgIHBoYXNlczoge1xuICAgICAgICBwcmVfYnVpbGQ6IHtcbiAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgJ2luc3RhbGwnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICdidWlsZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZXBvcnRzOiB7XG4gICAgICAgICdyZXBvcnQxJzoge1xuICAgICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAgICdyZXBvcnQxL2InLFxuICAgICAgICAgICAgJ3JlcG9ydDEvYjInLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ2Jhc2UtZGlyZWN0b3J5JzogJ3RhcmdldC90ZXN0cy9yZXBvcnRzQicsXG4gICAgICAgIH0sXG4gICAgICAgICdyZXBvcnQyJzoge1xuICAgICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAgICdjdWN1bWJlci90YXJnZXQvY3VjdW1iZXItdGVzdHMueG1sJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdkaXNjYXJkLXBhdGhzJzogJ3llcycsXG4gICAgICAgICAgJ2ZpbGUtZm9ybWF0JzogJ0NVQ1VNQkVSSlNPTicsXG4gICAgICAgIH0sXG4gICAgICAgICdyZXBvcnQzJzoge1xuICAgICAgICAgICdmaWxlcyc6IFtcbiAgICAgICAgICAgICdjdWN1bWJlci90YXJnZXQvY3VjdW1iZXItdGVzdHMueG1sJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdkaXNjYXJkLXBhdGhzJzogJ3llcycsXG4gICAgICAgICAgJ2ZpbGUtZm9ybWF0JzogJ0NVQ1VNQkVSSlNPTicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19