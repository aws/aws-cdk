import assets = require('@aws-cdk/cdk-assets');
import s3 = require('@aws-cdk/s3');
import { Lambda } from './lambda';
import { cloudformation } from './lambda.generated';

export abstract class LambdaCode {
    /**
     * @returns `LambdaCodeS3` associated with the specified S3 object.
     * @param bucket The S3 bucket
     * @param key The object key
     * @param objectVersion Optional S3 object version
     */
    public static bucket(bucket: s3.BucketRef, key: string, objectVersion?: string) {
        return new LambdaS3Code(bucket, key, objectVersion);
    }

    /**
     * @returns `LambdaCodeInline` with inline code.
     * @param code The actual handler code (limited to 4KiB)
     */
    public static inline(code: string) {
        return new LambdaInlineCode(code);
    }

    /**
     * @returns `LambdaCodeAsset`
     * @param directoryToZip
     */
    public static asset(directoryToZip: string) {
        return new LambdaAssetCode(directoryToZip);
    }

    /**
     * Called during stack synthesis to render the CodePropery for the
     * Lambda function.
     */

    public abstract toJSON(): cloudformation.FunctionResource.CodeProperty;

    /**
     * Called when the lambda is initialized to allow this object to
     * bind to the stack, add resources and have fun.
     */
    public bind(_parent: Lambda) {
        return;
    }
}

/**
 * Lambda code from an S3 archive.
 */
export class LambdaS3Code extends LambdaCode {
    private bucketName: s3.BucketName;

    constructor(bucket: s3.BucketRef, private key: string, private objectVersion?: string) {
        super();

        if (!bucket.bucketName) {
            throw new Error('bucketName is undefined for the provided bucket');
        }

        this.bucketName = bucket.bucketName;
    }

    public toJSON(): cloudformation.FunctionResource.CodeProperty {
        return {
            s3Bucket: this.bucketName,
            s3Key: this.key,
            s3ObjectVersion: this.objectVersion
        };
    }
}

/**
 * Lambda code from an inline string (limited to 4KiB).
 */
export class LambdaInlineCode extends LambdaCode {
    constructor(private code: string) {
        super();

        if (code.length > 4096) {
            throw new Error("Lambda source is too large, must be <= 4096 but is " + code.length);
        }
    }

    public bind(parent: Lambda) {
        if (!parent.runtime.supportsInlineCode) {
            throw new Error(`Inline source not allowed for ${parent.runtime.name}`);
        }
    }

    public toJSON(): cloudformation.FunctionResource.CodeProperty {

        return {
            zipFile: this.code
        };
    }
}

/**
 * Lambda code from a local directory.
 */
export class LambdaAssetCode extends LambdaCode {
    private asset?: assets.Asset;

    constructor(private readonly directory: string) {
        super();
    }

    public bind(parent: Lambda) {
        this.asset = new assets.ZipDirectoryAsset(parent, 'Code', { path: this.directory });
        this.asset.grantRead(parent.role);
    }

    public toJSON(): cloudformation.FunctionResource.CodeProperty {
        return  {
            s3Bucket: this.asset!.s3BucketName,
            s3Key: this.asset!.s3ObjectKey
        };
    }
}
