## AWS Kinesis Construct Library
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>


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
