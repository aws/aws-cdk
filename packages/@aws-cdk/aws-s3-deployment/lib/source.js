"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path_1 = require("path");
const s3_assets = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const render_data_1 = require("./render-data");
/**
 * Specifies bucket deployment source.
 *
 * Usage:
 *
 *     Source.bucket(bucket, key)
 *     Source.asset('/local/path/to/directory')
 *     Source.asset('/local/path/to/a/file.zip')
 *     Source.data('hello/world/file.txt', 'Hello, world!')
 *     Source.data('config.json', { baz: topic.topicArn })
 *
 */
class Source {
    constructor() { }
    /**
     * Uses a .zip file stored in an S3 bucket as the source for the destination bucket contents.
     *
     * Make sure you trust the producer of the archive.
     *
     * @param bucket The S3 Bucket
     * @param zipObjectKey The S3 object key of the zip file with contents
     */
    static bucket(bucket, zipObjectKey) {
        return {
            bind: (_, context) => {
                if (!context) {
                    throw new Error('To use a Source.bucket(), context must be provided');
                }
                bucket.grantRead(context.handlerRole);
                return { bucket, zipObjectKey };
            },
        };
    }
    /**
     * Uses a local asset as the deployment source.
     *
     * If the local asset is a .zip archive, make sure you trust the
     * producer of the archive.
     *
     * @param path The path to a local .zip file or a directory
     */
    static asset(path, options) {
        return {
            bind(scope, context) {
                if (!context) {
                    throw new Error('To use a Source.asset(), context must be provided');
                }
                let id = 1;
                while (scope.node.tryFindChild(`Asset${id}`)) {
                    id++;
                }
                const asset = new s3_assets.Asset(scope, `Asset${id}`, {
                    path,
                    ...options,
                });
                if (!asset.isZipArchive) {
                    throw new Error('Asset path must be either a .zip file or a directory');
                }
                asset.grantRead(context.handlerRole);
                return {
                    bucket: asset.bucket,
                    zipObjectKey: asset.s3ObjectKey,
                };
            },
        };
    }
    /**
     * Deploys an object with the specified string contents into the bucket. The
     * content can include deploy-time values (such as `snsTopic.topicArn`) that
     * will get resolved only during deployment.
     *
     * To store a JSON object use `Source.jsonData()`.
     *
     * @param objectKey The destination S3 object key (relative to the root of the
     * S3 deployment).
     * @param data The data to be stored in the object.
     */
    static data(objectKey, data) {
        return {
            bind: (scope, context) => {
                const workdir = core_1.FileSystem.mkdtemp('s3-deployment');
                const outputPath = path_1.join(workdir, objectKey);
                const rendered = render_data_1.renderData(scope, data);
                fs.mkdirSync(path_1.dirname(outputPath), { recursive: true });
                fs.writeFileSync(outputPath, rendered.text);
                const asset = this.asset(workdir).bind(scope, context);
                return {
                    bucket: asset.bucket,
                    zipObjectKey: asset.zipObjectKey,
                    markers: rendered.markers,
                };
            },
        };
    }
    /**
     * Deploys an object with the specified JSON object into the bucket. The
     * object can include deploy-time values (such as `snsTopic.topicArn`) that
     * will get resolved only during deployment.
     *
     * @param objectKey The destination S3 object key (relative to the root of the
     * S3 deployment).
     * @param obj A JSON object.
     */
    static jsonData(objectKey, obj) {
        return {
            bind: (scope, context) => {
                return Source.data(objectKey, core_1.Stack.of(scope).toJsonString(obj)).bind(scope, context);
            },
        };
    }
}
exports.Source = Source;
_a = JSII_RTTI_SYMBOL_1;
Source[_a] = { fqn: "@aws-cdk/aws-s3-deployment.Source", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLCtCQUFxQztBQUdyQyxvREFBb0Q7QUFDcEQsd0NBQWtEO0FBRWxELCtDQUEyQztBQTRDM0M7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFhLE1BQU07SUF3R2pCLGlCQUF5QjtJQXZHekI7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBa0IsRUFBRSxZQUFvQjtRQUMzRCxPQUFPO1lBQ0wsSUFBSSxFQUFFLENBQUMsQ0FBWSxFQUFFLE9BQWlDLEVBQUUsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7aUJBQ3ZFO2dCQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN0QyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDO1lBQ2xDLENBQUM7U0FDRixDQUFDO0tBQ0g7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFZLEVBQUUsT0FBZ0M7UUFDaEUsT0FBTztZQUNMLElBQUksQ0FBQyxLQUFnQixFQUFFLE9BQWlDO2dCQUN0RCxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztpQkFDdEU7Z0JBRUQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUM1QyxFQUFFLEVBQUUsQ0FBQztpQkFDTjtnQkFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7b0JBQ3JELElBQUk7b0JBQ0osR0FBRyxPQUFPO2lCQUNYLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtvQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO2lCQUN6RTtnQkFDRCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFckMsT0FBTztvQkFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07b0JBQ3BCLFlBQVksRUFBRSxLQUFLLENBQUMsV0FBVztpQkFDaEMsQ0FBQztZQUNKLENBQUM7U0FDRixDQUFDO0tBQ0g7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFpQixFQUFFLElBQVk7UUFDaEQsT0FBTztZQUNMLElBQUksRUFBRSxDQUFDLEtBQWdCLEVBQUUsT0FBaUMsRUFBRSxFQUFFO2dCQUM1RCxNQUFNLE9BQU8sR0FBRyxpQkFBVSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxVQUFVLEdBQUcsV0FBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxRQUFRLEdBQUcsd0JBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3ZELEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxPQUFPO29CQUNMLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtvQkFDcEIsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO29CQUNoQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU87aUJBQzFCLENBQUM7WUFDSixDQUFDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQWlCLEVBQUUsR0FBUTtRQUNoRCxPQUFPO1lBQ0wsSUFBSSxFQUFFLENBQUMsS0FBZ0IsRUFBRSxPQUFpQyxFQUFFLEVBQUU7Z0JBQzVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3hGLENBQUM7U0FDRixDQUFDO0tBQ0g7O0FBdEdILHdCQXlHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IGpvaW4sIGRpcm5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBzM19hc3NldHMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyByZW5kZXJEYXRhIH0gZnJvbSAnLi9yZW5kZXItZGF0YSc7XG5cbi8qKlxuICogU291cmNlIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNvdXJjZUNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgc291cmNlIGJ1Y2tldCB0byBkZXBsb3kgZnJvbS5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogQW4gUzMgb2JqZWN0IGtleSBpbiB0aGUgc291cmNlIGJ1Y2tldCB0aGF0IHBvaW50cyB0byBhIHppcCBmaWxlLlxuICAgKi9cbiAgcmVhZG9ubHkgemlwT2JqZWN0S2V5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgc2V0IG9mIG1hcmtlcnMgdG8gc3Vic3RpdHV0ZSBpbiB0aGUgc291cmNlIGNvbnRlbnQuXG4gICAqIEBkZWZhdWx0IC0gbm8gbWFya2Vyc1xuICAgKi9cbiAgcmVhZG9ubHkgbWFya2Vycz86IFJlY29yZDxzdHJpbmcsIGFueT47XG59XG5cbi8qKlxuICogQmluZCBjb250ZXh0IGZvciBJU291cmNlc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIERlcGxveW1lbnRTb3VyY2VDb250ZXh0IHtcbiAgLyoqXG4gICAqIFRoZSByb2xlIGZvciB0aGUgaGFuZGxlclxuICAgKi9cbiAgcmVhZG9ubHkgaGFuZGxlclJvbGU6IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgc291cmNlIGZvciBidWNrZXQgZGVwbG95bWVudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZSB7XG4gIC8qKlxuICAgKiBCaW5kcyB0aGUgc291cmNlIHRvIGEgYnVja2V0IGRlcGxveW1lbnQuXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgY29uc3RydWN0IHRyZWUgY29udGV4dC5cbiAgICovXG4gIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgY29udGV4dD86IERlcGxveW1lbnRTb3VyY2VDb250ZXh0KTogU291cmNlQ29uZmlnO1xufVxuXG4vKipcbiAqIFNwZWNpZmllcyBidWNrZXQgZGVwbG95bWVudCBzb3VyY2UuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogICAgIFNvdXJjZS5idWNrZXQoYnVja2V0LCBrZXkpXG4gKiAgICAgU291cmNlLmFzc2V0KCcvbG9jYWwvcGF0aC90by9kaXJlY3RvcnknKVxuICogICAgIFNvdXJjZS5hc3NldCgnL2xvY2FsL3BhdGgvdG8vYS9maWxlLnppcCcpXG4gKiAgICAgU291cmNlLmRhdGEoJ2hlbGxvL3dvcmxkL2ZpbGUudHh0JywgJ0hlbGxvLCB3b3JsZCEnKVxuICogICAgIFNvdXJjZS5kYXRhKCdjb25maWcuanNvbicsIHsgYmF6OiB0b3BpYy50b3BpY0FybiB9KVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFNvdXJjZSB7XG4gIC8qKlxuICAgKiBVc2VzIGEgLnppcCBmaWxlIHN0b3JlZCBpbiBhbiBTMyBidWNrZXQgYXMgdGhlIHNvdXJjZSBmb3IgdGhlIGRlc3RpbmF0aW9uIGJ1Y2tldCBjb250ZW50cy5cbiAgICpcbiAgICogTWFrZSBzdXJlIHlvdSB0cnVzdCB0aGUgcHJvZHVjZXIgb2YgdGhlIGFyY2hpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBidWNrZXQgVGhlIFMzIEJ1Y2tldFxuICAgKiBAcGFyYW0gemlwT2JqZWN0S2V5IFRoZSBTMyBvYmplY3Qga2V5IG9mIHRoZSB6aXAgZmlsZSB3aXRoIGNvbnRlbnRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGJ1Y2tldChidWNrZXQ6IHMzLklCdWNrZXQsIHppcE9iamVjdEtleTogc3RyaW5nKTogSVNvdXJjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJpbmQ6IChfOiBDb25zdHJ1Y3QsIGNvbnRleHQ/OiBEZXBsb3ltZW50U291cmNlQ29udGV4dCkgPT4ge1xuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvIHVzZSBhIFNvdXJjZS5idWNrZXQoKSwgY29udGV4dCBtdXN0IGJlIHByb3ZpZGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBidWNrZXQuZ3JhbnRSZWFkKGNvbnRleHQuaGFuZGxlclJvbGUpO1xuICAgICAgICByZXR1cm4geyBidWNrZXQsIHppcE9iamVjdEtleSB9O1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZXMgYSBsb2NhbCBhc3NldCBhcyB0aGUgZGVwbG95bWVudCBzb3VyY2UuXG4gICAqXG4gICAqIElmIHRoZSBsb2NhbCBhc3NldCBpcyBhIC56aXAgYXJjaGl2ZSwgbWFrZSBzdXJlIHlvdSB0cnVzdCB0aGVcbiAgICogcHJvZHVjZXIgb2YgdGhlIGFyY2hpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIGEgbG9jYWwgLnppcCBmaWxlIG9yIGEgZGlyZWN0b3J5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFzc2V0KHBhdGg6IHN0cmluZywgb3B0aW9ucz86IHMzX2Fzc2V0cy5Bc3NldE9wdGlvbnMpOiBJU291cmNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmluZChzY29wZTogQ29uc3RydWN0LCBjb250ZXh0PzogRGVwbG95bWVudFNvdXJjZUNvbnRleHQpOiBTb3VyY2VDb25maWcge1xuICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvIHVzZSBhIFNvdXJjZS5hc3NldCgpLCBjb250ZXh0IG11c3QgYmUgcHJvdmlkZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpZCA9IDE7XG4gICAgICAgIHdoaWxlIChzY29wZS5ub2RlLnRyeUZpbmRDaGlsZChgQXNzZXQke2lkfWApKSB7XG4gICAgICAgICAgaWQrKztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhc3NldCA9IG5ldyBzM19hc3NldHMuQXNzZXQoc2NvcGUsIGBBc3NldCR7aWR9YCwge1xuICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghYXNzZXQuaXNaaXBBcmNoaXZlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBc3NldCBwYXRoIG11c3QgYmUgZWl0aGVyIGEgLnppcCBmaWxlIG9yIGEgZGlyZWN0b3J5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXQuZ3JhbnRSZWFkKGNvbnRleHQuaGFuZGxlclJvbGUpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYnVja2V0OiBhc3NldC5idWNrZXQsXG4gICAgICAgICAgemlwT2JqZWN0S2V5OiBhc3NldC5zM09iamVjdEtleSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXBsb3lzIGFuIG9iamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgc3RyaW5nIGNvbnRlbnRzIGludG8gdGhlIGJ1Y2tldC4gVGhlXG4gICAqIGNvbnRlbnQgY2FuIGluY2x1ZGUgZGVwbG95LXRpbWUgdmFsdWVzIChzdWNoIGFzIGBzbnNUb3BpYy50b3BpY0FybmApIHRoYXRcbiAgICogd2lsbCBnZXQgcmVzb2x2ZWQgb25seSBkdXJpbmcgZGVwbG95bWVudC5cbiAgICpcbiAgICogVG8gc3RvcmUgYSBKU09OIG9iamVjdCB1c2UgYFNvdXJjZS5qc29uRGF0YSgpYC5cbiAgICpcbiAgICogQHBhcmFtIG9iamVjdEtleSBUaGUgZGVzdGluYXRpb24gUzMgb2JqZWN0IGtleSAocmVsYXRpdmUgdG8gdGhlIHJvb3Qgb2YgdGhlXG4gICAqIFMzIGRlcGxveW1lbnQpLlxuICAgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB0byBiZSBzdG9yZWQgaW4gdGhlIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZGF0YShvYmplY3RLZXk6IHN0cmluZywgZGF0YTogc3RyaW5nKTogSVNvdXJjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJpbmQ6IChzY29wZTogQ29uc3RydWN0LCBjb250ZXh0PzogRGVwbG95bWVudFNvdXJjZUNvbnRleHQpID0+IHtcbiAgICAgICAgY29uc3Qgd29ya2RpciA9IEZpbGVTeXN0ZW0ubWtkdGVtcCgnczMtZGVwbG95bWVudCcpO1xuICAgICAgICBjb25zdCBvdXRwdXRQYXRoID0gam9pbih3b3JrZGlyLCBvYmplY3RLZXkpO1xuICAgICAgICBjb25zdCByZW5kZXJlZCA9IHJlbmRlckRhdGEoc2NvcGUsIGRhdGEpO1xuICAgICAgICBmcy5ta2RpclN5bmMoZGlybmFtZShvdXRwdXRQYXRoKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMob3V0cHV0UGF0aCwgcmVuZGVyZWQudGV4dCk7XG4gICAgICAgIGNvbnN0IGFzc2V0ID0gdGhpcy5hc3NldCh3b3JrZGlyKS5iaW5kKHNjb3BlLCBjb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBidWNrZXQ6IGFzc2V0LmJ1Y2tldCxcbiAgICAgICAgICB6aXBPYmplY3RLZXk6IGFzc2V0LnppcE9iamVjdEtleSxcbiAgICAgICAgICBtYXJrZXJzOiByZW5kZXJlZC5tYXJrZXJzLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERlcGxveXMgYW4gb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCBKU09OIG9iamVjdCBpbnRvIHRoZSBidWNrZXQuIFRoZVxuICAgKiBvYmplY3QgY2FuIGluY2x1ZGUgZGVwbG95LXRpbWUgdmFsdWVzIChzdWNoIGFzIGBzbnNUb3BpYy50b3BpY0FybmApIHRoYXRcbiAgICogd2lsbCBnZXQgcmVzb2x2ZWQgb25seSBkdXJpbmcgZGVwbG95bWVudC5cbiAgICpcbiAgICogQHBhcmFtIG9iamVjdEtleSBUaGUgZGVzdGluYXRpb24gUzMgb2JqZWN0IGtleSAocmVsYXRpdmUgdG8gdGhlIHJvb3Qgb2YgdGhlXG4gICAqIFMzIGRlcGxveW1lbnQpLlxuICAgKiBAcGFyYW0gb2JqIEEgSlNPTiBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGpzb25EYXRhKG9iamVjdEtleTogc3RyaW5nLCBvYmo6IGFueSk6IElTb3VyY2Uge1xuICAgIHJldHVybiB7XG4gICAgICBiaW5kOiAoc2NvcGU6IENvbnN0cnVjdCwgY29udGV4dD86IERlcGxveW1lbnRTb3VyY2VDb250ZXh0KSA9PiB7XG4gICAgICAgIHJldHVybiBTb3VyY2UuZGF0YShvYmplY3RLZXksIFN0YWNrLm9mKHNjb3BlKS50b0pzb25TdHJpbmcob2JqKSkuYmluZChzY29wZSwgY29udGV4dCk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XG59XG4iXX0=