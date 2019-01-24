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
      const stage = new StageDouble({ pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }) });
      const artifact = new cpapi.Artifact(stack as any, 'TestArtifact');
      const action = new cloudformation.PipelineCreateReplaceChangeSetAction(stack, 'Action', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'MyStack',
        templatePath: artifact.atPath('path/to/file'),
        adminPermissions: false,
      });

      _assertPermissionGranted(test, pipelineRole.statements, 'iam:PassRole', action.deploymentRole.roleArn);

      const stackArn = _stackArn('MyStack', stack);
      const changeSetCondition = { StringEqualsIfExists: { 'cloudformation:ChangeSetName': 'MyChangeSet' } };
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeStacks', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeChangeSet', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:CreateChangeSet', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DeleteChangeSet', stackArn, changeSetCondition);

      test.deepEqual(action._inputArtifacts, [artifact],
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
      const stage = new StageDouble({ pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }) });
      const artifact = new cpapi.Artifact(stack as any, 'TestArtifact');
      new cloudformation.PipelineCreateReplaceChangeSetAction(stack, 'ActionA', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'StackA',
        adminPermissions: false,
        templatePath: artifact.atPath('path/to/file')
      });

      new cloudformation.PipelineCreateReplaceChangeSetAction(stack, 'ActionB', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'StackB',
        adminPermissions: false,
        templatePath: artifact.atPath('path/to/other/file')
      });

      test.deepEqual(
        stack.node.resolve(pipelineRole.statements),
        [
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: [
              { 'Fn::GetAtt': [ 'ActionARole72759154', 'Arn' ] },
              { 'Fn::GetAtt': [ 'ActionBRole6A2F6804', 'Arn' ] }
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
      const stage = new StageDouble({ pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }) });
      new cloudformation.PipelineExecuteChangeSetAction(stack, 'Action', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'MyStack',
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
      const stage = new StageDouble({ pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }) });
      new cloudformation.PipelineExecuteChangeSetAction(stack, 'ActionA', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'StackA',
      });

      new cloudformation.PipelineExecuteChangeSetAction(stack, 'ActionB', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'StackB',
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
    const action = new cloudformation.PipelineCreateUpdateStackAction(stack, 'Action', {
      stage: new StageDouble({ pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }) }),
      templatePath: new cpapi.Artifact(stack as any, 'TestArtifact').atPath('some/file'),
      stackName: 'MyStack',
        adminPermissions: false,
      replaceOnFailure: true,
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
    const action = new cloudformation.PipelineDeleteStackAction(stack, 'Action', {
      stage: new StageDouble({ pipeline: new PipelineDouble(stack, 'Pipeline', { role: pipelineRole }) }),
        adminPermissions: false,
      stackName: 'MyStack',
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
  return cdk.Stack.find(scope).formatArn({
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
    this.pipelineArn = cdk.Stack.find(this).formatArn({ service: 'codepipeline', resource: 'pipeline', resourceName: this.pipelineName });
    this.role = role;
  }

  public get uniqueId(): string {
    throw new Error("Unsupported");
  }

  public grantBucketRead(): void {
    throw new Error("Unsupported");
  }

  public grantBucketReadWrite(): void {
    throw new Error("Unsupported");
  }

  public asEventRuleTarget(): events.EventRuleTargetProps {
    throw new Error("Unsupported");
  }
}

class StageDouble implements cpapi.IStage, cpapi.IInternalStage {
  public readonly name: string;
  public readonly pipeline: cpapi.IPipeline;
  public readonly _internal = this;

  public readonly actions = new Array<cpapi.Action>();

  public get node(): cdk.ConstructNode {
    throw new Error('this is not a real construct');
  }

  constructor({ name, pipeline }: { name?: string, pipeline: cpapi.IPipeline }) {
    this.name = name || 'TestStage';
    this.pipeline = pipeline;
  }

  public _attachAction(action: cpapi.Action) {
    this.actions.push(action);
  }

  public _generateOutputArtifactName(): string {
    throw new Error('Unsupported');
  }

  public _findInputArtifact(): cpapi.Artifact {
    throw new Error('Unsupported');
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