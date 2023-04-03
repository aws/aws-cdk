"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const _ = require("lodash");
const cpactions = require("../../lib");
describe('Pipeline Actions', () => {
    describe('CreateReplaceChangeSet', () => {
        test('works', (done) => {
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'Stack');
            const pipelineRole = new RoleDouble(stack, 'PipelineRole');
            const artifact = new codepipeline.Artifact('TestArtifact');
            const action = new cpactions.CloudFormationCreateReplaceChangeSetAction({
                actionName: 'Action',
                changeSetName: 'MyChangeSet',
                stackName: 'MyStack',
                templatePath: artifact.atPath('path/to/file'),
                adminPermissions: false,
            });
            const stage = new StageDouble({
                pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }),
                actions: [action],
            });
            app.synth();
            _assertPermissionGranted(done, stack, pipelineRole.statements, 'iam:PassRole', action.deploymentRole.roleArn);
            const stackArn = _stackArn('MyStack', stack);
            const changeSetCondition = { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } };
            _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:DescribeStacks', stackArn, changeSetCondition);
            _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:DescribeChangeSet', stackArn, changeSetCondition);
            _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:CreateChangeSet', stackArn, changeSetCondition);
            _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:DeleteChangeSet', stackArn, changeSetCondition);
            // TODO: revert "as any" once we move all actions into a single package.
            expect(stage.fullActions[0].actionProperties.inputs).toEqual([artifact]);
            _assertActionMatches(done, stack, stage.fullActions, 'CloudFormation', 'Deploy', {
                ActionMode: 'CHANGE_SET_CREATE_REPLACE',
                StackName: 'MyStack',
                ChangeSetName: 'MyChangeSet',
            });
            done();
        });
        test('uses a single permission statement if the same ChangeSet name is used', () => {
            const stack = new cdk.Stack();
            const pipelineRole = new RoleDouble(stack, 'PipelineRole');
            const artifact = new codepipeline.Artifact('TestArtifact');
            new StageDouble({
                pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }),
                actions: [
                    new cpactions.CloudFormationCreateReplaceChangeSetAction({
                        actionName: 'ActionA',
                        changeSetName: 'MyChangeSet',
                        stackName: 'StackA',
                        adminPermissions: false,
                        templatePath: artifact.atPath('path/to/file'),
                    }),
                    new cpactions.CloudFormationCreateReplaceChangeSetAction({
                        actionName: 'ActionB',
                        changeSetName: 'MyChangeSet',
                        stackName: 'StackB',
                        adminPermissions: false,
                        templatePath: artifact.atPath('path/to/other/file'),
                    }),
                ],
            });
            expect(stack.resolve(pipelineRole.statements.map(s => s.toStatementJson()))).toEqual([
                {
                    Action: 'iam:PassRole',
                    Effect: 'Allow',
                    Resource: [
                        { 'Fn::GetAtt': ['PipelineTestStageActionARole9283FBE3', 'Arn'] },
                        { 'Fn::GetAtt': ['PipelineTestStageActionBRoleCABC8FA5', 'Arn'] },
                    ],
                },
                {
                    Action: [
                        'cloudformation:CreateChangeSet',
                        'cloudformation:DeleteChangeSet',
                        'cloudformation:DescribeChangeSet',
                        'cloudformation:DescribeStacks',
                    ],
                    Condition: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } },
                    Effect: 'Allow',
                    Resource: [
                        // eslint-disable-next-line max-len
                        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackA/*']] },
                        // eslint-disable-next-line max-len
                        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackB/*']] },
                    ],
                },
            ]);
        });
    });
    describe('ExecuteChangeSet', () => {
        test('works', (done) => {
            const stack = new cdk.Stack();
            const pipelineRole = new RoleDouble(stack, 'PipelineRole');
            const stage = new StageDouble({
                pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }),
                actions: [
                    new cpactions.CloudFormationExecuteChangeSetAction({
                        actionName: 'Action',
                        changeSetName: 'MyChangeSet',
                        stackName: 'MyStack',
                    }),
                ],
            });
            const stackArn = _stackArn('MyStack', stack);
            _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:ExecuteChangeSet', stackArn, { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } });
            _assertActionMatches(done, stack, stage.fullActions, 'CloudFormation', 'Deploy', {
                ActionMode: 'CHANGE_SET_EXECUTE',
                StackName: 'MyStack',
                ChangeSetName: 'MyChangeSet',
            });
            done();
        });
        test('uses a single permission statement if the same ChangeSet name is used', () => {
            const stack = new cdk.Stack();
            const pipelineRole = new RoleDouble(stack, 'PipelineRole');
            new StageDouble({
                pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }),
                actions: [
                    new cpactions.CloudFormationExecuteChangeSetAction({
                        actionName: 'ActionA',
                        changeSetName: 'MyChangeSet',
                        stackName: 'StackA',
                    }),
                    new cpactions.CloudFormationExecuteChangeSetAction({
                        actionName: 'ActionB',
                        changeSetName: 'MyChangeSet',
                        stackName: 'StackB',
                    }),
                ],
            });
            expect(stack.resolve(pipelineRole.statements.map(s => s.toStatementJson()))).toEqual([
                {
                    Action: [
                        'cloudformation:DescribeChangeSet',
                        'cloudformation:DescribeStacks',
                        'cloudformation:ExecuteChangeSet',
                    ],
                    Condition: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } },
                    Effect: 'Allow',
                    Resource: [
                        // eslint-disable-next-line max-len
                        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackA/*']] },
                        // eslint-disable-next-line max-len
                        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackB/*']] },
                    ],
                },
            ]);
        });
    });
    test('the CreateUpdateStack Action sets the DescribeStack*, Create/Update/DeleteStack & PassRole permissions', (done) => {
        const stack = new cdk.Stack();
        const pipelineRole = new RoleDouble(stack, 'PipelineRole');
        const action = new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'Action',
            templatePath: new codepipeline.Artifact('TestArtifact').atPath('some/file'),
            stackName: 'MyStack',
            adminPermissions: false,
            replaceOnFailure: true,
        });
        new StageDouble({
            pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }),
            actions: [action],
        });
        const stackArn = _stackArn('MyStack', stack);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:DescribeStack*', stackArn);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:CreateStack', stackArn);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:UpdateStack', stackArn);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:DeleteStack', stackArn);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'iam:PassRole', action.deploymentRole.roleArn);
        done();
    });
    test('the DeleteStack Action sets the DescribeStack*, DeleteStack & PassRole permissions', (done) => {
        const stack = new cdk.Stack();
        const pipelineRole = new RoleDouble(stack, 'PipelineRole');
        const action = new cpactions.CloudFormationDeleteStackAction({
            actionName: 'Action',
            adminPermissions: false,
            stackName: 'MyStack',
        });
        new StageDouble({
            pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }),
            actions: [action],
        });
        const stackArn = _stackArn('MyStack', stack);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:DescribeStack*', stackArn);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'cloudformation:DeleteStack', stackArn);
        _assertPermissionGranted(done, stack, pipelineRole.statements, 'iam:PassRole', action.deploymentRole.roleArn);
        done();
    });
});
function _assertActionMatches(done, stack, actions, provider, category, configuration) {
    const configurationStr = configuration
        ? `, configuration including ${JSON.stringify(stack.resolve(configuration), null, 2)}`
        : '';
    const actionsStr = JSON.stringify(actions.map(a => ({
        owner: a.actionProperties.owner,
        provider: a.actionProperties.provider,
        category: a.actionProperties.category,
        configuration: stack.resolve(a.actionConfig.configuration),
    })), null, 2);
    if (!_hasAction(stack, actions, provider, category, configuration)) {
        done.fail(`Expected to find an action with provider ${provider}, category ${category}${configurationStr}, but found ${actionsStr}`);
    }
}
function _hasAction(stack, actions, provider, category, configuration) {
    for (const action of actions) {
        if (action.actionProperties.provider !== provider) {
            continue;
        }
        if (action.actionProperties.category !== category) {
            continue;
        }
        if (configuration && !action.actionConfig.configuration) {
            continue;
        }
        if (configuration) {
            for (const key of Object.keys(configuration)) {
                if (!_.isEqual(stack.resolve(action.actionConfig.configuration[key]), stack.resolve(configuration[key]))) {
                    continue;
                }
            }
        }
        return true;
    }
    return false;
}
function _assertPermissionGranted(done, stack, statements, action, resource, conditions) {
    const conditionStr = conditions
        ? ` with condition(s) ${JSON.stringify(stack.resolve(conditions))}`
        : '';
    const resolvedStatements = stack.resolve(statements.map(s => s.toStatementJson()));
    const statementsStr = JSON.stringify(resolvedStatements, null, 2);
    if (!_grantsPermission(stack, resolvedStatements, action, resource, conditions)) {
        done.fail(`Expected to find a statement granting ${action} on ${JSON.stringify(stack.resolve(resource))}${conditionStr}, found:\n${statementsStr}`);
    }
}
function _grantsPermission(stack, statements, action, resource, conditions) {
    for (const statement of statements.filter(s => s.Effect === 'Allow')) {
        if (!_isOrContains(stack, statement.Action, action)) {
            continue;
        }
        if (!_isOrContains(stack, statement.Resource, resource)) {
            continue;
        }
        if (conditions && !_isOrContains(stack, statement.Condition, conditions)) {
            continue;
        }
        return true;
    }
    return false;
}
function _isOrContains(stack, entity, value) {
    const resolvedValue = stack.resolve(value);
    const resolvedEntity = stack.resolve(entity);
    if (_.isEqual(resolvedEntity, resolvedValue)) {
        return true;
    }
    if (!Array.isArray(resolvedEntity)) {
        return false;
    }
    for (const tested of entity) {
        if (_.isEqual(tested, resolvedValue)) {
            return true;
        }
    }
    return false;
}
function _stackArn(stackName, scope) {
    return cdk.Stack.of(scope).formatArn({
        service: 'cloudformation',
        resource: 'stack',
        resourceName: `${stackName}/*`,
    });
}
class PipelineDouble extends cdk.Resource {
    constructor(scope, id, { pipelineName, role }) {
        super(scope, id);
        this.pipelineName = pipelineName || 'TestPipeline';
        this.pipelineArn = cdk.Stack.of(this).formatArn({ service: 'codepipeline', resource: 'pipeline', resourceName: this.pipelineName });
        this.role = role;
        this.artifactBucket = new BucketDouble(scope, 'BucketDouble');
    }
    onEvent(_id, _options) {
        throw new Error('Method not implemented.');
    }
    onStateChange(_id, _options) {
        throw new Error('Method not implemented.');
    }
    notifyOn(_id, _target, _options) {
        throw new Error('Method not implemented.');
    }
    notifyOnExecutionStateChange(_id, _target, _options) {
        throw new Error('Method not implemented.');
    }
    notifyOnAnyStageStateChange(_id, _target, _options) {
        throw new Error('Method not implemented.');
    }
    notifyOnAnyActionStateChange(_id, _target, _options) {
        throw new Error('Method not implemented.');
    }
    notifyOnAnyManualApprovalStateChange(_id, _target, _options) {
        throw new Error('Method not implemented.');
    }
    bindAsNotificationRuleSource(_scope) {
        throw new Error('Method not implemented.');
    }
}
class FullAction {
    constructor(actionProperties, actionConfig) {
        this.actionProperties = actionProperties;
        this.actionConfig = actionConfig;
    }
}
class StageDouble {
    constructor({ name, pipeline, actions }) {
        this.actions = [];
        this.stageName = name || 'TestStage';
        this.pipeline = pipeline;
        const stageParent = new constructs_1.Construct(pipeline, this.stageName);
        const fullActions = new Array();
        for (const action of actions) {
            const actionParent = new constructs_1.Construct(stageParent, action.actionProperties.actionName);
            fullActions.push(new FullAction(action.actionProperties, action.bind(actionParent, this, {
                role: pipeline.role,
                bucket: pipeline.artifactBucket,
            })));
        }
        this.fullActions = fullActions;
    }
    get node() {
        throw new Error('StageDouble is not a real construct');
    }
    addAction(_action) {
        throw new Error('addAction() is not supported on StageDouble');
    }
    onStateChange(_name, _target, _options) {
        throw new Error('onStateChange() is not supported on StageDouble');
    }
}
class RoleDouble extends iam.Role {
    constructor(scope, id, props = { assumedBy: new iam.ServicePrincipal('test') }) {
        super(scope, id, props);
        this.statements = new Array();
    }
    addToPolicy(statement) {
        super.addToPolicy(statement);
        this.statements.push(statement);
        return true;
    }
}
class BucketDouble extends s3.Bucket {
    grantRead(identity, _objectsKeyPattern = '*') {
        return iam.Grant.drop(identity, '');
    }
    grantWrite(identity, _objectsKeyPattern = '*') {
        return iam.Grant.drop(identity, '');
    }
    grantReadWrite(identity, _objectsKeyPattern = '*') {
        return iam.Grant.drop(identity, '');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtYWN0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGlwZWxpbmUtYWN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQTBEO0FBRzFELHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLDJDQUF5RDtBQUN6RCw0QkFBNEI7QUFDNUIsdUNBQXVDO0FBRXZDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMxQyxNQUFNLFlBQVksR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDM0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzNELE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLDBDQUEwQyxDQUFDO2dCQUN0RSxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsYUFBYSxFQUFFLGFBQWE7Z0JBQzVCLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixZQUFZLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7Z0JBQzdDLGdCQUFnQixFQUFFLEtBQUs7YUFDeEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUM7Z0JBQzVCLFFBQVEsRUFBRSxJQUFJLGNBQWMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxDQUFD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QU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDO0lBRU0sVUFBVSxDQUFDLFFBQXdCLEVBQUUscUJBQTBCLEdBQUc7UUFDdkUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDckM7SUFFTSxjQUFjLENBQUMsUUFBd0IsRUFBRSxxQkFBMEIsR0FBRztRQUMzRSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNyQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgbm90aWZpY2F0aW9ucyBmcm9tICdAYXdzLWNkay9hd3MtY29kZXN0YXJub3RpZmljYXRpb25zJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi8uLi9saWInO1xuXG5kZXNjcmliZSgnUGlwZWxpbmUgQWN0aW9ucycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0NyZWF0ZVJlcGxhY2VDaGFuZ2VTZXQnLCAoKSA9PiB7XG4gICAgdGVzdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdTdGFjaycpO1xuICAgICAgY29uc3QgcGlwZWxpbmVSb2xlID0gbmV3IFJvbGVEb3VibGUoc3RhY2ssICdQaXBlbGluZVJvbGUnKTtcbiAgICAgIGNvbnN0IGFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnVGVzdEFydGlmYWN0Jyk7XG4gICAgICBjb25zdCBhY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlUmVwbGFjZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdBY3Rpb24nLFxuICAgICAgICBjaGFuZ2VTZXROYW1lOiAnTXlDaGFuZ2VTZXQnLFxuICAgICAgICBzdGFja05hbWU6ICdNeVN0YWNrJyxcbiAgICAgICAgdGVtcGxhdGVQYXRoOiBhcnRpZmFjdC5hdFBhdGgoJ3BhdGgvdG8vZmlsZScpLFxuICAgICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2VEb3VibGUoe1xuICAgICAgICBwaXBlbGluZTogbmV3IFBpcGVsaW5lRG91YmxlKHN0YWNrLCAnUGlwZWxpbmUnLCB7IHJvbGU6IHBpcGVsaW5lUm9sZSB9KSxcbiAgICAgICAgYWN0aW9uczogW2FjdGlvbl0sXG4gICAgICB9KTtcblxuICAgICAgYXBwLnN5bnRoKCk7XG5cbiAgICAgIF9hc3NlcnRQZXJtaXNzaW9uR3JhbnRlZChkb25lLCBzdGFjaywgcGlwZWxpbmVSb2xlLnN0YXRlbWVudHMsICdpYW06UGFzc1JvbGUnLCBhY3Rpb24uZGVwbG95bWVudFJvbGUucm9sZUFybik7XG5cbiAgICAgIGNvbnN0IHN0YWNrQXJuID0gX3N0YWNrQXJuKCdNeVN0YWNrJywgc3RhY2spO1xuICAgICAgY29uc3QgY2hhbmdlU2V0Q29uZGl0aW9uID0geyBTdHJpbmdFcXVhbHNJZkV4aXN0czogeyAnY2xvdWRmb3JtYXRpb246Q2hhbmdlU2V0TmFtZSc6ICdNeUNoYW5nZVNldCcgfSB9O1xuICAgICAgX2Fzc2VydFBlcm1pc3Npb25HcmFudGVkKGRvbmUsIHN0YWNrLCBwaXBlbGluZVJvbGUuc3RhdGVtZW50cywgJ2Nsb3VkZm9ybWF0aW9uOkRlc2NyaWJlU3RhY2tzJywgc3RhY2tBcm4sIGNoYW5nZVNldENvbmRpdGlvbik7XG4gICAgICBfYXNzZXJ0UGVybWlzc2lvbkdyYW50ZWQoZG9uZSwgc3RhY2ssIHBpcGVsaW5lUm9sZS5zdGF0ZW1lbnRzLCAnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVDaGFuZ2VTZXQnLCBzdGFja0FybiwgY2hhbmdlU2V0Q29uZGl0aW9uKTtcbiAgICAgIF9hc3NlcnRQZXJtaXNzaW9uR3JhbnRlZChkb25lLCBzdGFjaywgcGlwZWxpbmVSb2xlLnN0YXRlbWVudHMsICdjbG91ZGZvcm1hdGlvbjpDcmVhdGVDaGFuZ2VTZXQnLCBzdGFja0FybiwgY2hhbmdlU2V0Q29uZGl0aW9uKTtcbiAgICAgIF9hc3NlcnRQZXJtaXNzaW9uR3JhbnRlZChkb25lLCBzdGFjaywgcGlwZWxpbmVSb2xlLnN0YXRlbWVudHMsICdjbG91ZGZvcm1hdGlvbjpEZWxldGVDaGFuZ2VTZXQnLCBzdGFja0FybiwgY2hhbmdlU2V0Q29uZGl0aW9uKTtcblxuICAgICAgLy8gVE9ETzogcmV2ZXJ0IFwiYXMgYW55XCIgb25jZSB3ZSBtb3ZlIGFsbCBhY3Rpb25zIGludG8gYSBzaW5nbGUgcGFja2FnZS5cbiAgICAgIGV4cGVjdChzdGFnZS5mdWxsQWN0aW9uc1swXS5hY3Rpb25Qcm9wZXJ0aWVzLmlucHV0cykudG9FcXVhbChbYXJ0aWZhY3RdKTtcblxuICAgICAgX2Fzc2VydEFjdGlvbk1hdGNoZXMoZG9uZSwgc3RhY2ssIHN0YWdlLmZ1bGxBY3Rpb25zLCAnQ2xvdWRGb3JtYXRpb24nLCAnRGVwbG95Jywge1xuICAgICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9DUkVBVEVfUkVQTEFDRScsXG4gICAgICAgIFN0YWNrTmFtZTogJ015U3RhY2snLFxuICAgICAgICBDaGFuZ2VTZXROYW1lOiAnTXlDaGFuZ2VTZXQnLFxuICAgICAgfSk7XG5cbiAgICAgIGRvbmUoKTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgndXNlcyBhIHNpbmdsZSBwZXJtaXNzaW9uIHN0YXRlbWVudCBpZiB0aGUgc2FtZSBDaGFuZ2VTZXQgbmFtZSBpcyB1c2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBwaXBlbGluZVJvbGUgPSBuZXcgUm9sZURvdWJsZShzdGFjaywgJ1BpcGVsaW5lUm9sZScpO1xuICAgICAgY29uc3QgYXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdUZXN0QXJ0aWZhY3QnKTtcbiAgICAgIG5ldyBTdGFnZURvdWJsZSh7XG4gICAgICAgIHBpcGVsaW5lOiBuZXcgUGlwZWxpbmVEb3VibGUoc3RhY2ssICdQaXBlbGluZScsIHsgcm9sZTogcGlwZWxpbmVSb2xlIH0pLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVJlcGxhY2VDaGFuZ2VTZXRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0FjdGlvbkEnLFxuICAgICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ015Q2hhbmdlU2V0JyxcbiAgICAgICAgICAgIHN0YWNrTmFtZTogJ1N0YWNrQScsXG4gICAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgICAgICAgIHRlbXBsYXRlUGF0aDogYXJ0aWZhY3QuYXRQYXRoKCdwYXRoL3RvL2ZpbGUnKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlUmVwbGFjZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiAnQWN0aW9uQicsXG4gICAgICAgICAgICBjaGFuZ2VTZXROYW1lOiAnTXlDaGFuZ2VTZXQnLFxuICAgICAgICAgICAgc3RhY2tOYW1lOiAnU3RhY2tCJyxcbiAgICAgICAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgICAgICAgICAgdGVtcGxhdGVQYXRoOiBhcnRpZmFjdC5hdFBhdGgoJ3BhdGgvdG8vb3RoZXIvZmlsZScpLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChcbiAgICAgICAgc3RhY2sucmVzb2x2ZShwaXBlbGluZVJvbGUuc3RhdGVtZW50cy5tYXAocyA9PiBzLnRvU3RhdGVtZW50SnNvbigpKSksXG4gICAgICApLnRvRXF1YWwoXG4gICAgICAgIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdpYW06UGFzc1JvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IFtcbiAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnUGlwZWxpbmVUZXN0U3RhZ2VBY3Rpb25BUm9sZTkyODNGQkUzJywgJ0FybiddIH0sXG4gICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ1BpcGVsaW5lVGVzdFN0YWdlQWN0aW9uQlJvbGVDQUJDOEZBNScsICdBcm4nXSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlQ2hhbmdlU2V0JyxcbiAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkRlbGV0ZUNoYW5nZVNldCcsXG4gICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZUNoYW5nZVNldCcsXG4gICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7IFN0cmluZ0VxdWFsc0lmRXhpc3RzOiB7ICdjbG91ZGZvcm1hdGlvbjpDaGFuZ2VTZXROYW1lJzogJ015Q2hhbmdlU2V0JyB9IH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpjbG91ZGZvcm1hdGlvbjonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6c3RhY2svU3RhY2tBLyonXV0gfSxcbiAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6Y2xvdWRmb3JtYXRpb246JywgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSwgJzonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnN0YWNrL1N0YWNrQi8qJ11dIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICApO1xuXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0V4ZWN1dGVDaGFuZ2VTZXQnLCAoKSA9PiB7XG4gICAgdGVzdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBwaXBlbGluZVJvbGUgPSBuZXcgUm9sZURvdWJsZShzdGFjaywgJ1BpcGVsaW5lUm9sZScpO1xuICAgICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2VEb3VibGUoe1xuICAgICAgICBwaXBlbGluZTogbmV3IFBpcGVsaW5lRG91YmxlKHN0YWNrLCAnUGlwZWxpbmUnLCB7IHJvbGU6IHBpcGVsaW5lUm9sZSB9KSxcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25FeGVjdXRlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdBY3Rpb24nLFxuICAgICAgICAgICAgY2hhbmdlU2V0TmFtZTogJ015Q2hhbmdlU2V0JyxcbiAgICAgICAgICAgIHN0YWNrTmFtZTogJ015U3RhY2snLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YWNrQXJuID0gX3N0YWNrQXJuKCdNeVN0YWNrJywgc3RhY2spO1xuICAgICAgX2Fzc2VydFBlcm1pc3Npb25HcmFudGVkKGRvbmUsIHN0YWNrLCBwaXBlbGluZVJvbGUuc3RhdGVtZW50cywgJ2Nsb3VkZm9ybWF0aW9uOkV4ZWN1dGVDaGFuZ2VTZXQnLCBzdGFja0FybixcbiAgICAgICAgeyBTdHJpbmdFcXVhbHNJZkV4aXN0czogeyAnY2xvdWRmb3JtYXRpb246Q2hhbmdlU2V0TmFtZSc6ICdNeUNoYW5nZVNldCcgfSB9KTtcblxuICAgICAgX2Fzc2VydEFjdGlvbk1hdGNoZXMoZG9uZSwgc3RhY2ssIHN0YWdlLmZ1bGxBY3Rpb25zLCAnQ2xvdWRGb3JtYXRpb24nLCAnRGVwbG95Jywge1xuICAgICAgICBBY3Rpb25Nb2RlOiAnQ0hBTkdFX1NFVF9FWEVDVVRFJyxcbiAgICAgICAgU3RhY2tOYW1lOiAnTXlTdGFjaycsXG4gICAgICAgIENoYW5nZVNldE5hbWU6ICdNeUNoYW5nZVNldCcsXG4gICAgICB9KTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndXNlcyBhIHNpbmdsZSBwZXJtaXNzaW9uIHN0YXRlbWVudCBpZiB0aGUgc2FtZSBDaGFuZ2VTZXQgbmFtZSBpcyB1c2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBwaXBlbGluZVJvbGUgPSBuZXcgUm9sZURvdWJsZShzdGFjaywgJ1BpcGVsaW5lUm9sZScpO1xuICAgICAgbmV3IFN0YWdlRG91YmxlKHtcbiAgICAgICAgcGlwZWxpbmU6IG5ldyBQaXBlbGluZURvdWJsZShzdGFjaywgJ1BpcGVsaW5lJywgeyByb2xlOiBwaXBlbGluZVJvbGUgfSksXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uRXhlY3V0ZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiAnQWN0aW9uQScsXG4gICAgICAgICAgICBjaGFuZ2VTZXROYW1lOiAnTXlDaGFuZ2VTZXQnLFxuICAgICAgICAgICAgc3RhY2tOYW1lOiAnU3RhY2tBJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uRXhlY3V0ZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICAgICAgICBhY3Rpb25OYW1lOiAnQWN0aW9uQicsXG4gICAgICAgICAgICBjaGFuZ2VTZXROYW1lOiAnTXlDaGFuZ2VTZXQnLFxuICAgICAgICAgICAgc3RhY2tOYW1lOiAnU3RhY2tCJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoXG4gICAgICAgIHN0YWNrLnJlc29sdmUocGlwZWxpbmVSb2xlLnN0YXRlbWVudHMubWFwKHMgPT4gcy50b1N0YXRlbWVudEpzb24oKSkpLFxuICAgICAgKS50b0VxdWFsKFxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZUNoYW5nZVNldCcsXG4gICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrcycsXG4gICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpFeGVjdXRlQ2hhbmdlU2V0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBDb25kaXRpb246IHsgU3RyaW5nRXF1YWxzSWZFeGlzdHM6IHsgJ2Nsb3VkZm9ybWF0aW9uOkNoYW5nZVNldE5hbWUnOiAnTXlDaGFuZ2VTZXQnIH0gfSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiBbXG4gICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmNsb3VkZm9ybWF0aW9uOicsIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpzdGFjay9TdGFja0EvKiddXSB9LFxuICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzpjbG91ZGZvcm1hdGlvbjonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6c3RhY2svU3RhY2tCLyonXV0gfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICk7XG5cblxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aGUgQ3JlYXRlVXBkYXRlU3RhY2sgQWN0aW9uIHNldHMgdGhlIERlc2NyaWJlU3RhY2sqLCBDcmVhdGUvVXBkYXRlL0RlbGV0ZVN0YWNrICYgUGFzc1JvbGUgcGVybWlzc2lvbnMnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHBpcGVsaW5lUm9sZSA9IG5ldyBSb2xlRG91YmxlKHN0YWNrLCAnUGlwZWxpbmVSb2xlJyk7XG4gICAgY29uc3QgYWN0aW9uID0gbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdBY3Rpb24nLFxuICAgICAgdGVtcGxhdGVQYXRoOiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdUZXN0QXJ0aWZhY3QnKS5hdFBhdGgoJ3NvbWUvZmlsZScpLFxuICAgICAgc3RhY2tOYW1lOiAnTXlTdGFjaycsXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIHJlcGxhY2VPbkZhaWx1cmU6IHRydWUsXG4gICAgfSk7XG4gICAgbmV3IFN0YWdlRG91YmxlKHtcbiAgICAgIHBpcGVsaW5lOiBuZXcgUGlwZWxpbmVEb3VibGUoc3RhY2ssICdQaXBlbGluZScsIHsgcm9sZTogcGlwZWxpbmVSb2xlIH0pLFxuICAgICAgYWN0aW9uczogW2FjdGlvbl0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2tBcm4gPSBfc3RhY2tBcm4oJ015U3RhY2snLCBzdGFjayk7XG5cbiAgICBfYXNzZXJ0UGVybWlzc2lvbkdyYW50ZWQoZG9uZSwgc3RhY2ssIHBpcGVsaW5lUm9sZS5zdGF0ZW1lbnRzLCAnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFjayonLCBzdGFja0Fybik7XG4gICAgX2Fzc2VydFBlcm1pc3Npb25HcmFudGVkKGRvbmUsIHN0YWNrLCBwaXBlbGluZVJvbGUuc3RhdGVtZW50cywgJ2Nsb3VkZm9ybWF0aW9uOkNyZWF0ZVN0YWNrJywgc3RhY2tBcm4pO1xuICAgIF9hc3NlcnRQZXJtaXNzaW9uR3JhbnRlZChkb25lLCBzdGFjaywgcGlwZWxpbmVSb2xlLnN0YXRlbWVudHMsICdjbG91ZGZvcm1hdGlvbjpVcGRhdGVTdGFjaycsIHN0YWNrQXJuKTtcbiAgICBfYXNzZXJ0UGVybWlzc2lvbkdyYW50ZWQoZG9uZSwgc3RhY2ssIHBpcGVsaW5lUm9sZS5zdGF0ZW1lbnRzLCAnY2xvdWRmb3JtYXRpb246RGVsZXRlU3RhY2snLCBzdGFja0Fybik7XG5cbiAgICBfYXNzZXJ0UGVybWlzc2lvbkdyYW50ZWQoZG9uZSwgc3RhY2ssIHBpcGVsaW5lUm9sZS5zdGF0ZW1lbnRzLCAnaWFtOlBhc3NSb2xlJywgYWN0aW9uLmRlcGxveW1lbnRSb2xlLnJvbGVBcm4pO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICB0ZXN0KCd0aGUgRGVsZXRlU3RhY2sgQWN0aW9uIHNldHMgdGhlIERlc2NyaWJlU3RhY2sqLCBEZWxldGVTdGFjayAmIFBhc3NSb2xlIHBlcm1pc3Npb25zJywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBwaXBlbGluZVJvbGUgPSBuZXcgUm9sZURvdWJsZShzdGFjaywgJ1BpcGVsaW5lUm9sZScpO1xuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25EZWxldGVTdGFja0FjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQWN0aW9uJyxcbiAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgICAgc3RhY2tOYW1lOiAnTXlTdGFjaycsXG4gICAgfSk7XG4gICAgbmV3IFN0YWdlRG91YmxlKHtcbiAgICAgIHBpcGVsaW5lOiBuZXcgUGlwZWxpbmVEb3VibGUoc3RhY2ssICdQaXBlbGluZScsIHsgcm9sZTogcGlwZWxpbmVSb2xlIH0pLFxuICAgICAgYWN0aW9uczogW2FjdGlvbl0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2tBcm4gPSBfc3RhY2tBcm4oJ015U3RhY2snLCBzdGFjayk7XG5cbiAgICBfYXNzZXJ0UGVybWlzc2lvbkdyYW50ZWQoZG9uZSwgc3RhY2ssIHBpcGVsaW5lUm9sZS5zdGF0ZW1lbnRzLCAnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFjayonLCBzdGFja0Fybik7XG4gICAgX2Fzc2VydFBlcm1pc3Npb25HcmFudGVkKGRvbmUsIHN0YWNrLCBwaXBlbGluZVJvbGUuc3RhdGVtZW50cywgJ2Nsb3VkZm9ybWF0aW9uOkRlbGV0ZVN0YWNrJywgc3RhY2tBcm4pO1xuXG4gICAgX2Fzc2VydFBlcm1pc3Npb25HcmFudGVkKGRvbmUsIHN0YWNrLCBwaXBlbGluZVJvbGUuc3RhdGVtZW50cywgJ2lhbTpQYXNzUm9sZScsIGFjdGlvbi5kZXBsb3ltZW50Um9sZS5yb2xlQXJuKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuaW50ZXJmYWNlIFBvbGljeVN0YXRlbWVudEpzb24ge1xuICBFZmZlY3Q6ICdBbGxvdycgfCAnRGVueSc7XG4gIEFjdGlvbjogc3RyaW5nIHwgc3RyaW5nW107XG4gIFJlc291cmNlOiBzdHJpbmcgfMKgc3RyaW5nW107XG4gIENvbmRpdGlvbjogYW55O1xufVxuXG5mdW5jdGlvbiBfYXNzZXJ0QWN0aW9uTWF0Y2hlcyhcbiAgZG9uZTogamVzdC5Eb25lQ2FsbGJhY2ssXG4gIHN0YWNrOiBjZGsuU3RhY2ssXG4gIGFjdGlvbnM6IEZ1bGxBY3Rpb25bXSxcbiAgcHJvdmlkZXI6IHN0cmluZyxcbiAgY2F0ZWdvcnk6IHN0cmluZyxcbiAgY29uZmlndXJhdGlvbj86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcbiAgY29uc3QgY29uZmlndXJhdGlvblN0ciA9IGNvbmZpZ3VyYXRpb25cbiAgICA/IGAsIGNvbmZpZ3VyYXRpb24gaW5jbHVkaW5nICR7SlNPTi5zdHJpbmdpZnkoc3RhY2sucmVzb2x2ZShjb25maWd1cmF0aW9uKSwgbnVsbCwgMil9YFxuICAgIDogJyc7XG4gIGNvbnN0IGFjdGlvbnNTdHIgPSBKU09OLnN0cmluZ2lmeShhY3Rpb25zLm1hcChhID0+XG4gICAgKHtcbiAgICAgIG93bmVyOiBhLmFjdGlvblByb3BlcnRpZXMub3duZXIsXG4gICAgICBwcm92aWRlcjogYS5hY3Rpb25Qcm9wZXJ0aWVzLnByb3ZpZGVyLFxuICAgICAgY2F0ZWdvcnk6IGEuYWN0aW9uUHJvcGVydGllcy5jYXRlZ29yeSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IHN0YWNrLnJlc29sdmUoYS5hY3Rpb25Db25maWcuY29uZmlndXJhdGlvbiksXG4gICAgfSksXG4gICksIG51bGwsIDIpO1xuICBpZiAoIV9oYXNBY3Rpb24oc3RhY2ssIGFjdGlvbnMsIHByb3ZpZGVyLCBjYXRlZ29yeSwgY29uZmlndXJhdGlvbikpIHtcbiAgICBkb25lLmZhaWwoYEV4cGVjdGVkIHRvIGZpbmQgYW4gYWN0aW9uIHdpdGggcHJvdmlkZXIgJHtwcm92aWRlcn0sIGNhdGVnb3J5ICR7Y2F0ZWdvcnl9JHtjb25maWd1cmF0aW9uU3RyfSwgYnV0IGZvdW5kICR7YWN0aW9uc1N0cn1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfaGFzQWN0aW9uKFxuICBzdGFjazogY2RrLlN0YWNrLCBhY3Rpb25zOiBGdWxsQWN0aW9uW10sIHByb3ZpZGVyOiBzdHJpbmcsIGNhdGVnb3J5OiBzdHJpbmcsXG4gIGNvbmZpZ3VyYXRpb24/OiB7IFtrZXk6IHN0cmluZ106IGFueX0pIHtcbiAgZm9yIChjb25zdCBhY3Rpb24gb2YgYWN0aW9ucykge1xuICAgIGlmIChhY3Rpb24uYWN0aW9uUHJvcGVydGllcy5wcm92aWRlciAhPT0gcHJvdmlkZXIpwqB7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLmNhdGVnb3J5ICE9PSBjYXRlZ29yeSnCoHsgY29udGludWU7IH1cbiAgICBpZiAoY29uZmlndXJhdGlvbiAmJiAhYWN0aW9uLmFjdGlvbkNvbmZpZy5jb25maWd1cmF0aW9uKSB7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGNvbmZpZ3VyYXRpb24pKSB7XG4gICAgICAgIGlmICghXy5pc0VxdWFsKHN0YWNrLnJlc29sdmUoYWN0aW9uLmFjdGlvbkNvbmZpZy5jb25maWd1cmF0aW9uW2tleV0pLCBzdGFjay5yZXNvbHZlKGNvbmZpZ3VyYXRpb25ba2V5XSkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfYXNzZXJ0UGVybWlzc2lvbkdyYW50ZWQoXG4gIGRvbmU6IGplc3QuRG9uZUNhbGxiYWNrLFxuICBzdGFjazogY2RrLlN0YWNrLFxuICBzdGF0ZW1lbnRzOiBpYW0uUG9saWN5U3RhdGVtZW50W10sXG4gIGFjdGlvbjogc3RyaW5nLFxuICByZXNvdXJjZTogc3RyaW5nLFxuICBjb25kaXRpb25zPzogYW55KSB7XG4gIGNvbnN0IGNvbmRpdGlvblN0ciA9IGNvbmRpdGlvbnNcbiAgICA/IGAgd2l0aCBjb25kaXRpb24ocykgJHtKU09OLnN0cmluZ2lmeShzdGFjay5yZXNvbHZlKGNvbmRpdGlvbnMpKX1gXG4gICAgOiAnJztcbiAgY29uc3QgcmVzb2x2ZWRTdGF0ZW1lbnRzID0gc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnRzLm1hcChzID0+IHMudG9TdGF0ZW1lbnRKc29uKCkpKTtcbiAgY29uc3Qgc3RhdGVtZW50c1N0ciA9IEpTT04uc3RyaW5naWZ5KHJlc29sdmVkU3RhdGVtZW50cywgbnVsbCwgMik7XG4gIGlmICghX2dyYW50c1Blcm1pc3Npb24oc3RhY2ssIHJlc29sdmVkU3RhdGVtZW50cywgYWN0aW9uLCByZXNvdXJjZSwgY29uZGl0aW9ucykpIHtcbiAgICBkb25lLmZhaWwoYEV4cGVjdGVkIHRvIGZpbmQgYSBzdGF0ZW1lbnQgZ3JhbnRpbmcgJHthY3Rpb259IG9uICR7SlNPTi5zdHJpbmdpZnkoc3RhY2sucmVzb2x2ZShyZXNvdXJjZSkpfSR7Y29uZGl0aW9uU3RyfSwgZm91bmQ6XFxuJHtzdGF0ZW1lbnRzU3RyfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9ncmFudHNQZXJtaXNzaW9uKHN0YWNrOiBjZGsuU3RhY2ssIHN0YXRlbWVudHM6IFBvbGljeVN0YXRlbWVudEpzb25bXSwgYWN0aW9uOiBzdHJpbmcsIHJlc291cmNlOiBzdHJpbmcsIGNvbmRpdGlvbnM/OiBhbnkpIHtcbiAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2Ygc3RhdGVtZW50cy5maWx0ZXIocyA9PiBzLkVmZmVjdCA9PT0gJ0FsbG93JykpIHtcbiAgICBpZiAoIV9pc09yQ29udGFpbnMoc3RhY2ssIHN0YXRlbWVudC5BY3Rpb24sIGFjdGlvbikpIHsgY29udGludWU7IH1cbiAgICBpZiAoIV9pc09yQ29udGFpbnMoc3RhY2ssIHN0YXRlbWVudC5SZXNvdXJjZSwgcmVzb3VyY2UpKSB7IGNvbnRpbnVlOyB9XG4gICAgaWYgKGNvbmRpdGlvbnMgJiYgIV9pc09yQ29udGFpbnMoc3RhY2ssIHN0YXRlbWVudC5Db25kaXRpb24sIGNvbmRpdGlvbnMpKSB7IGNvbnRpbnVlOyB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfaXNPckNvbnRhaW5zKHN0YWNrOiBjZGsuU3RhY2ssIGVudGl0eTogc3RyaW5nIHwgc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgcmVzb2x2ZWRWYWx1ZSA9IHN0YWNrLnJlc29sdmUodmFsdWUpO1xuICBjb25zdCByZXNvbHZlZEVudGl0eSA9IHN0YWNrLnJlc29sdmUoZW50aXR5KTtcbiAgaWYgKF8uaXNFcXVhbChyZXNvbHZlZEVudGl0eSwgcmVzb2x2ZWRWYWx1ZSkpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKCFBcnJheS5pc0FycmF5KHJlc29sdmVkRW50aXR5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgZm9yIChjb25zdCB0ZXN0ZWQgb2YgZW50aXR5KSB7XG4gICAgaWYgKF8uaXNFcXVhbCh0ZXN0ZWQsIHJlc29sdmVkVmFsdWUpKSB7IHJldHVybiB0cnVlOyB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfc3RhY2tBcm4oc3RhY2tOYW1lOiBzdHJpbmcsIHNjb3BlOiBJQ29uc3RydWN0KTogc3RyaW5nIHtcbiAgcmV0dXJuIGNkay5TdGFjay5vZihzY29wZSkuZm9ybWF0QXJuKHtcbiAgICBzZXJ2aWNlOiAnY2xvdWRmb3JtYXRpb24nLFxuICAgIHJlc291cmNlOiAnc3RhY2snLFxuICAgIHJlc291cmNlTmFtZTogYCR7c3RhY2tOYW1lfS8qYCxcbiAgfSk7XG59XG5cbmNsYXNzIFBpcGVsaW5lRG91YmxlIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgY29kZXBpcGVsaW5lLklQaXBlbGluZSB7XG4gIHB1YmxpYyByZWFkb25seSBwaXBlbGluZU5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHBpcGVsaW5lQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSByb2xlOiBpYW0uUm9sZTtcbiAgcHVibGljIHJlYWRvbmx5IGFydGlmYWN0QnVja2V0OiBzMy5JQnVja2V0O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHsgcGlwZWxpbmVOYW1lLCByb2xlIH06IHsgcGlwZWxpbmVOYW1lPzogc3RyaW5nLCByb2xlOiBpYW0uUm9sZSB9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICB0aGlzLnBpcGVsaW5lTmFtZSA9IHBpcGVsaW5lTmFtZSB8fCAnVGVzdFBpcGVsaW5lJztcbiAgICB0aGlzLnBpcGVsaW5lQXJuID0gY2RrLlN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7IHNlcnZpY2U6ICdjb2RlcGlwZWxpbmUnLCByZXNvdXJjZTogJ3BpcGVsaW5lJywgcmVzb3VyY2VOYW1lOiB0aGlzLnBpcGVsaW5lTmFtZSB9KTtcbiAgICB0aGlzLnJvbGUgPSByb2xlO1xuICAgIHRoaXMuYXJ0aWZhY3RCdWNrZXQgPSBuZXcgQnVja2V0RG91YmxlKHNjb3BlLCAnQnVja2V0RG91YmxlJyk7XG4gIH1cblxuICBwdWJsaWMgb25FdmVudChfaWQ6IHN0cmluZywgX29wdGlvbnM6IGV2ZW50cy5PbkV2ZW50T3B0aW9ucyk6IGV2ZW50cy5SdWxlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cbiAgcHVibGljIG9uU3RhdGVDaGFuZ2UoX2lkOiBzdHJpbmcsIF9vcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMpOiBldmVudHMuUnVsZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICB9XG4gIHB1YmxpYyBub3RpZnlPbihcbiAgICBfaWQ6IHN0cmluZyxcbiAgICBfdGFyZ2V0OiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlVGFyZ2V0LFxuICAgIF9vcHRpb25zOiBjb2RlcGlwZWxpbmUuUGlwZWxpbmVOb3RpZnlPbk9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICB9XG4gIHB1YmxpYyBub3RpZnlPbkV4ZWN1dGlvblN0YXRlQ2hhbmdlKFxuICAgIF9pZDogc3RyaW5nLFxuICAgIF90YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgX29wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgfVxuICBwdWJsaWMgbm90aWZ5T25BbnlTdGFnZVN0YXRlQ2hhbmdlKFxuICAgIF9pZDogc3RyaW5nLFxuICAgIF90YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgX29wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cbiAgcHVibGljIG5vdGlmeU9uQW55QWN0aW9uU3RhdGVDaGFuZ2UoXG4gICAgX2lkOiBzdHJpbmcsXG4gICAgX3RhcmdldDogbm90aWZpY2F0aW9ucy5JTm90aWZpY2F0aW9uUnVsZVRhcmdldCxcbiAgICBfb3B0aW9ucz86IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZU9wdGlvbnMsXG4gICk6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGUge1xuICAgIHRocm93IG5ldyBFcnJvcignTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC4nKTtcbiAgfVxuICBwdWJsaWMgbm90aWZ5T25BbnlNYW51YWxBcHByb3ZhbFN0YXRlQ2hhbmdlKFxuICAgIF9pZDogc3RyaW5nLFxuICAgIF90YXJnZXQ6IG5vdGlmaWNhdGlvbnMuSU5vdGlmaWNhdGlvblJ1bGVUYXJnZXQsXG4gICAgX29wdGlvbnM/OiBub3RpZmljYXRpb25zLk5vdGlmaWNhdGlvblJ1bGVPcHRpb25zLFxuICApOiBub3RpZmljYXRpb25zLklOb3RpZmljYXRpb25SdWxlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01ldGhvZCBub3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cbiAgcHVibGljIGJpbmRBc05vdGlmaWNhdGlvblJ1bGVTb3VyY2UoXG4gICAgX3Njb3BlOiBDb25zdHJ1Y3QsXG4gICk6IG5vdGlmaWNhdGlvbnMuTm90aWZpY2F0aW9uUnVsZVNvdXJjZUNvbmZpZyB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNZXRob2Qgbm90IGltcGxlbWVudGVkLicpO1xuICB9XG59XG5cbmNsYXNzIEZ1bGxBY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBhY3Rpb25Qcm9wZXJ0aWVzOiBjb2RlcGlwZWxpbmUuQWN0aW9uUHJvcGVydGllcyxcbiAgICByZWFkb25seSBhY3Rpb25Db25maWc6IGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcpIHtcbiAgICAvLyBlbXB0eVxuICB9XG59XG5cbmNsYXNzIFN0YWdlRG91YmxlIGltcGxlbWVudHMgY29kZXBpcGVsaW5lLklTdGFnZSB7XG4gIHB1YmxpYyByZWFkb25seSBzdGFnZU5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHBpcGVsaW5lOiBjb2RlcGlwZWxpbmUuSVBpcGVsaW5lO1xuICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9uczogY29kZXBpcGVsaW5lLklBY3Rpb25bXSA9IFtdO1xuICBwdWJsaWMgcmVhZG9ubHkgZnVsbEFjdGlvbnM6IEZ1bGxBY3Rpb25bXTtcblxuICBwdWJsaWMgZ2V0IG5vZGUoKTogTm9kZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTdGFnZURvdWJsZSBpcyBub3QgYSByZWFsIGNvbnN0cnVjdCcpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoeyBuYW1lLCBwaXBlbGluZSwgYWN0aW9ucyB9OiB7IG5hbWU/OiBzdHJpbmcsIHBpcGVsaW5lOiBQaXBlbGluZURvdWJsZSwgYWN0aW9uczogY29kZXBpcGVsaW5lLklBY3Rpb25bXSB9KSB7XG4gICAgdGhpcy5zdGFnZU5hbWUgPSBuYW1lIHx8ICdUZXN0U3RhZ2UnO1xuICAgIHRoaXMucGlwZWxpbmUgPSBwaXBlbGluZTtcblxuICAgIGNvbnN0IHN0YWdlUGFyZW50ID0gbmV3IENvbnN0cnVjdChwaXBlbGluZSwgdGhpcy5zdGFnZU5hbWUpO1xuICAgIGNvbnN0IGZ1bGxBY3Rpb25zID0gbmV3IEFycmF5PEZ1bGxBY3Rpb24+KCk7XG4gICAgZm9yIChjb25zdCBhY3Rpb24gb2YgYWN0aW9ucykge1xuICAgICAgY29uc3QgYWN0aW9uUGFyZW50ID0gbmV3IENvbnN0cnVjdChzdGFnZVBhcmVudCwgYWN0aW9uLmFjdGlvblByb3BlcnRpZXMuYWN0aW9uTmFtZSk7XG4gICAgICBmdWxsQWN0aW9ucy5wdXNoKG5ldyBGdWxsQWN0aW9uKGFjdGlvbi5hY3Rpb25Qcm9wZXJ0aWVzLCBhY3Rpb24uYmluZChhY3Rpb25QYXJlbnQsIHRoaXMsIHtcbiAgICAgICAgcm9sZTogcGlwZWxpbmUucm9sZSxcbiAgICAgICAgYnVja2V0OiBwaXBlbGluZS5hcnRpZmFjdEJ1Y2tldCxcbiAgICAgIH0pKSk7XG4gICAgfVxuICAgIHRoaXMuZnVsbEFjdGlvbnMgPSBmdWxsQWN0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBhZGRBY3Rpb24oX2FjdGlvbjogY29kZXBpcGVsaW5lLklBY3Rpb24pOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZEFjdGlvbigpIGlzIG5vdCBzdXBwb3J0ZWQgb24gU3RhZ2VEb3VibGUnKTtcbiAgfVxuXG4gIHB1YmxpYyBvblN0YXRlQ2hhbmdlKF9uYW1lOiBzdHJpbmcsIF90YXJnZXQ/OiBldmVudHMuSVJ1bGVUYXJnZXQsIF9vcHRpb25zPzogZXZlbnRzLlJ1bGVQcm9wcyk6XG4gIGV2ZW50cy5SdWxlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29uU3RhdGVDaGFuZ2UoKSBpcyBub3Qgc3VwcG9ydGVkIG9uIFN0YWdlRG91YmxlJyk7XG4gIH1cbn1cblxuY2xhc3MgUm9sZURvdWJsZSBleHRlbmRzIGlhbS5Sb2xlIHtcbiAgcHVibGljIHJlYWRvbmx5IHN0YXRlbWVudHMgPSBuZXcgQXJyYXk8aWFtLlBvbGljeVN0YXRlbWVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogaWFtLlJvbGVQcm9wcyA9IHsgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3Rlc3QnKSB9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9Qb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgc3VwZXIuYWRkVG9Qb2xpY3koc3RhdGVtZW50KTtcbiAgICB0aGlzLnN0YXRlbWVudHMucHVzaChzdGF0ZW1lbnQpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbmNsYXNzIEJ1Y2tldERvdWJsZSBleHRlbmRzIHMzLkJ1Y2tldCB7XG4gIHB1YmxpYyBncmFudFJlYWQoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlLCBfb2JqZWN0c0tleVBhdHRlcm46IGFueSA9ICcqJyk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5kcm9wKGlkZW50aXR5LCAnJyk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRXcml0ZShpZGVudGl0eTogaWFtLklHcmFudGFibGUsIF9vYmplY3RzS2V5UGF0dGVybjogYW55ID0gJyonKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmRyb3AoaWRlbnRpdHksICcnKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudFJlYWRXcml0ZShpZGVudGl0eTogaWFtLklHcmFudGFibGUsIF9vYmplY3RzS2V5UGF0dGVybjogYW55ID0gJyonKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmRyb3AoaWRlbnRpdHksICcnKTtcbiAgfVxufVxuIl19