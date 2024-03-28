import boto3

def empty_bucket(bucket_name):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucket_name)
    
    # Delete all versions for versioned objects
    bucket.object_versions.delete()

    # Create an S3 client
    s3_client = boto3.client('s3')
    
    # List and abort incomplete multipart uploads
    multipart_uploads = s3_client.list_multipart_uploads(Bucket=bucket_name)
    if 'Uploads' in multipart_uploads:
        for upload in multipart_uploads['Uploads']:
            s3_client.abort_multipart_upload(Bucket=bucket_name, Key=upload['Key'], UploadId=upload['UploadId'])

def delete_bucket(bucket_name):
    s3 = boto3.client('s3')
    
    try:
        print(f"Deleting bucket: {bucket_name}")
        s3.delete_bucket(Bucket=bucket_name)
        print(f"Bucket '{bucket_name}' deleted successfully.")
    except Exception as e:
        print(f"Error deleting the bucket {bucket_name}: {e}")

def delete_buckets_with_prefix(prefix):
    s3 = boto3.client('s3')
    
    # List all buckets
    try:
        for bucket in s3.list_buckets()['Buckets']:
            if bucket['Name'].startswith(prefix):
                print(f"Found bucket with prefix '{prefix}': {bucket['Name']}")
                empty_bucket(bucket['Name'])
                delete_bucket(bucket['Name'])
    except Exception as e:
        print(f"Error listing or deleting buckets: {e}")

# Example usage
prefix = 'codepipeline'
delete_buckets_with_prefix(prefix)
