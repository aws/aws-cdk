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
