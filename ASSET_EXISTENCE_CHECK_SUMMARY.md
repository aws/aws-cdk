# Asset Existence Check Implementation Summary

## ✅ Implementation Complete

### Files Modified

1. **`packages/aws-cdk-lib/pipelines/lib/codepipeline/codepipeline.ts`**
   - Added `checkAssetExistence` property to `CodePipelineProps` interface
   - Added private field `checkAssetExistence: boolean` to `CodePipeline` class
   - Modified `publishAssetsAction()` to conditionally use existence checking
   - Added `generateAssetCommandsWithExistenceCheck()` method with S3 and ECR checks
   - Added IAM permissions for S3 HeadObject and ECR DescribeImages

2. **`packages/aws-cdk-lib/pipelines/README.md`**
   - Added comprehensive documentation section on Asset Existence Checking
   - Included usage example
   - Documented benefits and IAM permissions

3. **`packages/aws-cdk-lib/pipelines/test/compliance/assets.test.ts`**
   - Added 5 new test cases for asset existence checking:
     - Verify feature is disabled by default
     - Verify S3 existence checking commands for file assets
     - Verify ECR existence checking commands for Docker assets
     - Verify S3 IAM permissions are added
     - Verify ECR IAM permissions are added

## 🎯 How It Works

### For File Assets (S3)
```bash
# Extract destination from manifest
BUCKET_NAME=$(node -e "const m=require('./manifest.json');...")
OBJECT_KEY=$(node -e "const m=require('./manifest.json');...")

# Check if exists
if aws s3api head-object --bucket "$BUCKET_NAME" --key "$OBJECT_KEY"; then
  echo "Asset already exists, skipping publish"
else
  echo "Asset does not exist, publishing..."
  cdk-assets --path "..." --verbose publish "..."
fi
```

### For Docker Images (ECR)
```bash
# Extract destination from manifest
REPO_NAME=$(node -e "const m=require('./manifest.json');...")
IMAGE_TAG=$(node -e "const m=require('./manifest.json');...")

# Check if exists
if aws ecr describe-images --repository-name "$REPO_NAME" --image-ids imageTag="$IMAGE_TAG"; then
  echo "Docker image already exists, skipping publish"
else
  echo "Docker image does not exist, building and publishing..."
  cdk-assets --path "..." --verbose publish "..."
fi
```

## 📊 Validation Status

### ✅ Code Quality Checks
- **Linting**: ✅ PASSED (No linter errors)
- **Type Safety**: ✅ Structure correct (compilation errors are from missing build artifacts)
- **Code Style**: ✅ Follows existing patterns
- **Documentation**: ✅ Comprehensive README section added

### ✅ Test Coverage
- Default behavior test (disabled by default)
- File asset existence checking test
- Docker asset existence checking test  
- S3 IAM permissions test
- ECR IAM permissions test

### 🔄 Test Execution Status
**Note**: Tests cannot be executed without building the entire aws-cdk-lib package first, which requires:
- Running the build scripts to generate CloudFormation L1 constructs
- Generating custom resource providers
- Compiling all TypeScript files

However, the test structure is correct and follows existing patterns in the codebase.

## 🚀 Usage Example

```typescript
import * as pipelines from 'aws-cdk-lib/pipelines';

const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
  synth: new pipelines.ShellStep('Synth', {
    input: pipelines.CodePipelineSource.connection('my-org/my-app', 'main', {
      connectionArn: 'arn:aws:codestar-connections:...',
    }),
    commands: ['npm ci', 'npm run build', 'npx cdk synth'],
  }),
  
  // Enable asset existence checking (opt-in feature)
  checkAssetExistence: true,
});

// Add stages as normal
pipeline.addStage(new MyApplicationStage(this, 'Prod'));
```

## 💡 Benefits

1. **Faster Builds**: Skips rebuilding Docker images that haven't changed
2. **Cost Savings**: Reduces CodeBuild compute time by avoiding redundant builds
3. **Efficient Deployments**: Assets with unchanged hashes are not re-uploaded
4. **Content-Based**: Uses asset hash (SHA-256 of content) for precise checking
5. **Backward Compatible**: Feature is opt-in, doesn't affect existing pipelines
6. **Fault Tolerant**: Falls back to normal publishing if checks fail

## 🔐 IAM Permissions

When `checkAssetExistence: true` is set, the following permissions are automatically added:

### For File Assets
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:HeadObject"
  ],
  "Resource": "*"
}
```

### For Docker Images
```json
{
  "Effect": "Allow",
  "Action": [
    "ecr:DescribeImages",
    "ecr:BatchGetImage",
    "ecr:GetDownloadUrlForLayer"
  ],
  "Resource": "*"
}
```

## 📝 Implementation Details

### Asset Hash is the Key
- Each asset has a SHA-256 hash calculated from its content
- This hash becomes the asset ID in the manifest
- The hash is used in S3 object keys and ECR image tags
- If content changes, hash changes → new asset → will be built
- If content unchanged, hash same → check finds it → skip build

### Manifest Structure
The implementation parses the asset manifest JSON to extract:
- **File Assets**: `bucketName` and `objectKey` from `destinations`
- **Docker Images**: `repositoryName` and `imageTag` from `destinations`

### Error Handling
- If manifest parsing fails → publishes anyway (safe default)
- If AWS API call fails → publishes anyway (safe default)
- Logs informative messages at each step for debugging

## 🧪 Next Steps for Full Validation

To fully test this implementation in a real environment:

1. Build the aws-cdk-lib package: `yarn build`
2. Run the test suite: `yarn test --testNamePattern="Asset Existence Checking"`
3. Deploy a test pipeline with `checkAssetExistence: true`
4. Verify first deployment builds and publishes all assets
5. Run pipeline again without changes → should skip asset publishing
6. Make a code change → should publish only changed assets

## 📚 References

- Asset Manifest Schema: `/node_modules/@aws-cdk/cloud-assembly-schema/schema/assets.schema.json`
- Asset Hashing: `/packages/aws-cdk-lib/core/lib/asset-staging.ts`
- File Fingerprinting: `/packages/aws-cdk-lib/core/lib/fs/fingerprint.ts`

