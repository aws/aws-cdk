# node-bundle



## Why

We created this tool as a way to bundle up dependencies so that users always consume

## How

```console
npm install node-bundle
```

### Command Line

The following options must be passed to any command:

```console
Options:
  --copyright                                                [string] [required]
  --external        Packages in this list will be excluded from the bundle and
                    added as dependencies (example: "fsevents:optional") [array]
  --licenses        List of valid licenses                               [array]
  --resources       List of resources to be explicitly copied to the bundle
                    (example:
                    "node_modules/proxy-agent/contextify.js:bin/contextify.js)"
                                                                         [array]
  --dont-attribute  Dependencies matching this regular expressions wont be added
                    to the notice file                                  [string]
  --test            Validation command to sanity test the bundle after its
                    created                                             [string]

```

#### validate

```console
node-bundle <options> validate
```

#### pack

```console
node-bundle <options> pack
```

#### fix

```console
node-bundle <options> fix
```


### Programatic
