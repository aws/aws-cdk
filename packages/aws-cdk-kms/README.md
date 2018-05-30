## AWS KMS Construct Library

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

### Importing and exporting keys

To use a KMS key that is not defined within this stack, use the
`EncryptionKey.import(parent, name, ref)` factory method:

```ts
const key = EncryptionKey.import(this, 'MyImportedKey', {
    keyArn: new KeyArn('arn:aws:...')
});

// you can do stuff with this imported key.
key.addAlias('alias/foo');
```

To export a key from a stack and import it in another stack, use `key.export`
which returns an `EncryptionKeyRef`, which can later be used to import:

```ts
// in stackA
const myKey = new EncryptionKey(stackA, 'MyKey');
const myKeyRef = myKey.export();

// meanwhile in stackB
const myKeyImported = EncryptionKey.import(stackB, 'MyKeyImported', myKeyRef);
```

Note that a call to `.addToPolicy(statement)` on `myKeyImported` will not have
an affect on the key's policy because it is not owned by your stack. The call
will be a no-op.
