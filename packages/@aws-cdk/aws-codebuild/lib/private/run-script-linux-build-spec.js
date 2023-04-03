"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScriptLinuxBuildSpec = exports.S3_KEY_ENV = exports.S3_BUCKET_ENV = void 0;
const build_spec_1 = require("../build-spec");
exports.S3_BUCKET_ENV = 'SCRIPT_S3_BUCKET';
exports.S3_KEY_ENV = 'SCRIPT_S3_KEY';
function runScriptLinuxBuildSpec(entrypoint) {
    return build_spec_1.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            pre_build: {
                commands: [
                    // Better echo the location here; if this fails, the error message only contains
                    // the unexpanded variables by default. It might fail if you're running an old
                    // definition of the CodeBuild project--the permissions will have been changed
                    // to only allow downloading the very latest version.
                    `echo "Downloading scripts from s3://\${${exports.S3_BUCKET_ENV}}/\${${exports.S3_KEY_ENV}}"`,
                    `aws s3 cp s3://\${${exports.S3_BUCKET_ENV}}/\${${exports.S3_KEY_ENV}} /tmp`,
                    'mkdir -p /tmp/scriptdir',
                    `unzip /tmp/$(basename \$${exports.S3_KEY_ENV}) -d /tmp/scriptdir`,
                ],
            },
            build: {
                commands: [
                    'export SCRIPT_DIR=/tmp/scriptdir',
                    `echo "Running ${entrypoint}"`,
                    `chmod +x /tmp/scriptdir/${entrypoint}`,
                    `/tmp/scriptdir/${entrypoint}`,
                ],
            },
        },
    });
}
exports.runScriptLinuxBuildSpec = runScriptLinuxBuildSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLXNjcmlwdC1saW51eC1idWlsZC1zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVuLXNjcmlwdC1saW51eC1idWlsZC1zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhDQUEwQztBQUU3QixRQUFBLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQztBQUNuQyxRQUFBLFVBQVUsR0FBRyxlQUFlLENBQUM7QUFFMUMsU0FBZ0IsdUJBQXVCLENBQUMsVUFBa0I7SUFDeEQsT0FBTyxzQkFBUyxDQUFDLFVBQVUsQ0FBQztRQUMxQixPQUFPLEVBQUUsS0FBSztRQUNkLE1BQU0sRUFBRTtZQUNOLFNBQVMsRUFBRTtnQkFDVCxRQUFRLEVBQUU7b0JBQ1IsZ0ZBQWdGO29CQUNoRiw4RUFBOEU7b0JBQzlFLDhFQUE4RTtvQkFDOUUscURBQXFEO29CQUNyRCwwQ0FBMEMscUJBQWEsUUFBUSxrQkFBVSxJQUFJO29CQUM3RSxxQkFBcUIscUJBQWEsUUFBUSxrQkFBVSxRQUFRO29CQUM1RCx5QkFBeUI7b0JBQ3pCLDJCQUEyQixrQkFBVSxxQkFBcUI7aUJBQzNEO2FBQ0Y7WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFO29CQUNSLGtDQUFrQztvQkFDbEMsaUJBQWlCLFVBQVUsR0FBRztvQkFDOUIsMkJBQTJCLFVBQVUsRUFBRTtvQkFDdkMsa0JBQWtCLFVBQVUsRUFBRTtpQkFDL0I7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTFCRCwwREEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCdWlsZFNwZWMgfSBmcm9tICcuLi9idWlsZC1zcGVjJztcblxuZXhwb3J0IGNvbnN0IFMzX0JVQ0tFVF9FTlYgPSAnU0NSSVBUX1MzX0JVQ0tFVCc7XG5leHBvcnQgY29uc3QgUzNfS0VZX0VOViA9ICdTQ1JJUFRfUzNfS0VZJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blNjcmlwdExpbnV4QnVpbGRTcGVjKGVudHJ5cG9pbnQ6IHN0cmluZykge1xuICByZXR1cm4gQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgIHZlcnNpb246ICcwLjInLFxuICAgIHBoYXNlczoge1xuICAgICAgcHJlX2J1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgLy8gQmV0dGVyIGVjaG8gdGhlIGxvY2F0aW9uIGhlcmU7IGlmIHRoaXMgZmFpbHMsIHRoZSBlcnJvciBtZXNzYWdlIG9ubHkgY29udGFpbnNcbiAgICAgICAgICAvLyB0aGUgdW5leHBhbmRlZCB2YXJpYWJsZXMgYnkgZGVmYXVsdC4gSXQgbWlnaHQgZmFpbCBpZiB5b3UncmUgcnVubmluZyBhbiBvbGRcbiAgICAgICAgICAvLyBkZWZpbml0aW9uIG9mIHRoZSBDb2RlQnVpbGQgcHJvamVjdC0tdGhlIHBlcm1pc3Npb25zIHdpbGwgaGF2ZSBiZWVuIGNoYW5nZWRcbiAgICAgICAgICAvLyB0byBvbmx5IGFsbG93IGRvd25sb2FkaW5nIHRoZSB2ZXJ5IGxhdGVzdCB2ZXJzaW9uLlxuICAgICAgICAgIGBlY2hvIFwiRG93bmxvYWRpbmcgc2NyaXB0cyBmcm9tIHMzOi8vXFwkeyR7UzNfQlVDS0VUX0VOVn19L1xcJHske1MzX0tFWV9FTlZ9fVwiYCxcbiAgICAgICAgICBgYXdzIHMzIGNwIHMzOi8vXFwkeyR7UzNfQlVDS0VUX0VOVn19L1xcJHske1MzX0tFWV9FTlZ9fSAvdG1wYCxcbiAgICAgICAgICAnbWtkaXIgLXAgL3RtcC9zY3JpcHRkaXInLFxuICAgICAgICAgIGB1bnppcCAvdG1wLyQoYmFzZW5hbWUgXFwkJHtTM19LRVlfRU5WfSkgLWQgL3RtcC9zY3JpcHRkaXJgLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiBbXG4gICAgICAgICAgJ2V4cG9ydCBTQ1JJUFRfRElSPS90bXAvc2NyaXB0ZGlyJyxcbiAgICAgICAgICBgZWNobyBcIlJ1bm5pbmcgJHtlbnRyeXBvaW50fVwiYCxcbiAgICAgICAgICBgY2htb2QgK3ggL3RtcC9zY3JpcHRkaXIvJHtlbnRyeXBvaW50fWAsXG4gICAgICAgICAgYC90bXAvc2NyaXB0ZGlyLyR7ZW50cnlwb2ludH1gLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn1cbiJdfQ==