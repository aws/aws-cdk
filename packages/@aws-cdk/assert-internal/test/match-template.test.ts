import * as fs from 'fs';
import * as path from 'path';
import { ArtifactType } from '@aws-cdk/cloud-assembly-schema';
import { CloudAssemblyBuilder, CloudFormationStackArtifact, EnvironmentUtils } from '@aws-cdk/cx-api';
import { MatchStyle } from '../lib';
import '../jest';

describe('matchTemplate', () => {
  describe('exact match', () => {
    test('match on resources', () => {
      const stack = mkStack({
        Resources: {
          FooResource: { Type: 'Foo::Bar' },
        },
      });

      expect(stack).toMatchTemplate({
        Resources: {
          FooResource: { Type: 'Foo::Bar' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Resources: {
          FooResource: { Type: 'Foo::Baz' },
        },
      }, MatchStyle.EXACT);
    });

    test('match on parameters', () => {
      const stack = mkStack({
        Parameters: {
          FooParameter: { Type: 'String' },
        },
      });
      expect(stack).toMatchTemplate({
        Parameters: {
          FooParameter: { Type: 'String' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Parameters: {
          BarParameter: { Type: 'String' },
        },
      }, MatchStyle.EXACT);
    });

    test('match on outputs', () => {
      const stack = mkStack({
        Outputs: {
          FooOutput: { Value: 'Foo' },
        },
      });

      expect(stack).toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Foo' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          BarOutput: { Value: 'Bar' },
        },
      }, MatchStyle.EXACT);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Bar' },
        },
      }, MatchStyle.EXACT);
    });
  });

  describe('superset match', () => {
    test('match on resources', () => {
      const stack = mkStack({
        Resources: {
          FooResource: {
            Type: 'Foo::Bar',
          },
          BazResource: {
            Type: 'Foo::Baz',
          },
        },
      });
      expect(stack).toMatchTemplate({
        Resources: {
          FooResource: {
            Type: 'Foo::Bar',
          },
        },
      }, MatchStyle.SUPERSET);
    });

    test('match on parameters', () => {
      const stack = mkStack({
        Parameters: {
          FooParameter: { Type: 'String' },
          BarParameter: { Type: 'String' },
        },
      });
      expect(stack).toMatchTemplate({
        Parameters: {
          FooParameter: { Type: 'String' },
        },
      }, MatchStyle.SUPERSET);

      expect(stack).not.toMatchTemplate({
        Parameters: {
          FooParameter: { Type: 'String' },
          BarParameter: { Type: 'Number' },
        },
      }, MatchStyle.SUPERSET);
    });

    test('match on outputs', () => {
      const stack = mkStack({
        Outputs: {
          FooOutput: { Value: 'Foo' },
          BarOutput: { Value: 'Bar' },
        },
      });

      expect(stack).toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Foo' },
        },
      }, MatchStyle.SUPERSET);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Foo' },
          BarOutput: { Value: 'Baz' },
        },
      }, MatchStyle.SUPERSET);

      expect(stack).not.toMatchTemplate({
        Outputs: {
          FooOutput: { Value: 'Bar' },
          BazOutput: { Value: 'Bar' },
        },
      }, MatchStyle.SUPERSET);
    });
  });
});

function mkStack(template: any): CloudFormationStackArtifact {
  const assembly = new CloudAssemblyBuilder();
  assembly.addArtifact('test', {
    type: ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: EnvironmentUtils.format('123456789012', 'bermuda-triangle-1'),
    properties: {
      templateFile: 'template.json',
    },
  });

  fs.writeFileSync(path.join(assembly.outdir, 'template.json'), JSON.stringify(template));
  return assembly.buildAssembly().getStackByName('test');
}