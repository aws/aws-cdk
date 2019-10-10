# CDK Manual Installation Instructions

The CDK is also distributed as a single zip file which contains:

1. The CDK command-line toolkit
2. Documentation HTML
2. JavaScript/TypeScript Framework and AWS Constructs
3. Java Framework and AWS Constructs

You can download the zip file from the
[Releases](http://github.com/aws/aws-cdk/releases) page on GitHub.

The zip file comes with a signature so the integrity of the download
can be verified (see below).

## Installation overview

We recommend you extract the package to `~/.cdk`, and use the binaries from `~/.cdk/bin`.

When using the manual installation method, use the command `y-npm` (provided
with the distribution) wherever you would normally use `npm`.

## Step by step instructions

### Extract the installation archive to ~/.cdk

Once you've downloaded the bits, install them into `~/.cdk` and add to your `PATH`:

#### Linux/MacOS (bash/zsh)

```shell
# Unpack to ~/.cdk
rm -fr ~/.cdk
mkdir ~/.cdk
unzip <path-to-zip-file> -d ~/.cdk

# Add to PATH and reload profile
echo 'PATH=$PATH:$HOME/.cdk/bin' >> ~/.bashrc && source ~/.bashrc  # for bash
echo 'PATH=$PATH:$HOME/.cdk/bin' >> ~/.zshrc && source ~/.zshrc    # for zsh
```

#### Windows (PowerShell)

Open an elevated PowerShell terminal ("Run as Administrator"):

```powershell
# Unpack to ~/.cdk
Remove-Item -Force -Recurse ~/.cdk
New-Item -Type Directory ~/.cdk
Expand-Archive -Path <path-to-zip-file> -DestinationPath ~/.cdk

# Add to PATH and reload profile
New-Item -Force -ItemType Directory -Path (Split-Path $PROFILE)
Add-Content -Path $PROFILE -Value '$env:Path = "$env:Path;$env:UserProfile\.cdk\node_modules\.bin"'
Set-ExecutionPolicy Unrestricted
& $PROFILE
```

#### Install the command-line toolkit

Install (or update) `aws-cdk` globally

```shell
y-npm install --global aws-cdk # sudo might be needed
```

> `y-npm` is an npm wrapper which allows installing npm modules from a local repository located at `~/.cdk/y/npm`. `y-npm` will fall back to the public npm repository if a module cannot be found locally.

To check which CDK version you have installed:

```shell
cdk --version
```

## Verifying the integrity of your download

You can verify that your download is complete and correct by validating
its signature against our public signing key. To do so, you need
the following things:

* [GNU Privacy Guard](https://gnupg.org/) needs to be installed.
* Download our public key: https://s3.amazonaws.com/aws-cdk-beta/cdk-team.asc
* Make sure you have downloaded both `aws-cdk-x.y.z.zip`
  and `aws-cdk-x.y.z.zip.sig`.

Then run the following commands:

```shell
gpg --import cdk-team.asc
gpg --verify aws-cdk-x.y.z.zip.sig aws-cdk-x.y.z.zip
```

If everything is correct, the output will contain the line:

```
gpg: Good signature from "AWS CDK Team <aws-cdk@amazon.com>"
```

If you obtained via the above URL, you can ignore the following message:

```
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
```

