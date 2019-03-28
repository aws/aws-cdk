import cpapi = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import _ = require('lodash');
import nodeunit = require('nodeunit');
import cloudformation = require('../lib');

export = nodeunit.testCase({
  'CreateReplaceChangeSet': {
    'works'(test: nodeunit.Test) {
      const stack = new cdk.Stack();
      const pipelineRole = new RoleDouble(stack, 'PipelineRole');
      const artifact = new cpapi.Artifact('TestArtifact');
      const action = new cloudformation.PipelineCreateReplaceChangeSetAction({
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
      test.deepEqual((action as any)._inputArtifacts, [artifact],
                     'The inputArtifact was correctly registered');

      _assertActionMatches(test, stage.actions, 'AWS', 'CloudFormation', 'Deploy', {
        ActionMode: 'CHANGE_SET_CREATE_REPLACE',
        StackName: 'MyStack',
        ChangeSetName: 'MyChangeSet'
      });

      test.done();
    },

    'uses a single permission statement if the same ChangeSet name is used'(test: nodeunit.Test) {
      const stack = new cdk.Stack();
      const pipelineRole = new RoleDouble(stack, 'PipelineRole');
      const artifact = new cpapi.Artifact('TestArtifact');
      new StageDouble({
        pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }),
        actions: [
          new cloudformation.PipelineCreateReplaceChangeSetAction({
            actionName: 'ActionA',
            changeSetName: 'MyChangeSet',
            stackName: 'StackA',
            adminPermissions: false,
            templatePath: artifact.atPath('path/to/file')
          }),
          new cloudformation.PipelineCreateReplaceChangeSetAction({
            actionName: 'ActionB',
            changeSetName: 'MyChangeSet',
            stackName: 'StackB',
            adminPermissions: false,
            templatePath: artifact.atPath('path/to/other/file')
          }),
        ],
      });

      test.deepEqual(
        stack.node.resolve(pipelineRole.statements),
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
          new cloudformation.PipelineExecuteChangeSetAction({
            actionName: 'Action',
            changeSetName: 'MyChangeSet',
            stackName: 'MyStack',
          }),
        ],
      });

      const stackArn = _stackArn('MyStack', stack);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:ExecuteChangeSet', stackArn,
                               { StringEquals: { 'cloudformation:ChangeSetName': 'MyChangeSet' } });

      _assertActionMatches(test, stage.actions, 'AWS', 'CloudFormation', 'Deploy', {
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
          new cloudformation.PipelineExecuteChangeSetAction({
            actionName: 'ActionA',
            changeSetName: 'MyChangeSet',
            stackName: 'StackA',
          }),
          new cloudformation.PipelineExecuteChangeSetAction({
            actionName: 'ActionB',
            changeSetName: 'MyChangeSet',
            stackName: 'StackB',
          }),
        ],
      });

      test.deepEqual(
        stack.node.resolve(pipelineRole.statements),
        [
          {
            Action: 'cloudformation:ExecuteChangeSet',
            Condition: { StringEquals: { 'cloudformation:ChangeSetName': 'MyChangeSet' } },
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
    const action = new cloudformation.PipelineCreateUpdateStackAction({
      actionName: 'Action',
      templatePath: new cpapi.Artifact('TestArtifact').atPath('some/file'),
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
    const action = new cloudformation.PipelineDeleteStackAction({
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
                              actions: cpapi.Action[],
                              owner: string,
                              provider: string,
                              category: string,
                              configuration?: { [key: string]: any }) {
  const configurationStr = configuration
                         ? `configuration including ${JSON.stringify(resolve(configuration), null, 2)}`
                         : '';
  const actionsStr = JSON.stringify(actions.map(a =>
    ({ owner: a.owner, provider: a.provider, category: a.category, configuration: resolve(a.configuration) })
  ), null, 2);
  test.ok(_hasAction(actions, owner, provider, category, configuration),
          `Expected to find an action with owner ${owner}, provider ${provider}, category ${category}${configurationStr}, but found ${actionsStr}`);
}

function _hasAction(actions: cpapi.Action[], owner: string, provider: string, category: string, configuration?: { [key: string]: any}) {
  for (const action of actions) {
    if (action.owner !== owner) { continue; }
    if (action.provider !== provider) { continue; }
    if (action.category !== category) { continue; }
    if (configuration && !action.configuration) { continue; }
    if (configuration) {
      for (const key of Object.keys(configuration)) {
        if (!_.isEqual(resolve(action.configuration[key]), resolve(configuration[key]))) {
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
  const resolvedStatements = resolve(statements);
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
  return scope.node.stack.formatArn({
    service: 'cloudformation',
    resource: 'stack',
    resourceName: `${stackName}/*`,
  });
}

class PipelineDouble extends cdk.Construct implements cpapi.IPipeline {
  public readonly pipelineName: string;
  public readonly pipelineArn: string;
  public readonly role: iam.Role;

  constructor(scope: cdk.Construct, id: string, { pipelineName, role }: { pipelineName?: string, role: iam.Role }) {
    super(scope, id);
    this.pipelineName = pipelineName || 'TestPipeline';
    this.pipelineArn = this.node.stack.formatArn({ service: 'codepipeline', resource: 'pipeline', resourceName: this.pipelineName });
    this.role = role;
  }

  public asEventRuleTarget(_ruleArn: string, _ruleUniqueId: string): events.EventRuleTargetProps {
    throw new Error('asEventRuleTarget() is unsupported in PipelineDouble');
  }

  public grantBucketRead(_identity?: iam.IPrincipal): void {
    throw new Error('grantBucketRead() is unsupported in PipelineDouble');
  }

  public grantBucketReadWrite(_identity?: iam.IPrincipal): void {
    throw new Error('grantBucketReadWrite() is unsupported in PipelineDouble');
  }
}

class StageDouble implements cpapi.IStage {
  public readonly stageName: string;
  public readonly pipeline: cpapi.IPipeline;
  public readonly actions: cpapi.Action[];

  public get node(): cdk.ConstructNode {
    throw new Error('StageDouble is not a real construct');
  }

  constructor({ name, pipeline, actions }: { name?: string, pipeline: PipelineDouble, actions: cpapi.Action[] }) {
    this.stageName = name || 'TestStage';
    this.pipeline = pipeline;

    const stageParent = new cdk.Construct(pipeline, this.stageName);
    for (const action of actions) {
      const actionParent = new cdk.Construct(stageParent, action.actionName);
      (action as any)._attachActionToPipeline(this, actionParent);
    }
    this.actions = actions;
  }

  public addAction(_action: cpapi.Action): void {
    throw new Error('addAction() is not supported on StageDouble');
  }

  public onStateChange(_name: string, _target?: events.IEventRuleTarget, _options?: events.EventRuleProps):
      events.EventRule {
    throw new Error('onStateChange() is not supported on StageDouble');
  }
}

class RoleDouble extends iam.Role {
  public readonly statements = new Array<iam.PolicyStatement>();

  constructor(scope: cdk.Construct, id: string, props: iam.RoleProps = { assumedBy: new iam.ServicePrincipal('test') }) {
    super(scope, id, props);
  }

  public addToPolicy(statement: iam.PolicyStatement) {
    super.addToPolicy(statement);
    this.statements.push(statement);
  }
}

function resolve(x: any): any {
  return new cdk.Stack().node.resolve(x);
}
