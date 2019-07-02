import codepipeline = require('@aws-cdk/aws-codepipeline');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import { Stack } from '@aws-cdk/core';
import _ = require('lodash');
import nodeunit = require('nodeunit');
import cpactions = require('../../lib');

export = nodeunit.testCase({
  'CreateReplaceChangeSet': {
    'works'(test: nodeunit.Test) {
      const stack = new cdk.Stack();
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

      _assertPermissionGranted(test, pipelineRole.statements, 'iam:PassRole', action.deploymentRole.roleArn);

      const stackArn = _stackArn('MyStack', stack);
      const changeSetCondition = { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } };
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeStacks', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeChangeSet', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:CreateChangeSet', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DeleteChangeSet', stackArn, changeSetCondition);

      // TODO: revert "as any" once we move all actions into a single package.
      test.deepEqual(stage.actions[0].actionProperties.inputs, [artifact],
                     'The input was correctly registered');

      _assertActionMatches(test, stage.actions, 'CloudFormation', 'Deploy', {
        ActionMode: 'CHANGE_SET_CREATE_REPLACE',
        StackName: 'MyStack',
        ChangeSetName: 'MyChangeSet'
      });

      test.done();
    },

    'uses a single permission statement if the same ChangeSet name is used'(test: nodeunit.Test) {
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
            templatePath: artifact.atPath('path/to/file')
          }),
          new cpactions.CloudFormationCreateReplaceChangeSetAction({
            actionName: 'ActionB',
            changeSetName: 'MyChangeSet',
            stackName: 'StackB',
            adminPermissions: false,
            templatePath: artifact.atPath('path/to/other/file')
          }),
        ],
      });

      test.deepEqual(
        stack.resolve(pipelineRole.statements.map(s => s.toStatementJson())),
        [
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: [
              { 'Fn::GetAtt': [ 'PipelineTestStageActionARole9283FBE3', 'Arn' ] },
              { 'Fn::GetAtt': [ 'PipelineTestStageActionBRoleCABC8FA5', 'Arn' ] }
            ],
          },
          {
            Action: [
              'cloudformation:CreateChangeSet',
              'cloudformation:DeleteChangeSet',
              'cloudformation:DescribeChangeSet',
              'cloudformation:DescribeStacks'
            ],
            Condition: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } },
            Effect: 'Allow',
            Resource: [
              // tslint:disable-next-line:max-line-length
              { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackA/*' ] ] },
              // tslint:disable-next-line:max-line-length
              { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackB/*' ] ] }
            ],
          }
        ]
      );

      test.done();
    }
  },

  'ExecuteChangeSet': {
    'works'(test: nodeunit.Test) {
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
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:ExecuteChangeSet', stackArn,
                               { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } });

      _assertActionMatches(test, stage.actions, 'CloudFormation', 'Deploy', {
        ActionMode: 'CHANGE_SET_EXECUTE',
        StackName: 'MyStack',
        ChangeSetName: 'MyChangeSet'
      });

      test.done();
    },

    'uses a single permission statement if the same ChangeSet name is used'(test: nodeunit.Test) {
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

      test.deepEqual(
        stack.resolve(pipelineRole.statements.map(s => s.toStatementJson())),
        [
          {
            Action: [
              'cloudformation:DescribeChangeSet',
              'cloudformation:DescribeStacks',
              'cloudformation:ExecuteChangeSet',
            ],
            Condition: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } },
            Effect: 'Allow',
            Resource: [
              // tslint:disable-next-line:max-line-length
              { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackA/*' ] ] },
              // tslint:disable-next-line:max-line-length
              { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':cloudformation:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':stack/StackB/*' ] ] }
            ],
          }
        ]
      );

      test.done();
    }
  },

  'the CreateUpdateStack Action sets the DescribeStack*, Create/Update/DeleteStack & PassRole permissions'(test: nodeunit.Test) {
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

    _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeStack*', stackArn);
    _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:CreateStack', stackArn);
    _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:UpdateStack', stackArn);
    _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DeleteStack', stackArn);

    _assertPermissionGranted(test, pipelineRole.statements, 'iam:PassRole', action.deploymentRole.roleArn);

    test.done();
  },

  'the DeleteStack Action sets the DescribeStack*, DeleteStack & PassRole permissions'(test: nodeunit.Test) {
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

    _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeStack*', stackArn);
    _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DeleteStack', stackArn);

    _assertPermissionGranted(test, pipelineRole.statements, 'iam:PassRole', action.deploymentRole.roleArn);

    test.done();
  },
});

interface PolicyStatementJson {
  Effect: 'Allow' | 'Deny';
  Action: string | string[];
  Resource: string | string[];
  Condition: any;
}

function _assertActionMatches(test: nodeunit.Test,
                              actions: FullAction[],
                              provider: string,
                              category: string,
                              configuration?: { [key: string]: any }) {
  const configurationStr = configuration
                         ? `, configuration including ${JSON.stringify(resolve(configuration), null, 2)}`
                         : '';
  const actionsStr = JSON.stringify(actions.map(a =>
    ({ owner: a.actionProperties.owner, provider: a.actionProperties.provider,
      category: a.actionProperties.category, configuration: resolve(a.actionConfig.configuration)
    })
  ), null, 2);
  test.ok(_hasAction(actions, provider, category, configuration),
          `Expected to find an action with provider ${provider}, category ${category}${configurationStr}, but found ${actionsStr}`);
}

function _hasAction(actions: FullAction[], provider: string, category: string,
                    configuration?: { [key: string]: any}) {
  for (const action of actions) {
    if (action.actionProperties.provider !== provider) { continue; }
    if (action.actionProperties.category !== category) { continue; }
    if (configuration && !action.actionConfig.configuration) { continue; }
    if (configuration) {
      for (const key of Object.keys(configuration)) {
        if (!_.isEqual(resolve(action.actionConfig.configuration[key]), resolve(configuration[key]))) {
          continue;
        }
      }
    }
    return true;
  }
  return false;
}

function _assertPermissionGranted(test: nodeunit.Test, statements: iam.PolicyStatement[], action: string, resource: string, conditions?: any) {
  const conditionStr = conditions
                     ? ` with condition(s) ${JSON.stringify(resolve(conditions))}`
                     : '';
  const resolvedStatements = resolve(statements.map(s => s.toStatementJson()));
  const statementsStr = JSON.stringify(resolvedStatements, null, 2);
  test.ok(_grantsPermission(resolvedStatements, action, resource, conditions),
          `Expected to find a statement granting ${action} on ${JSON.stringify(resolve(resource))}${conditionStr}, found:\n${statementsStr}`);
}

function _grantsPermission(statements: PolicyStatementJson[], action: string, resource: string, conditions?: any) {
  for (const statement of statements.filter(s => s.Effect === 'Allow')) {
    if (!_isOrContains(statement.Action, action)) { continue; }
    if (!_isOrContains(statement.Resource, resource)) { continue; }
    if (conditions && !_isOrContains(statement.Condition, conditions)) { continue; }
    return true;
  }
  return false;
}

function _isOrContains(entity: string | string[], value: string): boolean {
  const resolvedValue = resolve(value);
  const resolvedEntity = resolve(entity);
  if (_.isEqual(resolvedEntity, resolvedValue)) { return true; }
  if (!Array.isArray(resolvedEntity)) { return false; }
  for (const tested of entity) {
    if (_.isEqual(tested, resolvedValue)) { return true; }
  }
  return false;
}

function _stackArn(stackName: string, scope: cdk.IConstruct): string {
  return Stack.of(scope).formatArn({
    service: 'cloudformation',
    resource: 'stack',
    resourceName: `${stackName}/*`,
  });
}

class PipelineDouble extends cdk.Resource implements codepipeline.IPipeline {
  public readonly pipelineName: string;
  public readonly pipelineArn: string;
  public readonly role: iam.Role;
  public readonly artifactBucket: s3.IBucket;

  constructor(scope: cdk.Construct, id: string, { pipelineName, role }: { pipelineName?: string, role: iam.Role }) {
    super(scope, id);
    this.pipelineName = pipelineName || 'TestPipeline';
    this.pipelineArn = Stack.of(this).formatArn({ service: 'codepipeline', resource: 'pipeline', resourceName: this.pipelineName });
    this.role = role;
    this.artifactBucket = new BucketDouble(scope, 'BucketDouble');
  }

  public onEvent(_id: string, _options: events.OnEventOptions): events.Rule {
    throw new Error("Method not implemented.");
  }
  public onStateChange(_id: string, _options: events.OnEventOptions): events.Rule {
    throw new Error("Method not implemented.");
  }
}

class FullAction {
  constructor(readonly actionProperties: codepipeline.ActionProperties,
              readonly actionConfig: codepipeline.ActionConfig) {
    // empty
  }
}

class StageDouble implements codepipeline.IStage {
  public readonly stageName: string;
  public readonly pipeline: codepipeline.IPipeline;
  public readonly actions: FullAction[];

  public get node(): cdk.ConstructNode {
    throw new Error('StageDouble is not a real construct');
  }

  constructor({ name, pipeline, actions }: { name?: string, pipeline: PipelineDouble, actions: codepipeline.IAction[] }) {
    this.stageName = name || 'TestStage';
    this.pipeline = pipeline;

    const stageParent = new cdk.Construct(pipeline, this.stageName);
    const fullActions = new Array<FullAction>();
    for (const action of actions) {
      const actionParent = new cdk.Construct(stageParent, action.actionProperties.actionName);
      fullActions.push(new FullAction(action.actionProperties, action.bind(actionParent, this, {
        role: pipeline.role,
        bucket: pipeline.artifactBucket,
      })));
    }
    this.actions = fullActions;
  }

  public addAction(_action: codepipeline.IAction): void {
    throw new Error('addAction() is not supported on StageDouble');
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps):
      events.Rule {
    throw new Error('onStateChange() is not supported on StageDouble');
  }
}

class RoleDouble extends iam.Role {
  public readonly statements = new Array<iam.PolicyStatement>();

  constructor(scope: cdk.Construct, id: string, props: iam.RoleProps = { assumedBy: new iam.ServicePrincipal('test') }) {
    super(scope, id, props);
  }

  public addToPolicy(statement: iam.PolicyStatement): boolean {
    super.addToPolicy(statement);
    this.statements.push(statement);
    return true;
  }
}

class BucketDouble extends s3.Bucket {
  public grantRead(identity: iam.IGrantable, _objectsKeyPattern: any = '*'): iam.Grant {
    return iam.Grant.drop(identity, '');
  }

  public grantWrite(identity: iam.IGrantable, _objectsKeyPattern: any = '*'): iam.Grant {
    return iam.Grant.drop(identity, '');
  }

  public grantReadWrite(identity: iam.IGrantable, _objectsKeyPattern: any = '*'): iam.Grant {
    return iam.Grant.drop(identity, '');
  }
}

function resolve(x: any): any {
  return new cdk.Stack().resolve(x);
}
