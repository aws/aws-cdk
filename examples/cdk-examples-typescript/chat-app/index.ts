import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { Lambda, LambdaRuntime, LambdaS3Code } from '@aws-cdk/lambda';
import { BucketName, BucketRef } from '@aws-cdk/s3';
import { CognitoChatRoomPool } from './CognitoChatRoomPool';
import { DynamoPostsTable } from './DynamodbPostsTable';

class MyStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        new DynamoPostsTable(this, 'Posts');

        new CognitoChatRoomPool(this, 'UserPool');

        const bucket = BucketRef.import(this, 'DougsBucket', {
            bucketName: new BucketName('dougs-chat-app')
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
    bucket: BucketRef;
    zipFile: string;
}

/*
 * Extend Function as all of the Chat app functions have these common props.
 */
class ChatAppFunction extends Lambda {
    constructor(parent: Construct, name: string, props: ChatAppFuncProps) {
        super(parent, name, {
            code: new LambdaS3Code(props.bucket, props.zipFile),
            runtime: LambdaRuntime.NodeJS610,
            handler: 'index.handler'
        });
    }
}

const app = new App(process.argv);

// Add the stack to the app
// (apps can host many stacks, for example, one for each region)
new MyStack(app, 'ChatAppStack', { env: { region: 'us-west-2' } });

process.stdout.write(app.run());
