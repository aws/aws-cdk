import { shell } from '../lib/os';
import { packageCompiler } from '../lib/package-info';

async function main() {
    await shell([packageCompiler(), '-w']);
}

main().catch(e => {
    process.stderr.write(`${e.toString()}\n`);
    process.exit(1);
});