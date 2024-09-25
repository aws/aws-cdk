"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAssetHandler = void 0;
const fs_1 = require("fs");
const path = require("path");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const mime = require("mime");
const progress_1 = require("../../progress");
const archive_1 = require("../archive");
const fs_extra_1 = require("../fs-extra");
const placeholders_1 = require("../placeholders");
const shell_1 = require("../shell");
/**
 * The size of an empty zip file is 22 bytes
 *
 * Ref: https://en.wikipedia.org/wiki/ZIP_(file_format)
 */
const EMPTY_ZIP_FILE_SIZE = 22;
class FileAssetHandler {
    constructor(workDir, asset, host) {
        this.workDir = workDir;
        this.asset = asset;
        this.host = host;
        this.fileCacheRoot = path.join(workDir, '.cache');
    }
    async build() { }
    async isPublished() {
        const destination = await (0, placeholders_1.replaceAwsPlaceholders)(this.asset.destination, this.host.aws);
        const s3Url = `s3://${destination.bucketName}/${destination.objectKey}`;
        try {
            const s3 = await this.host.aws.s3Client({
                ...destination,
                quiet: true,
            });
            this.host.emitMessage(progress_1.EventType.CHECK, `Check ${s3Url}`);
            if (await objectExists(s3, destination.bucketName, destination.objectKey)) {
                this.host.emitMessage(progress_1.EventType.FOUND, `Found ${s3Url}`);
                return true;
            }
        }
        catch (e) {
            this.host.emitMessage(progress_1.EventType.DEBUG, `${e.message}`);
        }
        return false;
    }
    async publish() {
        const destination = await (0, placeholders_1.replaceAwsPlaceholders)(this.asset.destination, this.host.aws);
        const s3Url = `s3://${destination.bucketName}/${destination.objectKey}`;
        const s3 = await this.host.aws.s3Client(destination);
        this.host.emitMessage(progress_1.EventType.CHECK, `Check ${s3Url}`);
        const bucketInfo = BucketInformation.for(this.host);
        // A thunk for describing the current account. Used when we need to format an error
        // message, not in the success case.
        const account = async () => (await this.host.aws.discoverTargetAccount(destination))?.accountId;
        switch (await bucketInfo.bucketOwnership(s3, destination.bucketName)) {
            case BucketOwnership.MINE:
                break;
            case BucketOwnership.DOES_NOT_EXIST:
                throw new Error(`No bucket named '${destination.bucketName}'. Is account ${await account()} bootstrapped?`);
            case BucketOwnership.SOMEONE_ELSES_OR_NO_ACCESS:
                throw new Error(`Bucket named '${destination.bucketName}' exists, but not in account ${await account()}. Wrong account?`);
        }
        if (await objectExists(s3, destination.bucketName, destination.objectKey)) {
            this.host.emitMessage(progress_1.EventType.FOUND, `Found ${s3Url}`);
            return;
        }
        // Identify the the bucket encryption type to set the header on upload
        // required for SCP rules denying uploads without encryption header
        let paramsEncryption = {};
        const encryption2 = await bucketInfo.bucketEncryption(s3, destination.bucketName);
        switch (encryption2.type) {
            case 'no_encryption':
                break;
            case 'aes256':
                paramsEncryption = { ServerSideEncryption: 'AES256' };
                break;
            case 'kms':
                // We must include the key ID otherwise S3 will encrypt with the default key
                paramsEncryption = {
                    ServerSideEncryption: 'aws:kms',
                    SSEKMSKeyId: encryption2.kmsKeyId,
                };
                break;
            case 'does_not_exist':
                this.host.emitMessage(progress_1.EventType.DEBUG, `No bucket named '${destination.bucketName}'. Is account ${await account()} bootstrapped?`);
                break;
            case 'access_denied':
                this.host.emitMessage(progress_1.EventType.DEBUG, `Could not read encryption settings of bucket '${destination.bucketName}': uploading with default settings ("cdk bootstrap" to version 9 if your organization's policies prevent a successful upload or to get rid of this message).`);
                break;
        }
        if (this.host.aborted) {
            return;
        }
        const publishFile = this.asset.source.executable ?
            await this.externalPackageFile(this.asset.source.executable) : await this.packageFile(this.asset.source);
        this.host.emitMessage(progress_1.EventType.UPLOAD, `Upload ${s3Url}`);
        const params = Object.assign({}, {
            Bucket: destination.bucketName,
            Key: destination.objectKey,
            Body: (0, fs_1.createReadStream)(publishFile.packagedPath),
            ContentType: publishFile.contentType,
        }, paramsEncryption);
        await s3.upload(params).promise();
    }
    async packageFile(source) {
        if (!source.path) {
            throw new Error(`'path' is expected in the File asset source, got: ${JSON.stringify(source)}`);
        }
        const fullPath = path.resolve(this.workDir, source.path);
        if (source.packaging === cloud_assembly_schema_1.FileAssetPackaging.ZIP_DIRECTORY) {
            const contentType = 'application/zip';
            await fs_1.promises.mkdir(this.fileCacheRoot, { recursive: true });
            const packagedPath = path.join(this.fileCacheRoot, `${this.asset.id.assetId}.zip`);
            if (await (0, fs_extra_1.pathExists)(packagedPath)) {
                this.host.emitMessage(progress_1.EventType.CACHED, `From cache ${packagedPath}`);
                return { packagedPath, contentType };
            }
            this.host.emitMessage(progress_1.EventType.BUILD, `Zip ${fullPath} -> ${packagedPath}`);
            await (0, archive_1.zipDirectory)(fullPath, packagedPath, (m) => this.host.emitMessage(progress_1.EventType.DEBUG, m));
            return { packagedPath, contentType };
        }
        else {
            const contentType = mime.getType(fullPath) ?? 'application/octet-stream';
            return { packagedPath: fullPath, contentType };
        }
    }
    async externalPackageFile(executable) {
        this.host.emitMessage(progress_1.EventType.BUILD, `Building asset source using command: '${executable}'`);
        return {
            packagedPath: (await (0, shell_1.shell)(executable, { quiet: true })).trim(),
            contentType: 'application/zip',
        };
    }
}
exports.FileAssetHandler = FileAssetHandler;
var BucketOwnership;
(function (BucketOwnership) {
    BucketOwnership[BucketOwnership["DOES_NOT_EXIST"] = 0] = "DOES_NOT_EXIST";
    BucketOwnership[BucketOwnership["MINE"] = 1] = "MINE";
    BucketOwnership[BucketOwnership["SOMEONE_ELSES_OR_NO_ACCESS"] = 2] = "SOMEONE_ELSES_OR_NO_ACCESS";
})(BucketOwnership || (BucketOwnership = {}));
async function objectExists(s3, bucket, key) {
    /*
     * The object existence check here refrains from using the `headObject` operation because this
     * would create a negative cache entry, making GET-after-PUT eventually consistent. This has been
     * observed to result in CloudFormation issuing "ValidationError: S3 error: Access Denied", for
     * example in https://github.com/aws/aws-cdk/issues/6430.
     *
     * To prevent this, we are instead using the listObjectsV2 call, using the looked up key as the
     * prefix, and limiting results to 1. Since the list operation returns keys ordered by binary
     * UTF-8 representation, the key we are looking for is guaranteed to always be the first match
     * returned if it exists.
     *
     * If the file is too small, we discount it as a cache hit. There is an issue
     * somewhere that sometimes produces empty zip files, and we would otherwise
     * never retry building those assets without users having to manually clear
     * their bucket, which is a bad experience.
     */
    const response = await s3.listObjectsV2({ Bucket: bucket, Prefix: key, MaxKeys: 1 }).promise();
    return (response.Contents != null &&
        response.Contents.some((object) => object.Key === key && (object.Size == null || object.Size > EMPTY_ZIP_FILE_SIZE)));
}
/**
 * Cache for bucket information, so we don't have to keep doing the same calls again and again
 *
 * We scope the lifetime of the cache to the lifetime of the host, so that we don't have to do
 * anything special for tests and yet the cache will live for the entire lifetime of the asset
 * upload session when used by the CLI.
 */
class BucketInformation {
    static for(host) {
        const existing = BucketInformation.caches.get(host);
        if (existing) {
            return existing;
        }
        const fresh = new BucketInformation();
        BucketInformation.caches.set(host, fresh);
        return fresh;
    }
    constructor() {
        this.ownerships = new Map();
        this.encryptions = new Map();
    }
    async bucketOwnership(s3, bucket) {
        return cached(this.ownerships, bucket, () => this._bucketOwnership(s3, bucket));
    }
    async bucketEncryption(s3, bucket) {
        return cached(this.encryptions, bucket, () => this._bucketEncryption(s3, bucket));
    }
    async _bucketOwnership(s3, bucket) {
        try {
            await s3.getBucketLocation({ Bucket: bucket }).promise();
            return BucketOwnership.MINE;
        }
        catch (e) {
            if (e.code === 'NoSuchBucket') {
                return BucketOwnership.DOES_NOT_EXIST;
            }
            if (['AccessDenied', 'AllAccessDisabled'].includes(e.code)) {
                return BucketOwnership.SOMEONE_ELSES_OR_NO_ACCESS;
            }
            throw e;
        }
    }
    async _bucketEncryption(s3, bucket) {
        try {
            const encryption = await s3.getBucketEncryption({ Bucket: bucket }).promise();
            const l = encryption?.ServerSideEncryptionConfiguration?.Rules?.length ?? 0;
            if (l > 0) {
                const apply = encryption?.ServerSideEncryptionConfiguration?.Rules[0]?.ApplyServerSideEncryptionByDefault;
                let ssealgo = apply?.SSEAlgorithm;
                if (ssealgo === 'AES256')
                    return { type: 'aes256' };
                if (ssealgo === 'aws:kms')
                    return { type: 'kms', kmsKeyId: apply?.KMSMasterKeyID };
            }
            return { type: 'no_encryption' };
        }
        catch (e) {
            if (e.code === 'NoSuchBucket') {
                return { type: 'does_not_exist' };
            }
            if (e.code === 'ServerSideEncryptionConfigurationNotFoundError') {
                return { type: 'no_encryption' };
            }
            if (['AccessDenied', 'AllAccessDisabled'].includes(e.code)) {
                return { type: 'access_denied' };
            }
            return { type: 'no_encryption' };
        }
    }
}
BucketInformation.caches = new WeakMap();
async function cached(cache, key, factory) {
    if (cache.has(key)) {
        return cache.get(key);
    }
    const fresh = await factory(key);
    cache.set(key, fresh);
    return fresh;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQkFBc0Q7QUFDdEQsNkJBQTZCO0FBQzdCLDBFQUFnRjtBQUNoRiw2QkFBNkI7QUFFN0IsNkNBQTJDO0FBQzNDLHdDQUEwQztBQUUxQywwQ0FBeUM7QUFDekMsa0RBQXlEO0FBQ3pELG9DQUFpQztBQUVqQzs7OztHQUlHO0FBQ0gsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFFL0IsTUFBYSxnQkFBZ0I7SUFHM0IsWUFDbUIsT0FBZSxFQUNmLEtBQXdCLEVBQ3hCLElBQWtCO1FBRmxCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUN4QixTQUFJLEdBQUosSUFBSSxDQUFjO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxLQUFLLEtBQW1CLENBQUM7SUFFL0IsS0FBSyxDQUFDLFdBQVc7UUFDdEIsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFBLHFDQUFzQixFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEYsTUFBTSxLQUFLLEdBQUcsUUFBUSxXQUFXLENBQUMsVUFBVSxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4RSxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDdEMsR0FBRyxXQUFXO2dCQUNkLEtBQUssRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsU0FB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QUFFLEdBQU0sRUFBRSxPQUE2QjtJQUNqRixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNuQixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVJlYWRTdHJlYW0sIHByb21pc2VzIGFzIGZzIH0gZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEZpbGVBc3NldFBhY2thZ2luZywgRmlsZVNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBtaW1lIGZyb20gJ21pbWUnO1xuaW1wb3J0IHsgRmlsZU1hbmlmZXN0RW50cnkgfSBmcm9tICcuLi8uLi9hc3NldC1tYW5pZmVzdCc7XG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tICcuLi8uLi9wcm9ncmVzcyc7XG5pbXBvcnQgeyB6aXBEaXJlY3RvcnkgfSBmcm9tICcuLi9hcmNoaXZlJztcbmltcG9ydCB7IElBc3NldEhhbmRsZXIsIElIYW5kbGVySG9zdCB9IGZyb20gJy4uL2Fzc2V0LWhhbmRsZXInO1xuaW1wb3J0IHsgcGF0aEV4aXN0cyB9IGZyb20gJy4uL2ZzLWV4dHJhJztcbmltcG9ydCB7IHJlcGxhY2VBd3NQbGFjZWhvbGRlcnMgfSBmcm9tICcuLi9wbGFjZWhvbGRlcnMnO1xuaW1wb3J0IHsgc2hlbGwgfSBmcm9tICcuLi9zaGVsbCc7XG5cbi8qKlxuICogVGhlIHNpemUgb2YgYW4gZW1wdHkgemlwIGZpbGUgaXMgMjIgYnl0ZXNcbiAqXG4gKiBSZWY6IGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1pJUF8oZmlsZV9mb3JtYXQpXG4gKi9cbmNvbnN0IEVNUFRZX1pJUF9GSUxFX1NJWkUgPSAyMjtcblxuZXhwb3J0IGNsYXNzIEZpbGVBc3NldEhhbmRsZXIgaW1wbGVtZW50cyBJQXNzZXRIYW5kbGVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBmaWxlQ2FjaGVSb290OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSB3b3JrRGlyOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3NldDogRmlsZU1hbmlmZXN0RW50cnksXG4gICAgcHJpdmF0ZSByZWFkb25seSBob3N0OiBJSGFuZGxlckhvc3QpIHtcbiAgICB0aGlzLmZpbGVDYWNoZVJvb3QgPSBwYXRoLmpvaW4od29ya0RpciwgJy5jYWNoZScpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGJ1aWxkKCk6IFByb21pc2U8dm9pZD4ge31cblxuICBwdWJsaWMgYXN5bmMgaXNQdWJsaXNoZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSBhd2FpdCByZXBsYWNlQXdzUGxhY2Vob2xkZXJzKHRoaXMuYXNzZXQuZGVzdGluYXRpb24sIHRoaXMuaG9zdC5hd3MpO1xuICAgIGNvbnN0IHMzVXJsID0gYHMzOi8vJHtkZXN0aW5hdGlvbi5idWNrZXROYW1lfS8ke2Rlc3RpbmF0aW9uLm9iamVjdEtleX1gO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzMyA9IGF3YWl0IHRoaXMuaG9zdC5hd3MuczNDbGllbnQoe1xuICAgICAgICAuLi5kZXN0aW5hdGlvbixcbiAgICAgICAgcXVpZXQ6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuQ0hFQ0ssIGBDaGVjayAke3MzVXJsfWApO1xuXG4gICAgICBpZiAoYXdhaXQgb2JqZWN0RXhpc3RzKHMzLCBkZXN0aW5hdGlvbi5idWNrZXROYW1lLCBkZXN0aW5hdGlvbi5vYmplY3RLZXkpKSB7XG4gICAgICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuRk9VTkQsIGBGb3VuZCAke3MzVXJsfWApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuREVCVUcsIGAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHB1Ymxpc2goKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSBhd2FpdCByZXBsYWNlQXdzUGxhY2Vob2xkZXJzKHRoaXMuYXNzZXQuZGVzdGluYXRpb24sIHRoaXMuaG9zdC5hd3MpO1xuICAgIGNvbnN0IHMzVXJsID0gYHMzOi8vJHtkZXN0aW5hdGlvbi5idWNrZXROYW1lfS8ke2Rlc3RpbmF0aW9uLm9iamVjdEtleX1gO1xuICAgIGNvbnN0IHMzID0gYXdhaXQgdGhpcy5ob3N0LmF3cy5zM0NsaWVudChkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5ob3N0LmVtaXRNZXNzYWdlKEV2ZW50VHlwZS5DSEVDSywgYENoZWNrICR7czNVcmx9YCk7XG5cbiAgICBjb25zdCBidWNrZXRJbmZvID0gQnVja2V0SW5mb3JtYXRpb24uZm9yKHRoaXMuaG9zdCk7XG5cbiAgICAvLyBBIHRodW5rIGZvciBkZXNjcmliaW5nIHRoZSBjdXJyZW50IGFjY291bnQuIFVzZWQgd2hlbiB3ZSBuZWVkIHRvIGZvcm1hdCBhbiBlcnJvclxuICAgIC8vIG1lc3NhZ2UsIG5vdCBpbiB0aGUgc3VjY2VzcyBjYXNlLlxuICAgIGNvbnN0IGFjY291bnQgPSBhc3luYyAoKSA9PiAoYXdhaXQgdGhpcy5ob3N0LmF3cy5kaXNjb3ZlclRhcmdldEFjY291bnQoZGVzdGluYXRpb24pKT8uYWNjb3VudElkO1xuICAgIHN3aXRjaCAoYXdhaXQgYnVja2V0SW5mby5idWNrZXRPd25lcnNoaXAoczMsIGRlc3RpbmF0aW9uLmJ1Y2tldE5hbWUpKSB7XG4gICAgICBjYXNlIEJ1Y2tldE93bmVyc2hpcC5NSU5FOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQnVja2V0T3duZXJzaGlwLkRPRVNfTk9UX0VYSVNUOlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGJ1Y2tldCBuYW1lZCAnJHtkZXN0aW5hdGlvbi5idWNrZXROYW1lfScuIElzIGFjY291bnQgJHthd2FpdCBhY2NvdW50KCl9IGJvb3RzdHJhcHBlZD9gKTtcbiAgICAgIGNhc2UgQnVja2V0T3duZXJzaGlwLlNPTUVPTkVfRUxTRVNfT1JfTk9fQUNDRVNTOlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEJ1Y2tldCBuYW1lZCAnJHtkZXN0aW5hdGlvbi5idWNrZXROYW1lfScgZXhpc3RzLCBidXQgbm90IGluIGFjY291bnQgJHthd2FpdCBhY2NvdW50KCl9LiBXcm9uZyBhY2NvdW50P2ApO1xuICAgIH1cblxuICAgIGlmIChhd2FpdCBvYmplY3RFeGlzdHMoczMsIGRlc3RpbmF0aW9uLmJ1Y2tldE5hbWUsIGRlc3RpbmF0aW9uLm9iamVjdEtleSkpIHtcbiAgICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuRk9VTkQsIGBGb3VuZCAke3MzVXJsfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElkZW50aWZ5IHRoZSB0aGUgYnVja2V0IGVuY3J5cHRpb24gdHlwZSB0byBzZXQgdGhlIGhlYWRlciBvbiB1cGxvYWRcbiAgICAvLyByZXF1aXJlZCBmb3IgU0NQIHJ1bGVzIGRlbnlpbmcgdXBsb2FkcyB3aXRob3V0IGVuY3J5cHRpb24gaGVhZGVyXG4gICAgbGV0IHBhcmFtc0VuY3J5cHRpb246IHtbaW5kZXg6IHN0cmluZ106YW55fT0ge307XG4gICAgY29uc3QgZW5jcnlwdGlvbjIgPSBhd2FpdCBidWNrZXRJbmZvLmJ1Y2tldEVuY3J5cHRpb24oczMsIGRlc3RpbmF0aW9uLmJ1Y2tldE5hbWUpO1xuICAgIHN3aXRjaCAoZW5jcnlwdGlvbjIudHlwZSkge1xuICAgICAgY2FzZSAnbm9fZW5jcnlwdGlvbic6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWVzMjU2JzpcbiAgICAgICAgcGFyYW1zRW5jcnlwdGlvbiA9IHsgU2VydmVyU2lkZUVuY3J5cHRpb246ICdBRVMyNTYnIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAna21zJzpcbiAgICAgICAgLy8gV2UgbXVzdCBpbmNsdWRlIHRoZSBrZXkgSUQgb3RoZXJ3aXNlIFMzIHdpbGwgZW5jcnlwdCB3aXRoIHRoZSBkZWZhdWx0IGtleVxuICAgICAgICBwYXJhbXNFbmNyeXB0aW9uID0ge1xuICAgICAgICAgIFNlcnZlclNpZGVFbmNyeXB0aW9uOiAnYXdzOmttcycsXG4gICAgICAgICAgU1NFS01TS2V5SWQ6IGVuY3J5cHRpb24yLmttc0tleUlkLFxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RvZXNfbm90X2V4aXN0JzpcbiAgICAgICAgdGhpcy5ob3N0LmVtaXRNZXNzYWdlKEV2ZW50VHlwZS5ERUJVRywgYE5vIGJ1Y2tldCBuYW1lZCAnJHtkZXN0aW5hdGlvbi5idWNrZXROYW1lfScuIElzIGFjY291bnQgJHthd2FpdCBhY2NvdW50KCl9IGJvb3RzdHJhcHBlZD9gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhY2Nlc3NfZGVuaWVkJzpcbiAgICAgICAgdGhpcy5ob3N0LmVtaXRNZXNzYWdlKEV2ZW50VHlwZS5ERUJVRywgYENvdWxkIG5vdCByZWFkIGVuY3J5cHRpb24gc2V0dGluZ3Mgb2YgYnVja2V0ICcke2Rlc3RpbmF0aW9uLmJ1Y2tldE5hbWV9JzogdXBsb2FkaW5nIHdpdGggZGVmYXVsdCBzZXR0aW5ncyAoXCJjZGsgYm9vdHN0cmFwXCIgdG8gdmVyc2lvbiA5IGlmIHlvdXIgb3JnYW5pemF0aW9uJ3MgcG9saWNpZXMgcHJldmVudCBhIHN1Y2Nlc3NmdWwgdXBsb2FkIG9yIHRvIGdldCByaWQgb2YgdGhpcyBtZXNzYWdlKS5gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaG9zdC5hYm9ydGVkKSB7IHJldHVybjsgfVxuICAgIGNvbnN0IHB1Ymxpc2hGaWxlID0gdGhpcy5hc3NldC5zb3VyY2UuZXhlY3V0YWJsZSA/XG4gICAgICBhd2FpdCB0aGlzLmV4dGVybmFsUGFja2FnZUZpbGUodGhpcy5hc3NldC5zb3VyY2UuZXhlY3V0YWJsZSkgOiBhd2FpdCB0aGlzLnBhY2thZ2VGaWxlKHRoaXMuYXNzZXQuc291cmNlKTtcblxuICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuVVBMT0FELCBgVXBsb2FkICR7czNVcmx9YCk7XG5cbiAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICBCdWNrZXQ6IGRlc3RpbmF0aW9uLmJ1Y2tldE5hbWUsXG4gICAgICBLZXk6IGRlc3RpbmF0aW9uLm9iamVjdEtleSxcbiAgICAgIEJvZHk6IGNyZWF0ZVJlYWRTdHJlYW0ocHVibGlzaEZpbGUucGFja2FnZWRQYXRoKSxcbiAgICAgIENvbnRlbnRUeXBlOiBwdWJsaXNoRmlsZS5jb250ZW50VHlwZSxcbiAgICB9LFxuICAgIHBhcmFtc0VuY3J5cHRpb24pO1xuXG4gICAgYXdhaXQgczMudXBsb2FkKHBhcmFtcykucHJvbWlzZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwYWNrYWdlRmlsZShzb3VyY2U6IEZpbGVTb3VyY2UpOiBQcm9taXNlPFBhY2thZ2VkRmlsZUFzc2V0PiB7XG4gICAgaWYgKCFzb3VyY2UucGF0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAncGF0aCcgaXMgZXhwZWN0ZWQgaW4gdGhlIEZpbGUgYXNzZXQgc291cmNlLCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkoc291cmNlKX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGlzLndvcmtEaXIsIHNvdXJjZS5wYXRoKTtcblxuICAgIGlmIChzb3VyY2UucGFja2FnaW5nID09PSBGaWxlQXNzZXRQYWNrYWdpbmcuWklQX0RJUkVDVE9SWSkge1xuICAgICAgY29uc3QgY29udGVudFR5cGUgPSAnYXBwbGljYXRpb24vemlwJztcblxuICAgICAgYXdhaXQgZnMubWtkaXIodGhpcy5maWxlQ2FjaGVSb290LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IHBhY2thZ2VkUGF0aCA9IHBhdGguam9pbih0aGlzLmZpbGVDYWNoZVJvb3QsIGAke3RoaXMuYXNzZXQuaWQuYXNzZXRJZH0uemlwYCk7XG5cbiAgICAgIGlmIChhd2FpdCBwYXRoRXhpc3RzKHBhY2thZ2VkUGF0aCkpIHtcbiAgICAgICAgdGhpcy5ob3N0LmVtaXRNZXNzYWdlKEV2ZW50VHlwZS5DQUNIRUQsIGBGcm9tIGNhY2hlICR7cGFja2FnZWRQYXRofWApO1xuICAgICAgICByZXR1cm4geyBwYWNrYWdlZFBhdGgsIGNvbnRlbnRUeXBlIH07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuQlVJTEQsIGBaaXAgJHtmdWxsUGF0aH0gLT4gJHtwYWNrYWdlZFBhdGh9YCk7XG4gICAgICBhd2FpdCB6aXBEaXJlY3RvcnkoZnVsbFBhdGgsIHBhY2thZ2VkUGF0aCwgKG0pID0+IHRoaXMuaG9zdC5lbWl0TWVzc2FnZShFdmVudFR5cGUuREVCVUcsIG0pKTtcbiAgICAgIHJldHVybiB7IHBhY2thZ2VkUGF0aCwgY29udGVudFR5cGUgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udGVudFR5cGUgPSBtaW1lLmdldFR5cGUoZnVsbFBhdGgpID8/ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICAgICAgcmV0dXJuIHsgcGFja2FnZWRQYXRoOiBmdWxsUGF0aCwgY29udGVudFR5cGUgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGV4dGVybmFsUGFja2FnZUZpbGUoZXhlY3V0YWJsZTogc3RyaW5nW10pOiBQcm9taXNlPFBhY2thZ2VkRmlsZUFzc2V0PiB7XG4gICAgdGhpcy5ob3N0LmVtaXRNZXNzYWdlKEV2ZW50VHlwZS5CVUlMRCwgYEJ1aWxkaW5nIGFzc2V0IHNvdXJjZSB1c2luZyBjb21tYW5kOiAnJHtleGVjdXRhYmxlfSdgKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwYWNrYWdlZFBhdGg6IChhd2FpdCBzaGVsbChleGVjdXRhYmxlLCB7IHF1aWV0OiB0cnVlIH0pKS50cmltKCksXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3ppcCcsXG4gICAgfTtcbiAgfVxufVxuXG5lbnVtIEJ1Y2tldE93bmVyc2hpcCB7XG4gIERPRVNfTk9UX0VYSVNULFxuICBNSU5FLFxuICBTT01FT05FX0VMU0VTX09SX05PX0FDQ0VTUyxcbn1cblxudHlwZSBCdWNrZXRFbmNyeXB0aW9uID1cbiAgfCB7IHJlYWRvbmx5IHR5cGU6ICdub19lbmNyeXB0aW9uJyB9XG4gIHwgeyByZWFkb25seSB0eXBlOiAnYWVzMjU2JyB9XG4gIHwgeyByZWFkb25seSB0eXBlOiAna21zJzsgcmVhZG9ubHkga21zS2V5SWQ/OiBzdHJpbmcgfVxuICB8IHsgcmVhZG9ubHkgdHlwZTogJ2FjY2Vzc19kZW5pZWQnIH1cbiAgfCB7IHJlYWRvbmx5IHR5cGU6ICdkb2VzX25vdF9leGlzdCcgfVxuICA7XG5cbmFzeW5jIGZ1bmN0aW9uIG9iamVjdEV4aXN0cyhzMzogQVdTLlMzLCBidWNrZXQ6IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgLypcbiAgICogVGhlIG9iamVjdCBleGlzdGVuY2UgY2hlY2sgaGVyZSByZWZyYWlucyBmcm9tIHVzaW5nIHRoZSBgaGVhZE9iamVjdGAgb3BlcmF0aW9uIGJlY2F1c2UgdGhpc1xuICAgKiB3b3VsZCBjcmVhdGUgYSBuZWdhdGl2ZSBjYWNoZSBlbnRyeSwgbWFraW5nIEdFVC1hZnRlci1QVVQgZXZlbnR1YWxseSBjb25zaXN0ZW50LiBUaGlzIGhhcyBiZWVuXG4gICAqIG9ic2VydmVkIHRvIHJlc3VsdCBpbiBDbG91ZEZvcm1hdGlvbiBpc3N1aW5nIFwiVmFsaWRhdGlvbkVycm9yOiBTMyBlcnJvcjogQWNjZXNzIERlbmllZFwiLCBmb3JcbiAgICogZXhhbXBsZSBpbiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzY0MzAuXG4gICAqXG4gICAqIFRvIHByZXZlbnQgdGhpcywgd2UgYXJlIGluc3RlYWQgdXNpbmcgdGhlIGxpc3RPYmplY3RzVjIgY2FsbCwgdXNpbmcgdGhlIGxvb2tlZCB1cCBrZXkgYXMgdGhlXG4gICAqIHByZWZpeCwgYW5kIGxpbWl0aW5nIHJlc3VsdHMgdG8gMS4gU2luY2UgdGhlIGxpc3Qgb3BlcmF0aW9uIHJldHVybnMga2V5cyBvcmRlcmVkIGJ5IGJpbmFyeVxuICAgKiBVVEYtOCByZXByZXNlbnRhdGlvbiwgdGhlIGtleSB3ZSBhcmUgbG9va2luZyBmb3IgaXMgZ3VhcmFudGVlZCB0byBhbHdheXMgYmUgdGhlIGZpcnN0IG1hdGNoXG4gICAqIHJldHVybmVkIGlmIGl0IGV4aXN0cy5cbiAgICpcbiAgICogSWYgdGhlIGZpbGUgaXMgdG9vIHNtYWxsLCB3ZSBkaXNjb3VudCBpdCBhcyBhIGNhY2hlIGhpdC4gVGhlcmUgaXMgYW4gaXNzdWVcbiAgICogc29tZXdoZXJlIHRoYXQgc29tZXRpbWVzIHByb2R1Y2VzIGVtcHR5IHppcCBmaWxlcywgYW5kIHdlIHdvdWxkIG90aGVyd2lzZVxuICAgKiBuZXZlciByZXRyeSBidWlsZGluZyB0aG9zZSBhc3NldHMgd2l0aG91dCB1c2VycyBoYXZpbmcgdG8gbWFudWFsbHkgY2xlYXJcbiAgICogdGhlaXIgYnVja2V0LCB3aGljaCBpcyBhIGJhZCBleHBlcmllbmNlLlxuICAgKi9cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzMy5saXN0T2JqZWN0c1YyKHsgQnVja2V0OiBidWNrZXQsIFByZWZpeDoga2V5LCBNYXhLZXlzOiAxIH0pLnByb21pc2UoKTtcbiAgcmV0dXJuIChcbiAgICByZXNwb25zZS5Db250ZW50cyAhPSBudWxsICYmXG4gICAgcmVzcG9uc2UuQ29udGVudHMuc29tZShcbiAgICAgIChvYmplY3QpID0+IG9iamVjdC5LZXkgPT09IGtleSAmJiAob2JqZWN0LlNpemUgPT0gbnVsbCB8fCBvYmplY3QuU2l6ZSA+IEVNUFRZX1pJUF9GSUxFX1NJWkUpLFxuICAgIClcbiAgKTtcbn1cblxuLyoqXG4gKiBBIHBhY2thZ2VkIGFzc2V0IHdoaWNoIGNhbiBiZSB1cGxvYWRlZCAoZWl0aGVyIGEgc2luZ2xlIGZpbGUgb3IgZGlyZWN0b3J5KVxuICovXG5pbnRlcmZhY2UgUGFja2FnZWRGaWxlQXNzZXQge1xuICAvKipcbiAgICogUGF0aCBvZiB0aGUgZmlsZSBvciBkaXJlY3RvcnlcbiAgICovXG4gIHJlYWRvbmx5IHBhY2thZ2VkUGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDb250ZW50IHR5cGUgdG8gYmUgYWRkZWQgaW4gdGhlIFMzIHVwbG9hZCBhY3Rpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb250ZW50IHR5cGVcbiAgICovXG4gIHJlYWRvbmx5IGNvbnRlbnRUeXBlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENhY2hlIGZvciBidWNrZXQgaW5mb3JtYXRpb24sIHNvIHdlIGRvbid0IGhhdmUgdG8ga2VlcCBkb2luZyB0aGUgc2FtZSBjYWxscyBhZ2FpbiBhbmQgYWdhaW5cbiAqXG4gKiBXZSBzY29wZSB0aGUgbGlmZXRpbWUgb2YgdGhlIGNhY2hlIHRvIHRoZSBsaWZldGltZSBvZiB0aGUgaG9zdCwgc28gdGhhdCB3ZSBkb24ndCBoYXZlIHRvIGRvXG4gKiBhbnl0aGluZyBzcGVjaWFsIGZvciB0ZXN0cyBhbmQgeWV0IHRoZSBjYWNoZSB3aWxsIGxpdmUgZm9yIHRoZSBlbnRpcmUgbGlmZXRpbWUgb2YgdGhlIGFzc2V0XG4gKiB1cGxvYWQgc2Vzc2lvbiB3aGVuIHVzZWQgYnkgdGhlIENMSS5cbiAqL1xuY2xhc3MgQnVja2V0SW5mb3JtYXRpb24ge1xuICBwdWJsaWMgc3RhdGljIGZvcihob3N0OiBJSGFuZGxlckhvc3QpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IEJ1Y2tldEluZm9ybWF0aW9uLmNhY2hlcy5nZXQoaG9zdCk7XG4gICAgaWYgKGV4aXN0aW5nKSB7IHJldHVybiBleGlzdGluZzsgfVxuXG4gICAgY29uc3QgZnJlc2ggPSBuZXcgQnVja2V0SW5mb3JtYXRpb24oKTtcbiAgICBCdWNrZXRJbmZvcm1hdGlvbi5jYWNoZXMuc2V0KGhvc3QsIGZyZXNoKTtcbiAgICByZXR1cm4gZnJlc2g7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBjYWNoZXMgPSBuZXcgV2Vha01hcDxJSGFuZGxlckhvc3QsIEJ1Y2tldEluZm9ybWF0aW9uPigpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgb3duZXJzaGlwcyA9IG5ldyBNYXA8c3RyaW5nLCBCdWNrZXRPd25lcnNoaXA+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgZW5jcnlwdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgQnVja2V0RW5jcnlwdGlvbj4oKTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGJ1Y2tldE93bmVyc2hpcChzMzogQVdTLlMzLCBidWNrZXQ6IHN0cmluZyk6IFByb21pc2U8QnVja2V0T3duZXJzaGlwPiB7XG4gICAgcmV0dXJuIGNhY2hlZCh0aGlzLm93bmVyc2hpcHMsIGJ1Y2tldCwgKCkgPT4gdGhpcy5fYnVja2V0T3duZXJzaGlwKHMzLCBidWNrZXQpKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBidWNrZXRFbmNyeXB0aW9uKHMzOiBBV1MuUzMsIGJ1Y2tldDogc3RyaW5nKTogUHJvbWlzZTxCdWNrZXRFbmNyeXB0aW9uPiB7XG4gICAgcmV0dXJuIGNhY2hlZCh0aGlzLmVuY3J5cHRpb25zLCBidWNrZXQsICgpID0+IHRoaXMuX2J1Y2tldEVuY3J5cHRpb24oczMsIGJ1Y2tldCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfYnVja2V0T3duZXJzaGlwKHMzOiBBV1MuUzMsIGJ1Y2tldDogc3RyaW5nKTogUHJvbWlzZTxCdWNrZXRPd25lcnNoaXA+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgczMuZ2V0QnVja2V0TG9jYXRpb24oeyBCdWNrZXQ6IGJ1Y2tldCB9KS5wcm9taXNlKCk7XG4gICAgICByZXR1cm4gQnVja2V0T3duZXJzaGlwLk1JTkU7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZS5jb2RlID09PSAnTm9TdWNoQnVja2V0JykgeyByZXR1cm4gQnVja2V0T3duZXJzaGlwLkRPRVNfTk9UX0VYSVNUOyB9XG4gICAgICBpZiAoWydBY2Nlc3NEZW5pZWQnLCAnQWxsQWNjZXNzRGlzYWJsZWQnXS5pbmNsdWRlcyhlLmNvZGUpKSB7IHJldHVybiBCdWNrZXRPd25lcnNoaXAuU09NRU9ORV9FTFNFU19PUl9OT19BQ0NFU1M7IH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfYnVja2V0RW5jcnlwdGlvbihzMzogQVdTLlMzLCBidWNrZXQ6IHN0cmluZyk6IFByb21pc2U8QnVja2V0RW5jcnlwdGlvbj4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbmNyeXB0aW9uID0gYXdhaXQgczMuZ2V0QnVja2V0RW5jcnlwdGlvbih7IEJ1Y2tldDogYnVja2V0IH0pLnByb21pc2UoKTtcbiAgICAgIGNvbnN0IGwgPSBlbmNyeXB0aW9uPy5TZXJ2ZXJTaWRlRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24/LlJ1bGVzPy5sZW5ndGggPz8gMDtcbiAgICAgIGlmIChsID4gMCkge1xuICAgICAgICBjb25zdCBhcHBseSA9IGVuY3J5cHRpb24/LlNlcnZlclNpZGVFbmNyeXB0aW9uQ29uZmlndXJhdGlvbj8uUnVsZXNbMF0/LkFwcGx5U2VydmVyU2lkZUVuY3J5cHRpb25CeURlZmF1bHQ7XG4gICAgICAgIGxldCBzc2VhbGdvID0gYXBwbHk/LlNTRUFsZ29yaXRobTtcbiAgICAgICAgaWYgKHNzZWFsZ28gPT09ICdBRVMyNTYnKSByZXR1cm4geyB0eXBlOiAnYWVzMjU2JyB9O1xuICAgICAgICBpZiAoc3NlYWxnbyA9PT0gJ2F3czprbXMnKSByZXR1cm4geyB0eXBlOiAna21zJywga21zS2V5SWQ6IGFwcGx5Py5LTVNNYXN0ZXJLZXlJRCB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgdHlwZTogJ25vX2VuY3J5cHRpb24nIH07XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICBpZiAoZS5jb2RlID09PSAnTm9TdWNoQnVja2V0Jykge1xuICAgICAgICByZXR1cm4geyB0eXBlOiAnZG9lc19ub3RfZXhpc3QnIH07XG4gICAgICB9XG4gICAgICBpZiAoZS5jb2RlID09PSAnU2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uTm90Rm91bmRFcnJvcicpIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ25vX2VuY3J5cHRpb24nIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChbJ0FjY2Vzc0RlbmllZCcsICdBbGxBY2Nlc3NEaXNhYmxlZCddLmluY2x1ZGVzKGUuY29kZSkpIHtcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogJ2FjY2Vzc19kZW5pZWQnIH07XG4gICAgICB9XG4gICAgICByZXR1cm4geyB0eXBlOiAnbm9fZW5jcnlwdGlvbicgfTtcbiAgICB9XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2FjaGVkPEEsIEI+KGNhY2hlOiBNYXA8QSwgQj4sIGtleTogQSwgZmFjdG9yeTogKHg6IEEpID0+IFByb21pc2U8Qj4pOiBQcm9taXNlPEI+IHtcbiAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgcmV0dXJuIGNhY2hlLmdldChrZXkpITtcbiAgfVxuXG4gIGNvbnN0IGZyZXNoID0gYXdhaXQgZmFjdG9yeShrZXkpO1xuICBjYWNoZS5zZXQoa2V5LCBmcmVzaCk7XG4gIHJldHVybiBmcmVzaDtcbn1cbiJdfQ==