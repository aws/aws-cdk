import * as path from 'path';
import { ENABLE_CROSS_REGION_REFERENCES } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { readFileSync } from 'fs-extra';
import {
  Stack, NestedStack, CfnStack, Resource, CfnResource, App, CfnOutput,
} from '../lib';
import { toCloudFormation } from './util';

describe('nested-stack', () => {
  test('a nested-stack has a defaultChild', () => {
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack');
    var cfn_nestedStack = (nestedStack.node.defaultChild) as CfnStack;
    cfn_nestedStack.addPropertyOverride('TemplateURL', 'http://my-url.com');
    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        MyNestedStackNestedStackMyNestedStackNestedStackResource9C617903: {
          DeletionPolicy: 'Delete',
          Properties: {
            TemplateURL: 'http://my-url.com',
          },
          Type: 'AWS::CloudFormation::Stack',
          UpdateReplacePolicy: 'Delete',
        },
      },
    });
  });
  test('a nested-stack has a description in templateOptions.', () => {
    const description = 'This is a description.';
    const stack = new Stack();
    var nestedStack = new NestedStack(stack, 'MyNestedStack', {
      description,
    });

    expect(nestedStack.templateOptions.description).toEqual(description);
  });

  test(`can create cross region references when ${ENABLE_CROSS_REGION_REFERENCES}=true`, () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-1337',
      },
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-42',
      },
    });
    stack2.node.setContext(ENABLE_CROSS_REGION_REFERENCES, true);
    const nestedStack = new NestedStack(stack1, 'MyNestedStack');
    const nestedStack2 = new NestedStack(stack2, 'MyNestedStack');

    // WHEN
    const myResource = new MyResource(nestedStack, 'MyResource');

    new CfnOutput(nestedStack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    const assembly = app.synth();
    const nestedTemplate2 = JSON.parse(readFileSync(path.join(assembly.directory, `${nestedStack2.artifactId}.nested.template.json`), 'utf8'));
    expect(nestedTemplate2).toMatchObject({
      Outputs: {
        Output: {
          Value: '{{resolve:ssm:/cdk/exports/Stack1/MyNestedStackNestedStackMyNestedStackNestedStackResourceFnGetAttMyNestedStackNestedStackMyNestedStackNestedStackResource9C617903OutputsStack1MyNestedStackMyResourceEDA18296Ref94C8BA6D}}',
        },
      },
    });
    const template1 = assembly.getStackByName(stack1.stackName).template;
    const nestedTemplate1 = JSON.parse(readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8'));
    expect(nestedTemplate1?.Outputs).toEqual({
      Stack1MyNestedStackMyResourceEDA18296Ref: {
        Value: {
          Ref: 'MyResource6073B41F',
        },
      },
    });

    expect(template1?.Resources).toMatchObject({
      ExportsWriterbermudatriangle42E5959427: {
        DeletionPolicy: 'Delete',
        Properties: {
          Exports: {
            '/cdk/exports/Stack1/MyNestedStackNestedStackMyNestedStackNestedStackResourceFnGetAttMyNestedStackNestedStackMyNestedStackNestedStackResource9C617903OutputsStack1MyNestedStackMyResourceEDA18296Ref94C8BA6D': {
              'Fn::GetAtt': [
                'MyNestedStackNestedStackMyNestedStackNestedStackResource9C617903',
                'Outputs.Stack1MyNestedStackMyResourceEDA18296Ref',
              ],
            },
          },
          StackName: 'Stack1',
          Region: 'bermuda-triangle-42',
          ServiceToken: {
            'Fn::GetAtt': [
              'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
              'Arn',
            ],
          },
        },
        Type: 'Custom::CrossRegionExportWriter',
        UpdateReplacePolicy: 'Delete',
      },
    });
  });

  test(`cannot create cross region references when ${ENABLE_CROSS_REGION_REFERENCES}=false`, () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-1337',
      },
    });
    const stack2 = new Stack(app, 'Stack2', {
      env: {
        account: '123456789012',
        region: 'bermuda-triangle-42',
      },
    });
    const nestedStack = new NestedStack(stack1, 'MyNestedStack');

    // WHEN
    const myResource = new MyResource(nestedStack, 'MyResource');
    new CfnOutput(stack2, 'Output', {
      value: myResource.name,
    });

    // THEN
    expect(() => toCloudFormation(stack2)).toThrow(
      /Cannot use resource 'Stack1\/MyNestedStack\/MyResource' in a cross-environment fashion/);
  });
});

class MyResource extends Resource {
  public readonly arn: string;
  public readonly name: string;

  constructor(scope: Construct, id: string, physicalName?: string) {
    super(scope, id, { physicalName });

    const res = new CfnResource(this, 'Resource', {
      type: 'My::Resource',
      properties: {
        resourceName: this.physicalName,
      },
    });

    this.name = this.getResourceNameAttribute(res.ref.toString());
    this.arn = this.getResourceArnAttribute(res.getAtt('Arn').toString(), {
      region: '',
      account: '',
      resource: 'my-resource',
      resourceName: this.physicalName,
      service: 'myservice',
    });
  }
}
