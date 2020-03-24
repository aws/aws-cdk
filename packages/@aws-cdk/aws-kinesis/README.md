## Amazon Kinesis Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

Define an unencrypted Kinesis stream.

```ts
new Stream(this, 'MyFirstStream');
```

### Encryption

Define a KMS-encrypted stream:

```ts
const stream = new Stream(this, 'MyEncryptedStream', {
    encryption: StreamEncryption.Kms
});

// you can access the encryption key:
assert(stream.encryptionKey instanceof kms.Key);
```

You can also supply your own key:

```ts
const myKmsKey = new kms.Key(this, 'MyKey');

const stream = new Stream(this, 'MyEncryptedStream', {
    encryption: StreamEncryption.Kms,
    encryptionKey: myKmsKey
});

assert(stream.encryptionKey === myKmsKey);
```

### Granting IAM Permissions on Stream to Grantable

Read and Write iam actions can be added to a iam.IGrantable. If the stream has an encryption key attributed, access 
to encrypt and/or decrypt with the encryption key will also be added to the grantable. There are three instance methods 
available on a Stream object:  
*.grantWrite(grantee: iam.IGrantable)  
*.grantRead(grantee: iam.IGrantable)  
*.grantReadWrite(grantee: iam.IGrantable)  
```ts
const grantable = new iam.Role(this, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  description: 'Example role...',
}

const stream = new Stream(this, 'MyEncryptedStream', {
    encryption: StreamEncryption.Kms
});

stream.grantRead(grantable);
```
