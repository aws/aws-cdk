import { BuildSpec } from '../build-spec';

export const S3_BUCKET_ENV = 'SCRIPT_S3_BUCKET';
export const S3_KEY_ENV = 'SCRIPT_S3_KEY';

export function runScriptLinuxBuildSpec(entrypoint: string) {
  return BuildSpec.fromObject({
    version: '0.2',
    phases: {
      pre_build: {
        commands: [
          // Better echo the location here; if this fails, the error message only contains
          // the unexpanded variables by default. It might fail if you're running an old
          // definition of the CodeBuild project--the permissions will have been changed
          // to only allow downloading the very latest version.
          `echo "Downloading scripts from s3://\${${S3_BUCKET_ENV}}/\${${S3_KEY_ENV}}"`,
          `aws s3 cp s3://\${${S3_BUCKET_ENV}}/\${${S3_KEY_ENV}} /tmp`,
          'mkdir -p /tmp/scriptdir',
          `unzip /tmp/$(basename \$${S3_KEY_ENV}) -d /tmp/scriptdir`,
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
