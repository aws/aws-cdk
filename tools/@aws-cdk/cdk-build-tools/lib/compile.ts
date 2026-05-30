import * as path from 'path';
import * as zlib from 'zlib';
import * as fs from 'fs-extra';
import { makeExecutable, shell } from './os';
import type { CDKBuildOptions, CompilerOverrides } from './package-info';
import { currentPackageJson, packageCompiler } from './package-info';
import type { Timers } from './timer';

/**
 * Run the compiler on the current package
 */
export async function compileCurrentPackage(options: CDKBuildOptions, timers: Timers, compilers: CompilerOverrides = {}): Promise<void> {
  const env = options.env;
  await shell(packageCompiler(compilers, options), { timers, env });

  // Find files in bin/ that look like they should be executable, and make them so.
  const scripts = currentPackageJson().bin || {};
  for (const script of Object.values(scripts) as any) {
    await makeExecutable(script);
  }

  // Inject Ruby acronyms into the .jsii assembly if it exists
  // Inject Ruby acronyms into the .jsii assembly if it exists
  const jsiiFile = path.join(process.cwd(), '.jsii');
  if (await fs.pathExists(jsiiFile)) {
    let assembly = await fs.readJson(jsiiFile);
    let isGzipped = false;
    let gzFile = '';

    if (assembly.schema === 'jsii/file-redirect' && assembly.compression === 'gzip') {
      isGzipped = true;
      gzFile = path.join(process.cwd(), assembly.filename);
      const gzBuffer = await fs.readFile(gzFile);
      const decompressed = zlib.gunzipSync(gzBuffer);
      assembly = JSON.parse(decompressed.toString('utf-8'));
    }

    if (assembly.targets) {
      assembly.targets.ruby = assembly.targets.ruby || {};
      assembly.targets.ruby.acronyms = [
        'AWS', 'S3', 'IAM', 'VPC', 'CDK', 'SQS', 'SNS', 'EC2', 'RDS', 'KMS',
      ];

      if (isGzipped) {
        const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(assembly)));
        await fs.writeFile(gzFile, compressed);
      } else {
        await fs.writeJson(jsiiFile, assembly, { spaces: 2 });
      }
    }
  }
}
