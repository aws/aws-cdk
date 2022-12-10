/**
 * Distributed Map State Resources
 */
export enum DistributedMapResource {
  /**
   * S3 get object
   */
  S3_GET_OBJECT = 'arn:aws:states:::s3:getObject',

  /**
   * S3 list objects v2
   */
  S3_LIST_OBJECTS_V2 = 'arn:aws:states:::s3:listObjectsV2',

  /**
   * S3 put object
   */
  S3_PUT_OBJECT = 'arn:aws:states:::s3:putObject',
}
