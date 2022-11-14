/* eslint-disable max-len */

import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as ssm from '../lib';

test('creating a SSM Automation Document', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const automationAssumeRole = new iam.Role(stack, 'AutomationAssumeRole', {
    assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
  });

  const content = {
    schemaVersion: '0.3',
    assumeRole: automationAssumeRole.roleArn,
    description: 'My Automation Document',
    parameters: {
      MyParameter: {
        type: 'String',
        description: 'My Parameter',
        default: 'MyParameterValue',
      },
    },
    mainSteps: [
      {
        action: 'aws:runShellScript',
        name: 'runShellScript',
        inputs: {
          runCommand: ['echo "Hello World"'],
        },
      },
    ],
  };

  new ssm.AutomationDocument(stack, 'AutomationDocument', {
    content,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Document', {
    Content: {
      ...content,
      assumeRole: {
        'Fn::GetAtt': ['AutomationAssumeRoleAC6E73A7', 'Arn'],
      },
    },
    DocumentType: 'Automation',
    UpdateMethod: 'NewVersion',
  });
});

test('versionName can be specified', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const automationAssumeRole = new iam.Role(stack, 'AutomationAssumeRole', {
    assumedBy: new iam.ServicePrincipal('ssm.amazonaws.com'),
  });

  const content = {
    schemaVersion: '0.3',
    assumeRole: automationAssumeRole.roleArn,
    description: 'My Automation Document',
    parameters: {
      MyParameter: {
        type: 'String',
        description: 'My Parameter',
        default: 'MyParameterValue',
      },
    },
    mainSteps: [
      {
        action: 'aws:runShellScript',
        name: 'runShellScript',
        inputs: {
          runCommand: ['echo "Hello World"'],
        },
      },
    ],
  };

  new ssm.AutomationDocument(stack, 'AutomationDocument', {
    content,
    versionName: 'Release12.1',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Document', {
    Content: {
      ...content,
      assumeRole: {
        'Fn::GetAtt': ['AutomationAssumeRoleAC6E73A7', 'Arn'],
      },
    },
    DocumentType: 'Automation',
    VersionName: 'Release12.1',
    UpdateMethod: 'NewVersion',
  });
});

test('creating a SSM Run Command Document', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const content = {
    schemaVersion: '2.2',
    description: 'My Command Document',
    parameters: {
      MyParameter: {
        type: 'String',
        description: 'My Parameter',
        default: 'MyParameterValue',
      },
    },
    mainSteps: [
      {
        action: 'aws:runShellScript',
        name: 'runShellScript',
        inputs: {
          runCommand: ['echo "Hello World"'],
        },
      },
    ],
  };

  new ssm.CommandDocument(stack, 'CommandDocument', {
    content,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Document', {
    Content: content,
    DocumentType: 'Command',
    UpdateMethod: 'NewVersion',
  });
});

test('SSM Automation Document throws on long names', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.AutomationDocument(stack, 'AutomationDocument', {
      documentName: 'a'.repeat(130),
      content: {},
    });
  }).toThrow(/Document name must be between 3 and 128 characters./);
});

test.each([
  '/parameter/with spaces',
  'charactersOtherThan^allowed',
  'trying;this',
])('SSM Automation Document throws on invalid name %s', (documentName) => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.AutomationDocument(stack, 'AutomationDocument', {
      documentName,
      content: {},
    });
  }).toThrow(
    /name must only contain letters, numbers, and the following 3 symbols.*/,
  );
});

test('SSM Command Document throws on long names', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.CommandDocument(stack, 'CommandDocument', {
      documentName: 'a'.repeat(130),
      content: {},
    });
  }).toThrow(/Document name must be between 3 and 128 characters./);
});

test.each([
  '/parameter/with spaces',
  'charactersOtherThan^allowed',
  'trying;this',
])('SSM Command Document throws on invalid name %s', (documentName) => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.CommandDocument(stack, 'CommandDocument', {
      documentName,
      content: {},
    });
  }).toThrow(
    /name must only contain letters, numbers, and the following 3 symbols.*/,
  );
});

test.each([
  'aws',
  'amazon',
  'amzn',
])('SSM Automation Document throws on reserved name %s', (documentName) => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.AutomationDocument(stack, 'AutomationDocument', {
      documentName: `${documentName}MyAutomationDocument`,
      content: {
        schemaVersion: '0.3',
      },
    });
  }).toThrow(/Document name prefixes aws, amazon, amzn are reserved by AWS./);
});

test.each([
  'aws',
  'amazon',
  'amzn',
])('SSM Command Document throws on reserved name %s', (documentName) => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.CommandDocument(stack, 'CommandDocument', {
      documentName: `${documentName}MyCommandDocument`,
      content: {
        schemaVersion: '2.2',
      },
    });
  }).toThrow(/Document name prefixes aws, amazon, amzn are reserved by AWS./);
});

test('SSM Automation Document throws on invalid schema version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.AutomationDocument(stack, 'AutomationDocument', {
      content: {
        schemaVersion: '1.2',
      },
    });
  }).toThrow(/Documents of type Automation must use schema version 0.3./);
});

test('SSM Command Document throws on invalid schema version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // THEN
  expect(() => {
    new ssm.CommandDocument(stack, 'CommandDocument', {
      content: {
        schemaVersion: '0.3',
      },
    });
  }).toThrow(/Documents of type Command can use schema version 1.2, 2.0, or 2.2./);
});

test('AutomationDocument documentArn is crafted correctly', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = new ssm.AutomationDocument(stack, 'AutomationDocument', {
    documentName: 'MyAutomationDocument',
    content: {
      schemaVersion: '0.3',
    },
  });

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':automation-definition/MyAutomationDocument',
      ],
    ],
  });
});

test('CommandDocument documentArn is crafted correctly', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = new ssm.CommandDocument(stack, 'CommandDocument', {
    documentName: 'MyCommandDocument',
    content: {
      schemaVersion: '2.2',
    },
  });

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':document/MyCommandDocument',
      ],
    ],
  });
});

test('AutomationDocument.fromAutomationDocumentName', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.AutomationDocument.fromAutomationDocumentName(
    stack,
    'AutomationDocument',
    'MyAutomationDocument',
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':automation-definition/MyAutomationDocument',
      ],
    ],
  });
  expect(stack.resolve(document.documentName)).toEqual('MyAutomationDocument');
  expect(stack.resolve(document.type)).toEqual('Automation');
});

test('AutomationDocument.fromAutomationDocumentAttributes', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.AutomationDocument.fromAutomationDocumentAttributes(
    stack,
    'AutomationDocument',
    {
      documentName: 'MyAutomationDocument',
      version: '1',
    },
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':automation-definition/MyAutomationDocument:1',
      ],
    ],
  });
  expect(stack.resolve(document.documentName)).toEqual('MyAutomationDocument');
  expect(stack.resolve(document.type)).toEqual('Automation');
  expect(stack.resolve(document.version)).toEqual('1');
});

test('AutomationDocument.fromAutomationDocumentAttributes without version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.AutomationDocument.fromAutomationDocumentAttributes(
    stack,
    'AutomationDocument',
    {
      documentName: 'MyAutomationDocument',
    },
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':automation-definition/MyAutomationDocument',
      ],
    ],
  });
  expect(stack.resolve(document.documentName)).toEqual('MyAutomationDocument');
  expect(stack.resolve(document.type)).toEqual('Automation');
});

test('AutomationDocument.fromAutomationDocumentArn', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.AutomationDocument.fromAutomationDocumentArn(
    stack,
    'AutomationDocument',
    'arn:aws:ssm:us-east-1:123456789012:automation-definition/MyAutomationDocument',
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual(
    'arn:aws:ssm:us-east-1:123456789012:automation-definition/MyAutomationDocument',
  );
  expect(stack.resolve(document.documentName)).toEqual('MyAutomationDocument');
  expect(stack.resolve(document.type)).toEqual('Automation');
});

test('AutomationDocument.fromAutomationDocumentArn with version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.AutomationDocument.fromAutomationDocumentArn(
    stack,
    'AutomationDocument',
    'arn:aws:ssm:us-east-1:123456789012:automation-definition/MyAutomationDocument:1',
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual(
    'arn:aws:ssm:us-east-1:123456789012:automation-definition/MyAutomationDocument:1',
  );
  expect(stack.resolve(document.documentName)).toEqual('MyAutomationDocument');
  expect(stack.resolve(document.type)).toEqual('Automation');
  expect(stack.resolve(document.version)).toEqual('1');
});

test('CommandDocument.fromCommandDocumentName', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.CommandDocument.fromCommandDocumentName(
    stack,
    'CommandDocument',
    'MyCommandDocument',
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':document/MyCommandDocument',
      ],
    ],
  });
  expect(stack.resolve(document.documentName)).toEqual('MyCommandDocument');
  expect(stack.resolve(document.type)).toEqual('Command');
});

test('CommandDocument.fromCommandDocumentAttributes', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.CommandDocument.fromCommandDocumentAttributes(
    stack,
    'CommandDocument',
    {
      documentName: 'MyCommandDocument',
      version: '1',
    },
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':document/MyCommandDocument:1',
      ],
    ],
  });
  expect(stack.resolve(document.documentName)).toEqual('MyCommandDocument');
  expect(stack.resolve(document.type)).toEqual('Command');
  expect(stack.resolve(document.version)).toEqual('1');
});

test('CommandDocument.fromCommandDocumentAttributes without version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.CommandDocument.fromCommandDocumentAttributes(
    stack,
    'CommandDocument',
    {
      documentName: 'MyCommandDocument',
    },
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual({
    'Fn::Join': [
      '',
      [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':ssm:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':document/MyCommandDocument',
      ],
    ],
  });
  expect(stack.resolve(document.documentName)).toEqual('MyCommandDocument');
  expect(stack.resolve(document.type)).toEqual('Command');
});

test('CommandDocument.fromCommandDocumentArn', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.CommandDocument.fromCommandDocumentArn(
    stack,
    'CommandDocument',
    'arn:aws:ssm:us-east-1:123456789012:document/MyCommandDocument',
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual(
    'arn:aws:ssm:us-east-1:123456789012:document/MyCommandDocument',
  );
  expect(stack.resolve(document.documentName)).toEqual('MyCommandDocument');
  expect(stack.resolve(document.type)).toEqual('Command');
});

test('CommandDocument.fromCommandDocumentArn with version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const document = ssm.CommandDocument.fromCommandDocumentArn(
    stack,
    'CommandDocument',
    'arn:aws:ssm:us-east-1:123456789012:document/MyCommandDocument:1',
  );

  // THEN
  expect(stack.resolve(document.documentArn)).toEqual(
    'arn:aws:ssm:us-east-1:123456789012:document/MyCommandDocument:1',
  );
  expect(stack.resolve(document.documentName)).toEqual('MyCommandDocument');
  expect(stack.resolve(document.type)).toEqual('Command');
  expect(stack.resolve(document.version)).toEqual('1');
});
