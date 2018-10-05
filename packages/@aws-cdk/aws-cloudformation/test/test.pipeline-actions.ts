import cpapi = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import _ = require('lodash');
import nodeunit = require('nodeunit');
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

      _assertPermissionGranted(test, pipelineRole.statements, 'iam:PassRole', action.role.roleArn);

      const stackArn = cdk.ArnUtils.fromComponents({
        service: 'cloudformation',
        resource: 'stack',
        resourceName: 'MyStack/*'
      });
      const changeSetCondition = { StringEquals: { 'cloudformation:ChangeSetName': 'MyChangeSet' } };
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeStacks', stackArn);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DescribeChangeSet', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:CreateChangeSet', stackArn, changeSetCondition);
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:DeleteChangeSet', stackArn, changeSetCondition);

      test.deepEqual(action.inputArtifacts, [artifact],
                     'The inputArtifact was correctly registered');

      _assertActionMatches(test, stage.actions, 'AWS', 'CloudFormation', 'Deploy', {
        ActionMode: 'CHANGE_SET_CREATE_REPLACE',
        StackName: 'MyStack',
        ChangeSetName: 'MyChangeSet'
      });

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
      _assertPermissionGranted(test, pipelineRole.statements, 'cloudformation:ExecuteChangeSet', stackArn,
                               { StringEquals: { 'cloudformation:ChangeSetName': 'MyChangeSet' } });

      _assertActionMatches(test, stage.actions, 'AWS', 'CloudFormation', 'Deploy', {
        ActionMode: 'CHANGE_SET_EXECUTE',
        StackName: 'MyStack',
        ChangeSetName: 'MyChangeSet'
      });

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

function _assertActionMatches(test: nodeunit.Test,
                              actions: cpapi.Action[],
                              owner: string,
                              provider: string,
                              category: string,
                              configuration?: { [key: string]: any }) {
  const configurationStr = configuration
                         ? `configuration including ${JSON.stringify(cdk.resolve(configuration), null, 2)}`
                         : '';
  const actionsStr = JSON.stringify(actions.map(a =>
    ({ owner: a.owner, provider: a.provider, category: a.category, configuration: cdk.resolve(a.configuration) })
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
        if (!_.isEqual(cdk.resolve(action.configuration[key]), cdk.resolve(configuration[key]))) {
          continue;
        }
      }
    }
    return true;
  }
  return false;
}

function _assertPermissionGranted(test: nodeunit.Test, statements: PolicyStatementJson[], action: string, resource: string, conditions?: any) {
  const conditionStr = conditions
                     ? ` with condition(s) ${JSON.stringify(cdk.resolve(conditions))}`
                     : '';
  const statementsStr = JSON.stringify(cdk.resolve(statements), null, 2);
  test.ok(_grantsPermission(statements, action, resource, conditions),
          `Expected to find a statement granting ${action} on ${cdk.resolve(resource)}${conditionStr}, found:\n${statementsStr}`);
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
  if (_.isEqual(resolvedEntity, resolvedValue)) { return true; }
  if (!Array.isArray(resolvedEntity)) { return false; }
  for (const tested of entity) {
    if (_.isEqual(tested, resolvedValue)) { return true; }
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
