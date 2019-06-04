## AWS Key Management Service Construct Library

Defines a KMS key:

```js
new EncryptionKey(this, 'MyKey', {
    enableKeyRotation: true
});
```

Add a couple of aliases:

```js
const key = new EncryptionKey(this, 'MyKey');
key.addAlias('alias/foo');
key.addAlias('alias/bar');
```

### Sharing keys between stacks

To use a KMS key in a different stack in the same CDK application,
pass the construct to the other stack:

[sharing key between stacks](test/integ.key-sharing.lit.ts)


### Importing existing keys

To use a KMS key that is not defined in this CDK app, but is created through other means, use
`EncryptionKey.import(parent, name, ref)`:

```ts
const myKeyImported = EncryptionKey.import(this, 'MyImportedKey', {
    keyArn: 'arn:aws:...'
});

// you can do stuff with this imported key.
key.addAlias('alias/foo');
```

Note that a call to `.addToPolicy(statement)` on `myKeyImported` will not have
an affect on the key's policy because it is not owned by your stack. The call
will be a no-op.
