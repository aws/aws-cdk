import { shell } from '../lib/os';
import { packageCompiler } from '../lib/package-info';

try {
    shell([packageCompiler(), '-w']);
} catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e.toString());
    process.exit(1);
}
