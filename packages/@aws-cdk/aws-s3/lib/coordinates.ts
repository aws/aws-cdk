/**
 * An interface that represents the coordinates of a specific object in an S3 Bucket.
 */
export interface Coordinates {
  /**
   * The name of the S3 Bucket the object is in.
   */
  readonly bucketName: string;

  /**
   * The path inside the Bucket where the object is located at.
   */
  readonly objectKey: string;
}
