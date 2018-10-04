import cpapi = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import nodeunit = require('nodeunit');
import util = require('util');
import cloudformation = require('../lib');

export = nodeunit.testCase({
  CreateReplaceChangeSet: {
    works(test: nodeunit.Test) {
      const stack = new cdk.Stack();
      const pipelineRole = new RoleDouble(stack, 'PipelineRole');
      const stage = new StageDouble({ pipelineRole });
      const artifact = new cpapi.Artifact(stack as any, 'TestArtifact');
      const action = new cloudformation.PipelineCreateReplaceChangeSetAction(stack, 'Action', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'MyStack',
        templatePath: artifact.atPath('path/to/file')
      });

      test.ok(_grantsPermission(pipelineRole.statements, 'iam:PassRole', action.role.roleArn),
              'The pipelineRole was given permissions to iam:PassRole to the action');

      const stackArn = cdk.ArnUtils.fromComponents({
        service: 'cloudformation',
        resource: 'stack',
        resourceName: 'MyStack/*'
      });
      const changeSetCondition = { StringEquals: { 'cloudformation:ChangeSetName': 'MyChangeSet' } };
      test.ok(_grantsPermission(pipelineRole.statements, 'cloudformation:DescribeStacks', stackArn),
              'The pipelineRole was given permissions to describe the stack & it\'s ChangeSets');
      test.ok(_grantsPermission(pipelineRole.statements, 'cloudformation:DescribeChangeSet', stackArn, changeSetCondition),
              'The pipelineRole was given permissions to describe the desired ChangeSet');
      test.ok(_grantsPermission(pipelineRole.statements, 'cloudformation:CreateChangeSet', stackArn, changeSetCondition),
              'The pipelineRole was given permissions to create the desired ChangeSet');
      test.ok(_grantsPermission(pipelineRole.statements, 'cloudformation:DeleteChangeSet', stackArn, changeSetCondition),
              'The pipelineRole was given permissions to delete the desired ChangeSet');

      test.deepEqual(action.inputArtifacts, [artifact],
                     'The inputArtifact was correctly registered');

      test.ok(_hasAction(stage.actions, 'AWS', 'CloudFormation', 'Deploy', {
        ActionMode: 'CHANGE_SET_CREATE_REPLACE',
        StackName: 'MyStack',
        ChangeSetName: 'MyChangeSet'
      }));

      test.done();
    }
  },
  ExecuteChangeSet: {
    works(test: nodeunit.Test) {
      const stack = new cdk.Stack();
      const pipelineRole = new RoleDouble(stack, 'PipelineRole');
      const stage = new StageDouble({ pipelineRole });
      new cloudformation.PipelineExecuteChangeSetAction(stack, 'Action', {
        stage,
        changeSetName: 'MyChangeSet',
        stackName: 'MyStack',
      });

      const stackArn = cdk.ArnUtils.fromComponents({
        service: 'cloudformation',
        resource: 'stack',
        resourceName: 'MyStack/*'
      });
      test.ok(_grantsPermission(pipelineRole.statements, 'cloudformation:ExecuteChangeSet', stackArn, {
                StringEquals: { 'cloudformation:ChangeSetName': 'MyChangeSet' }
              }),
              'The pipelineRole was given permissions to execute the desired ChangeSet');

      test.ok(_hasAction(stage.actions, 'AWS', 'CloudFormation', 'Deploy', {
        ActionMode: 'CHANGE_SET_EXECUTE',
        StackName: 'MyStack',
        ChangeSetName: 'MyChangeSet'
      }));

      test.done();
    }
  }
});

interface PolicyStatementJson {
  Effect: 'Allow' | 'Deny';
  Action: string | string[];
  Resource: string | string[];
  Condition: any;
}

function _hasAction(actions: cpapi.Action[], owner: string, provider: string, category: string, configuration?: { [key: string]: any}) {
  for (const action of actions) {
    if (action.owner !== owner) { continue; }
    if (action.provider !== provider) { continue; }
    if (action.category !== category) { continue; }
    if (configuration && !action.configuration) { continue; }
    if (configuration) {
      for (const key of Object.keys(configuration)) {
        if (!util.isDeepStrictEqual(cdk.resolve(action.configuration[key]), cdk.resolve(configuration[key]))) {
          continue;
        }
      }
    }
    return true;
  }
  return false;
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
  const resolvedValue = cdk.resolve(value);
  const resolvedEntity = cdk.resolve(entity);
  if (util.isDeepStrictEqual(resolvedEntity, resolvedValue)) { return true; }
  if (!Array.isArray(resolvedEntity)) { return false; }
  for (const tested of entity) {
    if (util.isDeepStrictEqual(tested, resolvedValue)) { return true; }
  }
  return false;
}

class StageDouble implements cpapi.IStage {
  public readonly name: string;
  public readonly pipelineArn: string;
  public readonly pipelineRole: iam.Role;

  public readonly actions = new Array<cpapi.Action>();

  constructor({ name, pipelineName, pipelineRole }: { name?: string, pipelineName?: string, pipelineRole: iam.Role }) {
    this.name = name || 'TestStage';
    this.pipelineArn = cdk.ArnUtils.fromComponents({ service: 'codepipeline', resource: 'pipeline', resourceName: pipelineName || 'TestPipeline' });
    this.pipelineRole = pipelineRole;
  }

  public grantPipelineBucketReadWrite() {
    throw new Error('Unsupported');
  }

  public _attachAction(action: cpapi.Action) {
    this.actions.push(action);
  }
}

class RoleDouble extends iam.Role {
  public readonly statements = new Array<PolicyStatementJson>();

  constructor(parent: cdk.Construct, id: string, props: iam.RoleProps = { assumedBy: new cdk.ServicePrincipal('test') }) {
    super(parent, id, props);
  }

  public addToPolicy(statement: cdk.PolicyStatement) {
    super.addToPolicy(statement);
    this.statements.push(statement.toJson());
  }
}
