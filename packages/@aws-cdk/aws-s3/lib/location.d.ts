/**
 * An interface that represents the location of a specific object in an S3 Bucket.
 */
export interface Location {
    /**
     * The name of the S3 Bucket the object is in.
     */
    readonly bucketName: string;
    /**
     * The path inside the Bucket where the object is located at.
     */
    readonly objectKey: string;
    /**
     * The S3 object version.
     */
    readonly objectVersion?: string;
}
