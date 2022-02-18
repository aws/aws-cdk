import * as fs from 'fs';
import { join, resolve } from 'path';
import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Asset } from '@aws-cdk/aws-s3-assets';
import { App, Stack } from '@aws-cdk/core';
import { Code, Repository, RepositoryProps } from '../lib';

describe('codecommit', () => {
  describe('CodeCommit Repositories', () => {
    test('add an SNS trigger to repository', () => {
      const stack = new Stack();

      const props: RepositoryProps = {
        repositoryName: 'MyRepository',
      };

      const snsArn = 'arn:aws:sns:*:123456789012:my_topic';

      new Repository(stack, 'MyRepository', props).notify(snsArn);

      Template.fromStack(stack).templateMatches({
        Resources: {
          MyRepository4C4BD5FC: {
            Type: 'AWS::CodeCommit::Repository',
            Properties: {
              RepositoryName: 'MyRepository',
              Triggers: [
                {
                  Events: [
                    'all',
                  ],
                  DestinationArn: 'arn:aws:sns:*:123456789012:my_topic',
                  Name: 'Default/MyRepository/arn:aws:sns:*:123456789012:my_topic',
                },
              ],
            },
          },
        },
      });


    });

    test('fails when triggers have duplicate names', () => {
      const stack = new Stack();

      const myRepository = new Repository(stack, 'MyRepository', {
        repositoryName: 'MyRepository',
      }).notify('myTrigger');

      expect(() => myRepository.notify('myTrigger')).toThrow();


    });

    test('can be imported using a Repository ARN', () => {
      // GIVEN
      const stack = new Stack();
      const repositoryArn = 'arn:aws:codecommit:us-east-1:585695036304:my-repo';

      // WHEN
      const repo = Repository.fromRepositoryArn(stack, 'ImportedRepo', repositoryArn);

      // THEN
      expect(stack.resolve(repo.repositoryArn)).toEqual(repositoryArn);
      expect(stack.resolve(repo.repositoryName)).toEqual('my-repo');


    });

    test('Repository can be initialized with contents from a ZIP file', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');

      // WHEN
      new Repository(stack, 'Repository', {
        repositoryName: 'MyRepositoryName',
        code: Code.fromZipFile(join(__dirname, 'asset-test.zip')),
      });

      const assembly = app.synth();
      const assets = JSON.parse(fs.readFileSync(join(assembly.directory, `${stack.stackName}.assets.json`), 'utf-8'));

      // our asset + the template itself
      expect(Object.entries(assets.files)).toHaveLength(2);
    });

    test('Repository can be initialized with contents from a directory', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');

      // WHEN
      new Repository(stack, 'Repository', {
        repositoryName: 'MyRepositoryName',
        code: Code.fromDirectory(join(__dirname, 'asset-test')),
      });

      const assembly = app.synth();
      const assets = JSON.parse(fs.readFileSync(join(assembly.directory, `${stack.stackName}.assets.json`), 'utf-8'));

      // our asset + the template itself
      expect(Object.entries(assets.files)).toHaveLength(2);
    });

    test('Repository can be initialized with contents from an asset', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');

      const readmeAsset = new Asset(stack, 'ReadmeAsset', {
        path: join(__dirname, 'asset-test'),
      });

      // WHEN
      new Repository(stack, 'Repository', {
        repositoryName: 'MyRepositoryName',
        code: Code.fromAsset(readmeAsset),
      });

      // THEN
      const assembly = app.synth();
      const assets = JSON.parse(fs.readFileSync(join(assembly.directory, `${stack.stackName}.assets.json`), 'utf-8'));

      // our asset + the template itself
      expect(Object.entries(assets.files)).toHaveLength(2);
    });

    test('Repository throws Error when initialized with file while expecting directory', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');
      const filePath = join(__dirname, 'asset-test/test.md');

      // THEN
      expect(() => {
        new Repository(stack, 'Repository', {
          repositoryName: 'MyRepositoryName',
          code: Code.fromDirectory(filePath),
        });
      }).toThrow(`'${filePath}' needs to be a path to a directory (resolved to: '${resolve(filePath)}')`);
    });

    test('Repository throws Error when initialized with directory while expecting file', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'MyStack');

      const dirPath = join(__dirname, 'asset-test/');

      // THEN
      expect(() => {
        new Repository(stack, 'Repository', {
          repositoryName: 'MyRepositoryName',
          code: Code.fromZipFile(dirPath),
        });
      }).toThrow(`'${dirPath}' needs to be a path to a ZIP file (resolved to: '${resolve(dirPath)}')`);
    });

    /**
     * Fix for https://github.com/aws/aws-cdk/issues/10630
     */
    test('can be imported using a Repository ARN and respect the region in clone urls', () => {
      // GIVEN
      const stack = new Stack();
      const repositoryArn = 'arn:aws:codecommit:us-west-2:585695036304:my-repo';

      // WHEN
      const repo = Repository.fromRepositoryArn(stack, 'ImportedRepo', repositoryArn);

      // THEN
      // a fully qualified arn should use the region from the arn
      expect(stack.resolve(repo.repositoryCloneUrlHttp)).toEqual({
        'Fn::Join': [
          '',
          [
            'https://git-codecommit.us-west-2.',
            { Ref: 'AWS::URLSuffix' },
            '/v1/repos/my-repo',
          ],
        ],
      });

      expect(stack.resolve(repo.repositoryCloneUrlSsh)).toEqual({
        'Fn::Join': [
          '',
          [
            'ssh://git-codecommit.us-west-2.',
            { Ref: 'AWS::URLSuffix' },
            '/v1/repos/my-repo',
          ],
        ],
      });

      expect(stack.resolve(repo.repositoryCloneUrlGrc)).toEqual('codecommit::us-west-2://my-repo');

      expect(repo.env.account).toEqual('585695036304');
      expect(repo.env.region).toEqual('us-west-2');


    });

    test('can be imported using just a Repository name (the ARN is deduced)', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const repo = Repository.fromRepositoryName(stack, 'ImportedRepo', 'my-repo');

      // THEN
      expect(stack.resolve(repo.repositoryArn)).toEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':codecommit:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':my-repo',
        ]],
      });
      expect(stack.resolve(repo.repositoryName)).toEqual('my-repo');

      //local name resolution should use stack region
      expect(stack.resolve(repo.repositoryCloneUrlHttp)).toEqual({
        'Fn::Join': [
          '',
          [
            'https://git-codecommit.',
            { Ref: 'AWS::Region' },
            '.',
            { Ref: 'AWS::URLSuffix' },
            '/v1/repos/my-repo',
          ],
        ],
      });

      expect(stack.resolve(repo.repositoryCloneUrlGrc)).toEqual({
        'Fn::Join': [
          '',
          [
            'codecommit::',
            { Ref: 'AWS::Region' },
            '://my-repo',
          ],
        ],
      });


    });

    test('grant push', () => {
      // GIVEN
      const stack = new Stack();
      const repository = new Repository(stack, 'Repo', {
        repositoryName: 'repo-name',
      });
      const role = new Role(stack, 'Role', {
        assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
      });

      // WHEN
      repository.grantPullPush(role);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'codecommit:GitPull',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'Repo02AC86CF',
                  'Arn',
                ],
              },
            },
            {
              Action: 'codecommit:GitPush',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'Repo02AC86CF',
                  'Arn',
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
      });


    });

    test('HTTPS (GRC) clone URL', () => {
      const stack = new Stack();

      const repository = new Repository(stack, 'Repository', {
        repositoryName: 'my-repo',
      });

      expect(stack.resolve(repository.repositoryCloneUrlGrc)).toEqual({
        'Fn::Join': [
          '',
          [
            'codecommit::',
            { Ref: 'AWS::Region' },
            '://',
            { 'Fn::GetAtt': ['Repository22E53BBD', 'Name'] },
          ],
        ],
      });


    });
  });
});
