## AWS Kinesis Construct Library

Define an unencrypted Kinesis stream.

```ts
new Stream(this, 'MyFirstStream');
```

### Encryption

Define a KMS-encrypted stream:

```ts
const stream = newStream(this, 'MyEncryptedStream', {
    encryption: StreamEncryption.Kms
});

// you can access the encryption key:
assert(stream.encryptionKey instanceof kms.EncryptionKey);
```

You can also supply your own key:

```ts
const myKmsKey = new kms.EncryptionKey(this, 'MyKey');

const stream = new Stream(this, 'MyEncryptedStream', {
    encryption: StreamEncryption.Kms,
    encryptionKey: myKmsKey
});

assert(stream.encryptionKey === myKmsKey);
```

### Importing and Exporting Streams

You can create a `Stream` construct that represents an external/existing/unowned stream by using the `Stream.import` factory method.

This method accepts an object that adheres to `StreamRef`.

This means that you can define a `StreamRef` using token literals:

```ts
const stream = Stream.import(this, {
    streamArn: new StreamArn('arn:aws:kinesis:us-east-1:123456789012:stream/example-stream-name')
});

// now you can just call methods on the stream
stream.grantReadWrite(user);
```

The `stream.export()` method can be used to "export" the stream from the current stack. It returns a `StreamRef` object that can later be used in a call to `Stream.import` in another stack.

Here's an example.

Let's define a stack with a Kinesis stream and export it using `stream.export()`.

```ts
class Producer extends Stack {
    public readonly myStreamRef: StreamRef;

    constructor(parent: App, name: string) {
        super(parent, name);

        const stream = new Stream(this, 'MyStream');
        this.myStreamRef = stream.export();
    }
}
```

Now let's define a stack that requires a StreamRef as an input and uses `Stream.import` to create a `Stream` object that represents this external stream. Grant a user principal created within this consuming stack read/write permissions to the stream.

```ts
interface ConsumerProps {
    public userStreamRef: StreamRef;
}

class Consumer extends Stack {
    constructor(parent: App, name: string, props: ConsumerProps) {
        super(parent, name);

        const user = new User(this, 'MyUser');
        const userStream = Stream.import(this, props.userStreamRef);
        userStream.grantReadWrite(user);
    }
}
```

Now, let's define our CDK app to bind these together:

```ts
const app = new App(process.argv);

const producer = new Producer(app, 'produce');

new Consumer(app, 'consume', {
    userStreamRef: producer.myStreamRef
});

process.stdout.write(app.run());
```
