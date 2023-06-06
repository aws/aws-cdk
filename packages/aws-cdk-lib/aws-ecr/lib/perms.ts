export const REPO_PULL_ACTIONS: string[] = [
  'ecr:BatchCheckLayerAvailability',
  'ecr:GetDownloadUrlForLayer',
  'ecr:BatchGetImage',
];

// https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-push.html#image-push-iam
export const REPO_PUSH_ACTIONS: string[] = [
  'ecr:CompleteLayerUpload',
  'ecr:UploadLayerPart',
  'ecr:InitiateLayerUpload',
  'ecr:BatchCheckLayerAvailability',
  'ecr:PutImage',
];

