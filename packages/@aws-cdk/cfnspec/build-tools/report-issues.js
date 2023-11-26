"use strict";
/* eslint-disable no-console */
/**
 * Report on spec fragment files that are being held back.
 *
 * Report formats:
 *
 * - 'outdated'/'changelog': print for changelog format
 * - 'rejected': print validation errors, exit with error code 1 if there are any
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const validate_cfn_1 = require("./validate-cfn");
async function main(args) {
    if (args.length < 2) {
        throw new Error('Usage: report-issues <DIR> <FORMAT>');
    }
    const [dir, format] = args;
    const officialVersion = (await fs.readJson(path.join(dir, '001_Version.json'))).ResourceSpecificationVersion;
    let headerPrinted = false;
    for (const file of await fs.readdir(dir)) {
        if (!file.startsWith('000_')) {
            continue;
        }
        const json = await fs.readJson(path.join(dir, file));
        const fragmentVersion = json.$version;
        const serviceName = file.replace(/^000_/, '').replace(/\.json$/, '').replace('_', '::');
        switch (format) {
            case 'outdated':
            case 'changelog':
                if (fragmentVersion !== officialVersion) {
                    if (!headerPrinted) {
                        console.log('## Unapplied changes');
                        console.log('');
                        headerPrinted = true;
                    }
                    console.log(`* ${serviceName} is at ${fragmentVersion}`);
                }
                break;
            case 'rejected':
                if (fragmentVersion !== officialVersion) {
                    // Read the 'rejected' file, parse it (which we expect to fail)
                    // and print the failures.
                    const rejectedFileName = `.${file.replace(/.json$/, '.rejected.json')}`;
                    const rejectedPath = path.join(dir, rejectedFileName);
                    if (!await fs.pathExists(rejectedPath)) {
                        // If for whatever reason the file doesn't exist, ignore
                        continue;
                    }
                    const rejectedSpec = await fs.readJson(rejectedPath);
                    const errors = validate_cfn_1.CfnSpecValidator.validate(rejectedSpec);
                    console.warn('='.repeat(70));
                    console.warn(' '.repeat(Math.floor(35 - serviceName.length / 2)) + serviceName);
                    console.warn('='.repeat(70));
                    for (const error of errors) {
                        console.warn((0, validate_cfn_1.formatErrorInContext)(error));
                        process.exitCode = 1;
                    }
                }
                break;
            default:
                throw new Error(`Unknown format type requested: ${format}`);
        }
    }
}
main(process.argv.slice(2)).catch(e => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0LWlzc3Vlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcG9ydC1pc3N1ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjtBQUMvQjs7Ozs7OztHQU9HOztBQUVILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsaURBQXdFO0FBRXhFLEtBQUssVUFBVSxJQUFJLENBQUMsSUFBYztJQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztLQUN4RDtJQUVELE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRTNCLE1BQU0sZUFBZSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFDO0lBQzdHLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztJQUUxQixLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1QixTQUFTO1NBQ1Y7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV4RixRQUFRLE1BQU0sRUFBRTtZQUNkLEtBQUssVUFBVSxDQUFDO1lBQ2hCLEtBQUssV0FBVztnQkFDZCxJQUFJLGVBQWUsS0FBSyxlQUFlLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQzt3QkFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDaEIsYUFBYSxHQUFHLElBQUksQ0FBQztxQkFDdEI7b0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsVUFBVSxlQUFlLEVBQUUsQ0FBQyxDQUFDO2lCQUMxRDtnQkFDRCxNQUFNO1lBRVIsS0FBSyxVQUFVO2dCQUNiLElBQUksZUFBZSxLQUFLLGVBQWUsRUFBRTtvQkFDdkMsK0RBQStEO29CQUMvRCwwQkFBMEI7b0JBQzFCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7b0JBQ3hFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUM7b0JBQ3RELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7d0JBQ3RDLHdEQUF3RDt3QkFDeEQsU0FBUztxQkFDVjtvQkFDRCxNQUFNLFlBQVksR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBRXJELE1BQU0sTUFBTSxHQUFHLCtCQUFnQixDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7b0JBQ2hGLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM3QixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTt3QkFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFBLG1DQUFvQixFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQzFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtpQkFDRjtnQkFDRCxNQUFNO1lBRVI7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUMvRDtLQUNGO0FBQ0gsQ0FBQztBQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNwQyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQixPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8qKlxuICogUmVwb3J0IG9uIHNwZWMgZnJhZ21lbnQgZmlsZXMgdGhhdCBhcmUgYmVpbmcgaGVsZCBiYWNrLlxuICpcbiAqIFJlcG9ydCBmb3JtYXRzOlxuICpcbiAqIC0gJ291dGRhdGVkJy8nY2hhbmdlbG9nJzogcHJpbnQgZm9yIGNoYW5nZWxvZyBmb3JtYXRcbiAqIC0gJ3JlamVjdGVkJzogcHJpbnQgdmFsaWRhdGlvbiBlcnJvcnMsIGV4aXQgd2l0aCBlcnJvciBjb2RlIDEgaWYgdGhlcmUgYXJlIGFueVxuICovXG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBDZm5TcGVjVmFsaWRhdG9yLCBmb3JtYXRFcnJvckluQ29udGV4dCB9IGZyb20gJy4vdmFsaWRhdGUtY2ZuJztcblxuYXN5bmMgZnVuY3Rpb24gbWFpbihhcmdzOiBzdHJpbmdbXSkge1xuICBpZiAoYXJncy5sZW5ndGggPCAyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVc2FnZTogcmVwb3J0LWlzc3VlcyA8RElSPiA8Rk9STUFUPicpO1xuICB9XG5cbiAgY29uc3QgW2RpciwgZm9ybWF0XSA9IGFyZ3M7XG5cbiAgY29uc3Qgb2ZmaWNpYWxWZXJzaW9uID0gKGF3YWl0IGZzLnJlYWRKc29uKHBhdGguam9pbihkaXIsICcwMDFfVmVyc2lvbi5qc29uJykpKS5SZXNvdXJjZVNwZWNpZmljYXRpb25WZXJzaW9uO1xuICBsZXQgaGVhZGVyUHJpbnRlZCA9IGZhbHNlO1xuXG4gIGZvciAoY29uc3QgZmlsZSBvZiBhd2FpdCBmcy5yZWFkZGlyKGRpcikpIHtcbiAgICBpZiAoIWZpbGUuc3RhcnRzV2l0aCgnMDAwXycpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBqc29uID0gYXdhaXQgZnMucmVhZEpzb24ocGF0aC5qb2luKGRpciwgZmlsZSkpO1xuICAgIGNvbnN0IGZyYWdtZW50VmVyc2lvbiA9IGpzb24uJHZlcnNpb247XG4gICAgY29uc3Qgc2VydmljZU5hbWUgPSBmaWxlLnJlcGxhY2UoL14wMDBfLywgJycpLnJlcGxhY2UoL1xcLmpzb24kLywgJycpLnJlcGxhY2UoJ18nLCAnOjonKTtcblxuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlICdvdXRkYXRlZCc6XG4gICAgICBjYXNlICdjaGFuZ2Vsb2cnOlxuICAgICAgICBpZiAoZnJhZ21lbnRWZXJzaW9uICE9PSBvZmZpY2lhbFZlcnNpb24pIHtcbiAgICAgICAgICBpZiAoIWhlYWRlclByaW50ZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcjIyBVbmFwcGxpZWQgY2hhbmdlcycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJycpO1xuICAgICAgICAgICAgaGVhZGVyUHJpbnRlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKGAqICR7c2VydmljZU5hbWV9IGlzIGF0ICR7ZnJhZ21lbnRWZXJzaW9ufWApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdyZWplY3RlZCc6XG4gICAgICAgIGlmIChmcmFnbWVudFZlcnNpb24gIT09IG9mZmljaWFsVmVyc2lvbikge1xuICAgICAgICAgIC8vIFJlYWQgdGhlICdyZWplY3RlZCcgZmlsZSwgcGFyc2UgaXQgKHdoaWNoIHdlIGV4cGVjdCB0byBmYWlsKVxuICAgICAgICAgIC8vIGFuZCBwcmludCB0aGUgZmFpbHVyZXMuXG4gICAgICAgICAgY29uc3QgcmVqZWN0ZWRGaWxlTmFtZSA9IGAuJHtmaWxlLnJlcGxhY2UoLy5qc29uJC8sICcucmVqZWN0ZWQuanNvbicpfWA7XG4gICAgICAgICAgY29uc3QgcmVqZWN0ZWRQYXRoID0gcGF0aC5qb2luKGRpciwgcmVqZWN0ZWRGaWxlTmFtZSk7XG4gICAgICAgICAgaWYgKCFhd2FpdCBmcy5wYXRoRXhpc3RzKHJlamVjdGVkUGF0aCkpIHtcbiAgICAgICAgICAgIC8vIElmIGZvciB3aGF0ZXZlciByZWFzb24gdGhlIGZpbGUgZG9lc24ndCBleGlzdCwgaWdub3JlXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcmVqZWN0ZWRTcGVjID0gYXdhaXQgZnMucmVhZEpzb24ocmVqZWN0ZWRQYXRoKTtcblxuICAgICAgICAgIGNvbnN0IGVycm9ycyA9IENmblNwZWNWYWxpZGF0b3IudmFsaWRhdGUocmVqZWN0ZWRTcGVjKTtcblxuICAgICAgICAgIGNvbnNvbGUud2FybignPScucmVwZWF0KDcwKSk7XG4gICAgICAgICAgY29uc29sZS53YXJuKCcgJy5yZXBlYXQoTWF0aC5mbG9vcigzNSAtIHNlcnZpY2VOYW1lLmxlbmd0aCAvIDIpKSArIHNlcnZpY2VOYW1lKTtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJz0nLnJlcGVhdCg3MCkpO1xuICAgICAgICAgIGZvciAoY29uc3QgZXJyb3Igb2YgZXJyb3JzKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZm9ybWF0RXJyb3JJbkNvbnRleHQoZXJyb3IpKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdENvZGUgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZvcm1hdCB0eXBlIHJlcXVlc3RlZDogJHtmb3JtYXR9YCk7XG4gICAgfVxuICB9XG59XG5cbm1haW4ocHJvY2Vzcy5hcmd2LnNsaWNlKDIpKS5jYXRjaChlID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5lcnJvcihlKTtcbiAgcHJvY2Vzcy5leGl0Q29kZSA9IDE7XG59KTsiXX0=