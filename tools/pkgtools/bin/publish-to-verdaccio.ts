import { execCdkBetaNpm } from 'aws-cdk-npm';
import * as fs from 'fs-extra';
import * as path from 'path';

async function publishToVerdaccio(storageDir: string, ...packageDirs: string[]): Promise<number> {
    for (const packageDir of packageDirs) {
        for (const tgz of await fs.readdir(packageDir)) {
            if (!tgz.endsWith('.tgz')) { continue; }
            const tgzPath = path.join(packageDir, tgz);
            // tslint:disable-next-line:no-console
            console.log(`Publishing ${tgzPath}`);
            const result = await execCdkBetaNpm({ storage: storageDir }, 'publish', tgzPath);
            if (result !== 0) {
                return result;
            }
        }
    }
    return 0;
}

publishToVerdaccio(process.argv[2], ...process.argv.slice(3)).then(exitCode => process.exit(exitCode))
      .catch(error => {
          // tslint:disable-next-line:no-console
          console.error(error.stack);
          process.exit(-1);
      });
