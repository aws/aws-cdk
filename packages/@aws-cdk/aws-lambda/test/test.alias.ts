import { beASupersetOfTemplate, expect, haveResource } from '@aws-cdk/assert';
import { AccountPrincipal, resolve, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Alias, Lambda, LambdaInlineCode, LambdaRuntime } from '../lib';

export = {
    'version and aliases'(test: Test): void {
        const stack = new Stack();
        const lambda = new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('hello()'),
            handler: 'index.hello',
            runtime: LambdaRuntime.NodeJS610,
        });

        const version = lambda.addVersion('1');

        new Alias(stack, 'Alias', {
            aliasName: 'prod',
            version,
        });

        expect(stack).to(beASupersetOfTemplate({
            MyLambdaVersion16CDE3C40: {
                Type: "AWS::Lambda::Version",
                Properties: {
                  FunctionName: { Ref: "MyLambdaCCE802FB" }
                }
              },
              Alias325C5727: {
                Type: "AWS::Lambda::Alias",
                Properties: {
                  FunctionName: { Ref: "MyLambdaCCE802FB" },
                  FunctionVersion: resolve(version.functionVersion),
                  Name: "prod"
                }
              }
        }));

        test.done();
    },

    'can add additional versions to alias'(test: Test) {
        const stack = new Stack();

        const lambda = new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('hello()'),
            handler: 'index.hello',
            runtime: LambdaRuntime.NodeJS610,
        });

        const version1 = lambda.addVersion('1');
        const version2 = lambda.addVersion('2');

        new Alias(stack, 'Alias', {
            aliasName: 'prod',
            version: version1,
            additionalVersions: [{ version: version2, weight: 0.1 }]
        });

        expect(stack).to(haveResource('AWS::Lambda::Alias', {
            FunctionVersion: resolve(version1.functionVersion),
            RoutingConfig: {
                AdditionalVersionWeights: [
                  {
                    FunctionVersion: resolve(version2.functionVersion),
                    FunctionWeight: 0.1
                  }
                ]
              }
        }));

        test.done();
    },

    'sanity checks on version weights'(test: Test) {
        const stack = new Stack();

        const lambda = new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('hello()'),
            handler: 'index.hello',
            runtime: LambdaRuntime.NodeJS610,
        });

        const version = lambda.addVersion('1');

        // WHEN: Individual weight too high
        test.throws(() => {
            new Alias(stack, 'Alias1', {
                aliasName: 'prod', version,
                additionalVersions: [{ version, weight: 5 }]
            });
        });

        // WHEN: Sum too high
        test.throws(() => {
            new Alias(stack, 'Alias2', {
                aliasName: 'prod', version,
                additionalVersions: [{ version, weight: 0.5 }, { version, weight: 0.6 }]
            });
        });

        test.done();
    },

    'addPermission() on alias forward to real Lambda'(test: Test) {
        const stack = new Stack();

        // GIVEN
        const lambda = new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('hello()'),
            handler: 'index.hello',
            runtime: LambdaRuntime.NodeJS610,
        });

        const version = lambda.addVersion('1');
        const alias = new Alias(stack, 'Alias', { aliasName: 'prod', version });

        // WHEN
        alias.addPermission('Perm', {
            principal: new AccountPrincipal('123456')
        });

        // THEN
        expect(stack).to(haveResource('AWS::Lambda::Permission', {
            FunctionName: resolve(lambda.functionName),
            Principal: "123456"
        }));

        test.done();
    }
};
