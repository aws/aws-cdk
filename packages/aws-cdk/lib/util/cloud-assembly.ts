import cloudAssembly = require('@aws-cdk/cloud-assembly');
import cxapi = require('@aws-cdk/cx-api');
import archiver = require('archiver');
import crypto = require('crypto');
import events = require('events');
import fs = require('fs-extra');
import path = require('path');
import stream = require('stream');
import { promisify } from 'util';
import { toYAML } from '../serialize';

const HASH_ALGORITHM = 'SHA256';
const HASH_LENGTH = 32; // 256 bites

// tslint:disable-next-line:no-var-requires kbpgp does not provide typescript typings
const kbpgp = require('kbpgp');

export interface CloudAssemblyOptions {
  /**
   * The private key part of an OpenPGP key in ASCII-armored format. If it is locked, the passphrase must be provided by
   * ``privateKeyPassphrase``.
   *
   * @default no signature
   */
  privateKey?: string;

  /**
   * The passphrase necessary to unlock the ``privateKey`` if it was provided, or a function that returns the
   * passphrase.
   *
   * @default no passphrase
   */
  privateKeyPassphrase?: string | (() => string);
}

/**
 * A utility class to build a Cloud Assembly.
 */
export class CloudAssembly {
  private readonly archiver: archiver.Archiver;
  private readonly errorEmitter = new events.EventEmitter();
  private readonly fileData: { [path: string]: cloudAssembly.FileData } = {};
  private readonly manifest: cloudAssembly.Manifest = { schema: 'cloud-assembly/1.0', droplets: {} };
  private readonly nonce = crypto.randomBytes(HASH_LENGTH);
  private readonly writer: fs.WriteStream;

  /**
   * Creates a new Cloud Assembly.
   *
   * @param file the path at which the Cloud Assembly will be created.
   */
  constructor(file: string, private readonly options: CloudAssemblyOptions = {}) {
    this.writer = fs.createWriteStream(file);
    this.archiver = archiver('zip', { zlib: { level: 9 } });
    this.archiver.on('warning', err => this.errorEmitter.emit('error', err));
    this.archiver.on('error', err => this.errorEmitter.emit('error', err));
    this.archiver.pipe(this.writer);
  }

  /**
   * The ``close`` event is fired when the CloudAssembly has been written to disk.
   * @param event ``'close'``.
   * @param listener the event handler.
   * @returns this
   */
  public on(event: 'close', listener: () => void): this;
  /**
   * The ``error`` handler is fired when an error occurs when preparing the Cloud Assembly.
   * @param event ``'error'``.
   * @param listener the event handler.
   * @returns this
   */
  public on(event: 'error', listener: (error: Error) => void): this;
  public on(event: 'close' | 'error', listener: (error: Error) => void): this {
    if (event === 'close') {
      this.writer.on(event, listener);
    } else {
      this.errorEmitter.on(event, listener);
    }
    return this;
  }

  public addStack(stack: cxapi.SynthesizedStack): this {
    const stackMetadata: { [key: string]: cloudAssembly.Metadata[] } = {};
    const parameters: { [name: string]: string } = {};
    for (const key of Object.keys(stack.metadata)) {
      for (const metadata of stack.metadata[key]) {
        if (metadata.type === cxapi.ASSET_METADATA) {
          const asset = metadata.data! as cxapi.AssetMetadataEntry;
          this._registerAsset(stack, asset, parameters);
        } else {
          stackMetadata[key] = stackMetadata[key] || [];
          stackMetadata[key].push({ kind: metadata.type, value: { data: metadata.data, trace: metadata.trace } });
        }
      }
    }

    const templatePath = `${stack.name}/template.yml`;
    this._addFile(templatePath, toYAML(stack.template)).catch(err => this.errorEmitter.emit('error', err));
    this.manifest.droplets[stack.name] = {
      type: 'npm://aws-cdk/cloudformation-stack',
      environment: _stackEnvironment(stack),
      metadata: stackMetadata,
      properties: {
        templatePath,
        parameters
      }
    };

    for (const key of Object.keys(stack.missing || {})) {
      const missingData = stack.missing![key];
      this.manifest.missing = this.manifest.missing || {};
      this.manifest.missing[key] = missingData;
    }

    return this;
  }

  /**
   * Finalizes this Cloud Assembly.
   */
  public finalize(): void {
    const manifest = JSON.stringify(this.manifest, null, 2);
    this._addFile('manifest.json', manifest)
      .then(() => {
        if (!this.options.privateKey) {
          return this.archiver.finalize();
        }
        const attestation: cloudAssembly.Attestation = {
          algorithm: HASH_ALGORITHM,
          items: this.fileData,
          nonce: this.nonce.toString('base64'),
          timestamp: new Date()
        };
        const stringToSign = JSON.stringify(attestation, null, 2);
        _pgpSign(stringToSign, this.options.privateKey, this.options.privateKeyPassphrase)
          .then(signature => {
            this.archiver.append(signature, { name: 'signature.asc' });
            this.archiver.finalize();
          })
          .catch(e => this.errorEmitter.emit('error', e));
      })
      .catch(e => this.errorEmitter.emit('error', e));
  }

  private _addFile(name: string, content: Buffer | stream.Readable | string): Promise<void> {
    return new Promise((ok, ko) => {
      if (typeof content === 'string' || Buffer.isBuffer(content)) {
        const data = content;
        content = new stream.Readable();
        content.push(data);
        content.push(null /* no more data */);
      }
      const hash = crypto.createHash(HASH_ALGORITHM);
      let size = 0;
      const hashingStream = new stream.Transform({
        transform(this: stream.Transform, chunk: any, encoding: string, callback: stream.TransformCallback): void {
          try {
            chunk = Buffer.from(chunk);
            size += chunk.byteLength;
            if (size > Number.MAX_SAFE_INTEGER) {
              throw new Error(`Attempted to add an object that is too large for Javascript (max size: ${Number.MAX_SAFE_INTEGER} bytes)`);
            }
            hash.update(chunk);
            this.push(chunk, encoding);
            callback();
          } catch (e) {
            callback(e);
          }
        }
      });
      hashingStream.on('error', ko);
      hashingStream.on('end', () => {
        if (name in this.fileData) {
          ko(new Error(`A file was already added at path ${name}`));
        }
        this.fileData[name] = {
          hash: hash.update(this.nonce).digest('base64'),
          size: size.toString(10)
        };
        ok();
      });
      this.archiver.append(content.pipe(hashingStream), { name });
    });
  }

  private _registerAsset(stack: cxapi.SynthesizedStack, asset: cxapi.AssetMetadataEntry, parameters: { [name: string]: string }): void {
    const filePath = `${stack.name}/assets/${asset.id}/${path.basename(asset.path)}`;
    const dropName = `${stack.name}/${asset.id}`;
    switch (asset.packaging) {
    case 'file':
      this._addFile(filePath, fs.createReadStream(asset.path)).catch(e => { throw e; });
      this.manifest.droplets[dropName] = {
        type: 'npm://aws-cdk/s3-object',
        environment: _stackEnvironment(stack),
        properties: { filePath },
      };
      parameters[asset.s3BucketParameter] = `\${${dropName}.s3BucketName}`;
      parameters[asset.s3KeyParameter] = `\${${dropName}.s3ObjectKey}`;
      break;
    case 'zip':
      const zip = archiver('zip', { zlib: { level: 9 } }).directory(asset.path, '');
      this._addFile(`${filePath}.zip`, zip).catch(e => { throw e; });
      zip.finalize();
      this.manifest.droplets[dropName] = {
        type: 'npm://aws-cdk/s3-object',
        environment: _stackEnvironment(stack),
        properties: { filePath: `${filePath}.zip` }
      };
      parameters[asset.s3BucketParameter] = `\${${dropName}.s3BucketName}`;
      parameters[asset.s3KeyParameter] = `\${${dropName}.s3ObjectKey}`;
      break;
    case 'container-image':
    default:
      throw new Error(`Unsupported asset packaging: ${asset.packaging}`);
    }
  }
}

async function _pgpSign(msg: string, privateKey: string, passphrase?: string | (() => string)): Promise<string> {
  const keyManager = await promisify(kbpgp.KeyManager.import_from_armored_pgp)({ armored: privateKey });
  if (keyManager.is_pgp_locked()) {
    await promisify(keyManager.unlock_pgp).call(keyManager, { passphrase });
  }
  return await promisify(kbpgp.clearsign)({ msg, signing_key: keyManager.find_signing_pgp_key() });
}

function _stackEnvironment(stack: cxapi.SynthesizedStack): string {
  return `aws://${stack.environment.account}/${stack.environment.region}`;
}
