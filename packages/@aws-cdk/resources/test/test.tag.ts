import { App, Stack, StackProps, Tag } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { s3 } from '../lib';

export = {
    'can use tags while modeling S3 buckets'(test: Test) {
        class TagsExample extends Stack {
            constructor(parent: App, name: string, props?: StackProps) {
                super(parent, name, props);

                const tag: Tag = {
                    key: 'TagKey',
                    value: 'TagValue'
                };

                new s3.BucketResource(this, 'Bucket', {
                    tags: [ tag ]
                });
            }
        }

        const app = new App();
        const stack = new TagsExample(app, 'Example');

        stack.toCloudFormation(); // This should not throw

        test.done();
    },

    'can use tag-like property bags while modeling S3 buckets'(test: Test) {
        class TagsExample extends Stack {
            public readonly bucket: s3.BucketResource;

            constructor(parent: App, name: string, props?: StackProps) {
                super(parent, name, props);
                this.bucket = new s3.BucketResource(this, 'Bucket', {
                    tags: [ { key: 'TagKey', value: 'TagValue' } ]
                });
            }
        }

        // GIVEN
        const app = new App();

        // WHEN
        const stack = new TagsExample(app, 'Example');

        // THEN
        const template = stack.toCloudFormation(); // This should not throw

        const tags = template.Resources[stack.bucket.logicalId].Properties.Tags;

        test.deepEqual(tags, [
            { Key: 'TagKey', Value: 'TagValue' }
        ]);
        test.done();
    }
};
