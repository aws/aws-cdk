import nodeunit = require('nodeunit');
import { Manifest, validateManifest } from '../lib';

export = nodeunit.testCase({
  validateManifest: {
    'successfully loads the example manifest'(test: nodeunit.Test) {
      test.doesNotThrow(() => validateManifest(SAMPLE_MANIFEST));
      test.done();
    },
    'rejects a document where the schema is invalid'(test: nodeunit.Test) {
      const badManifest = _clone(SAMPLE_MANIFEST);
      (badManifest as any).schema = 'foo/1.0-bar';
      test.throws(() => validateManifest(badManifest),
                  /instance\.schema is not one of enum values/);
      test.done();
    },
    'rejects a document without droplets'(test: nodeunit.Test) {
      const badManifest = _clone(SAMPLE_MANIFEST);
      delete badManifest.droplets;
      test.throws(() => validateManifest(badManifest),
                  /instance requires property "droplets"/);
      test.done();
    },
    'rejects a document with an illegal Logical ID'(test: nodeunit.Test) {
      const badManifest = _clone(SAMPLE_MANIFEST);
      badManifest.droplets['Pipeline.Stack'] = badManifest.droplets.PipelineStack;
      test.throws(() => validateManifest(badManifest),
                  /Invalid logical ID: Pipeline\.Stack/);
      test.done();
    },
    'rejects a document with unresolved dependsOn'(test: nodeunit.Test) {
      const badManifest = _clone(SAMPLE_MANIFEST);
      badManifest.droplets.PipelineStack.dependsOn = ['DoesNotExist'];
      test.throws(() => validateManifest(badManifest),
                  /PipelineStack depends on undefined drop through dependsOn DoesNotExist/);
      test.done();
    },
    'rejects a document with direct circular dependency via dependsOn'(test: nodeunit.Test) {
      const badManifest = _clone(SAMPLE_MANIFEST);
      badManifest.droplets.PipelineStack.dependsOn = ['PipelineStack'];
      test.throws(() => validateManifest(badManifest),
                  /PipelineStack => dependsOn PipelineStack/);
      test.done();
    },
    'rejects a document with indirect circular dependency'(test: nodeunit.Test) {
      const badManifest = _clone(SAMPLE_MANIFEST);
      badManifest.droplets.StaticFiles.dependsOn = ['ServiceStack-beta'];
      test.throws(() => validateManifest(badManifest),
                  // tslint:disable-next-line:max-line-length
                  /StaticFiles => dependsOn ServiceStack-beta => ServiceStack-beta\.properties\.parameters\.websiteFilesKeyPrefix "\${StaticFiles\.keyPrefix}"/);
      test.done();
    }
  }
});

/* Don't assume this has meaning beyond being a syntactically valid manifest document */
const SAMPLE_MANIFEST: Manifest = {
  schema: "cloud-assembly/1.0",
  droplets: {
    "PipelineStack": {
      type: "npm://@aws-cdk/aws-cloudformation.StackDrop",
      environment: "aws://123456789012/eu-west-1",
      properties: {
        template: "stacks/PipelineStack.yml"
      }
    },
    "ServiceStack-beta": {
      type: "npm://@aws-cdk/aws-cloudformation.StackDrop",
      environment: "aws://123456789012/eu-west-1",
      properties: {
        template: "stacks/ServiceStack-beta.yml",
        stackPolicy: "stacks/ServiceStack-beta.stack-policy.json",
        parameters: {
          image: "${DockerImage.exactImageId}",
          websiteFilesBucket: "${StaticFiles.bucketName}",
          websiteFilesKeyPrefix: "${StaticFiles.keyPrefix}",
        }
      }
    },
    "ServiceStack-prod": {
      type: "npm://@aws-cdk/aws-cloudformation.StackDrop",
      environment: "aws://123456789012/eu-west-1",
      properties: {
        template: "stacks/ServiceStack-prod.yml",
        stackPolicy: "stacks/ServiceStack-prod.stack-policy.json",
        parameters: {
          image: "${DockerImage.exactImageId}",
          websiteFilesBucket: "${StaticFiles.bucketName}",
          websiteFilesKeyPrefix: "${StaticFiles.keyPrefix}",
        }
      }
    },
    "DockerImage": {
      type: "npm://@aws-cdk/aws-ecr.DockerImageDrop",
      environment: "aws://123456789012/eu-west-1",
      properties: {
        savedImage: "docker/docker-image.tar",
        imageName: "${PipelineStack.ecrImageName}"
      }
    },
    "StaticFiles": {
      type: "npm://@aws-cdk/assets.DirectoryDrop",
      environment: "aws://123456789012/eu-west-1",
      properties: {
        directory: "assets/static-website",
        bucketName: "${PipelineStack.stagingBucket}"
      }
    }
  }
};

function _clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
