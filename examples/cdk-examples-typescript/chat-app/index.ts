import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { CognitoChatRoomPool } from './cognito-chat-room-pool';
import { DynamoPostsTable } from './dynamodb-posts-table';

class MyStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    new DynamoPostsTable(this, 'Posts');

    new CognitoChatRoomPool(this, 'UserPool');

    const bucket = s3.BucketRef.import(this, 'DougsBucket', {
      bucketName: 'dougs-chat-app'
    });

    new ChatAppFunction(this, 'StartAddBucket', {
      bucket,
      zipFile: 'StartAddingPendingCognitoUser.zip'
    });

    new ChatAppFunction(this, 'FinishAddBucket', {
      bucket,
      zipFile: 'FinishAddingPendingCognitoUser.zip'
    });

    new ChatAppFunction(this, 'SignInUserBucket', {
      bucket,
      zipFile: 'SignInCognitoUser.zip'
    });

    new ChatAppFunction(this, 'VerifyBucket', {
      bucket,
      zipFile: 'VerifyCognitoSignIn.zip'
    });

    new ChatAppFunction(this, 'StartChangeBucket', {
      bucket,
      zipFile: 'StartChangingForgottenCognitoUserPassword.zip'
    });

    new ChatAppFunction(this, 'FinishChangeBucket', {
      bucket,
      zipFile: 'FinishChangingForgottenCognitoUserPassword.zip'
    });

    new ChatAppFunction(this, 'GetPostsBucket', {
      bucket,
      zipFile: 'GetPosts.zip'
    });

    new ChatAppFunction(this, 'AddPostBucket', {
      bucket,
      zipFile: 'AddPost.zip'
    });

    new ChatAppFunction(this, 'DeletePostBucket', {
      bucket,
      zipFile: 'DeletePost.zip'
    });

    new ChatAppFunction(this, 'DeleteUserBucket', {
      bucket,
      zipFile: 'DeleteCognitoUser.zip'
    });
  }
}

interface ChatAppFuncProps {
  bucket: s3.BucketRef;
  zipFile: string;
}

/*
 * Extend Function as all of the Chat app functions have these common props.
 */
class ChatAppFunction extends lambda.Function {
  constructor(parent: cdk.Construct, name: string, props: ChatAppFuncProps) {
    super(parent, name, {
      code: new lambda.S3Code(props.bucket, props.zipFile),
      runtime: lambda.Runtime.NodeJS610,
      handler: 'index.handler'
    });
  }
}

const app = new cdk.App(process.argv);

// Add the stack to the app
// (apps can host many stacks, for example, one for each region)
new MyStack(app, 'ChatAppStack', { env: { region: 'us-west-2' } });

process.stdout.write(app.run());
