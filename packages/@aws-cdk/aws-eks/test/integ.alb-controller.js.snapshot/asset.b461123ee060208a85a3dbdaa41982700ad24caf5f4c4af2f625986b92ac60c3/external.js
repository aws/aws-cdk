"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.external = exports.downloadThumbprint = void 0;
const util = require("node:util");
const tls = require("tls");
const url = require("url");
// eslint-disable-next-line import/no-extraneous-dependencies
const aws = require("aws-sdk");
let client;
function iam() {
    if (!client) {
        client = new aws.IAM();
    }
    return client;
}
function defaultLogger(fmt, ...args) {
    // eslint-disable-next-line no-console
    console.log(fmt, ...args);
}
/**
 * Downloads the CA thumbprint from the issuer URL
 */
async function downloadThumbprint(issuerUrl) {
    exports.external.log(`Downloading certificate authority thumbprint for ${issuerUrl}`);
    return new Promise((ok, ko) => {
        const purl = url.parse(issuerUrl);
        const port = purl.port ? parseInt(purl.port, 10) : 443;
        if (!purl.host) {
            return ko(new Error(`unable to determine host from issuer url ${issuerUrl}`));
        }
        const socket = tls.connect(port, purl.host, { rejectUnauthorized: false, servername: purl.host });
        socket.once('error', ko);
        socket.once('secureConnect', () => {
            // This set to `true` would return the entire chain of certificates as a circular reference object
            let cert = socket.getPeerCertificate(true);
            const unqiueCerts = new Set();
            do {
                unqiueCerts.add(cert);
                cert = cert.issuerCertificate;
            } while (cert && typeof cert === 'object' && !unqiueCerts.has(cert));
            // The last `cert` obtained must be the root certificate in the certificate chain
            const rootCert = [...unqiueCerts].pop();
            // Add `ca: true` when node merges the feature. Awaiting resolution: https://github.com/nodejs/node/issues/44905
            if (!(util.isDeepStrictEqual(rootCert.issuer, rootCert.subject))) {
                return ko(new Error(`Subject and Issuer of certificate received are different. 
        Received: \'Subject\' is ${JSON.stringify(rootCert.subject, null, 4)} and \'Issuer\':${JSON.stringify(rootCert.issuer, null, 4)}`));
            }
            const validTo = new Date(rootCert.valid_to);
            const certificateValidity = getCertificateValidity(validTo);
            if (certificateValidity < 0) {
                return ko(new Error(`The certificate has already expired on: ${validTo.toUTCString()}`));
            }
            // Warning user if certificate validity is expiring within 6 months
            if (certificateValidity < 180) {
                /* eslint-disable-next-line no-console */
                console.warn(`The root certificate obtained would expire in ${certificateValidity} days!`);
            }
            socket.end();
            const thumbprint = rootCert.fingerprint.split(':').join('');
            exports.external.log(`Certificate Authority thumbprint for ${issuerUrl} is ${thumbprint}`);
            ok(thumbprint);
        });
    });
}
exports.downloadThumbprint = downloadThumbprint;
/**
 * To get the validity timeline for the certificate
 * @param certDate The valid to date for the certificate
 * @returns The number of days the certificate is valid wrt current date
 */
function getCertificateValidity(certDate) {
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    const validity = Math.round((certDate.getTime() - currentDate.getTime()) / millisecondsInDay);
    return validity;
}
// allows unit test to replace with mocks
/* eslint-disable max-len */
exports.external = {
    downloadThumbprint,
    log: defaultLogger,
    createOpenIDConnectProvider: (req) => iam().createOpenIDConnectProvider(req).promise(),
    deleteOpenIDConnectProvider: (req) => iam().deleteOpenIDConnectProvider(req).promise(),
    updateOpenIDConnectProviderThumbprint: (req) => iam().updateOpenIDConnectProviderThumbprint(req).promise(),
    addClientIDToOpenIDConnectProvider: (req) => iam().addClientIDToOpenIDConnectProvider(req).promise(),
    removeClientIDFromOpenIDConnectProvider: (req) => iam().removeClientIDFromOpenIDConnectProvider(req).promise(),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleHRlcm5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxrQ0FBa0M7QUFDbEMsMkJBQTJCO0FBQzNCLDJCQUEyQjtBQUMzQiw2REFBNkQ7QUFDN0QsK0JBQStCO0FBRS9CLElBQUksTUFBZSxDQUFDO0FBRXBCLFNBQVMsR0FBRztJQUNWLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFBRSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7S0FBRTtJQUN4QyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsR0FBVyxFQUFFLEdBQUcsSUFBVztJQUNoRCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQ7O0dBRUc7QUFDSSxLQUFLLFVBQVUsa0JBQWtCLENBQUMsU0FBaUI7SUFFeEQsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsb0RBQW9ELFNBQVMsRUFBRSxDQUFDLENBQUM7SUFFOUUsT0FBTyxJQUFJLE9BQU8sQ0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNwQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxPQUFPLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8s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QXlDO0FBQ3pDLDRCQUE0QjtBQUNmLFFBQUEsUUFBUSxHQUFHO0lBQ3RCLGtCQUFrQjtJQUNsQixHQUFHLEVBQUUsYUFBYTtJQUNsQiwyQkFBMkIsRUFBRSxDQUFDLEdBQStDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtJQUNsSSwyQkFBMkIsRUFBRSxDQUFDLEdBQStDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtJQUNsSSxxQ0FBcUMsRUFBRSxDQUFDLEdBQXlELEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLHFDQUFxQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtJQUNoSyxrQ0FBa0MsRUFBRSxDQUFDLEdBQXNELEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtDQUFrQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtJQUN2Six1Q0FBdUMsRUFBRSxDQUFDLEdBQTJELEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLHVDQUF1QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtDQUN2SyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogaXN0YW5idWwgaWdub3JlIGZpbGUgKi9cbmltcG9ydCB7IERldGFpbGVkUGVlckNlcnRpZmljYXRlIH0gZnJvbSAnbm9kZTp0bHMnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICdub2RlOnV0aWwnO1xuaW1wb3J0ICogYXMgdGxzIGZyb20gJ3Rscyc7XG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIGF3cyBmcm9tICdhd3Mtc2RrJztcblxubGV0IGNsaWVudDogYXdzLklBTTtcblxuZnVuY3Rpb24gaWFtKCkge1xuICBpZiAoIWNsaWVudCkgeyBjbGllbnQgPSBuZXcgYXdzLklBTSgpOyB9XG4gIHJldHVybiBjbGllbnQ7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRMb2dnZXIoZm10OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUubG9nKGZtdCwgLi4uYXJncyk7XG59XG5cbi8qKlxuICogRG93bmxvYWRzIHRoZSBDQSB0aHVtYnByaW50IGZyb20gdGhlIGlzc3VlciBVUkxcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkVGh1bWJwcmludChpc3N1ZXJVcmw6IHN0cmluZykge1xuXG4gIGV4dGVybmFsLmxvZyhgRG93bmxvYWRpbmcgY2VydGlmaWNhdGUgYXV0aG9yaXR5IHRodW1icHJpbnQgZm9yICR7aXNzdWVyVXJsfWApO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChvaywga28pID0+IHtcbiAgICBjb25zdCBwdXJsID0gdXJsLnBhcnNlKGlzc3VlclVybCk7XG4gICAgY29uc3QgcG9ydCA9IHB1cmwucG9ydCA/IHBhcnNlSW50KHB1cmwucG9ydCwgMTApIDogNDQzO1xuXG4gICAgaWYgKCFwdXJsLmhvc3QpIHtcbiAgICAgIHJldHVybiBrbyhuZXcgRXJyb3IoYHVuYWJsZSB0byBkZXRlcm1pbmUgaG9zdCBmcm9tIGlzc3VlciB1cmwgJHtpc3N1ZXJVcmx9YCkpO1xuICAgIH1cblxuICAgIGNvbnN0IHNvY2tldCA9IHRscy5jb25uZWN0KHBvcnQsIHB1cmwuaG9zdCwgeyByZWplY3RVbmF1dGhvcml6ZWQ6IGZhbHNlLCBzZXJ2ZXJuYW1lOiBwdXJsLmhvc3QgfSk7XG4gICAgc29ja2V0Lm9uY2UoJ2Vycm9yJywga28pO1xuXG4gICAgc29ja2V0Lm9uY2UoJ3NlY3VyZUNvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHNldCB0byBgdHJ1ZWAgd291bGQgcmV0dXJuIHRoZSBlbnRpcmUgY2hhaW4gb2YgY2VydGlmaWNhdGVzIGFzIGEgY2lyY3VsYXIgcmVmZXJlbmNlIG9iamVjdFxuICAgICAgbGV0IGNlcnQgPSBzb2NrZXQuZ2V0UGVlckNlcnRpZmljYXRlKHRydWUpO1xuXG4gICAgICBjb25zdCB1bnFpdWVDZXJ0cyA9IG5ldyBTZXQ8RGV0YWlsZWRQZWVyQ2VydGlmaWNhdGU+KCk7XG4gICAgICBkbyB7XG4gICAgICAgIHVucWl1ZUNlcnRzLmFkZChjZXJ0KTtcbiAgICAgICAgY2VydCA9IGNlcnQuaXNzdWVyQ2VydGlmaWNhdGU7XG4gICAgICB9IHdoaWxlICggY2VydCAmJiB0eXBlb2YgY2VydCA9PT0gJ29iamVjdCcgJiYgIXVucWl1ZUNlcnRzLmhhcyhjZXJ0KSk7XG5cbiAgICAgIC8vIFRoZSBsYXN0IGBjZXJ0YCBvYnRhaW5lZCBtdXN0IGJlIHRoZSByb290IGNlcnRpZmljYXRlIGluIHRoZSBjZXJ0aWZpY2F0ZSBjaGFpblxuICAgICAgY29uc3Qgcm9vdENlcnQgPSBbLi4udW5xaXVlQ2VydHNdLnBvcCgpITtcblxuICAgICAgLy8gQWRkIGBjYTogdHJ1ZWAgd2hlbiBub2RlIG1lcmdlcyB0aGUgZmVhdHVyZS4gQXdhaXRpbmcgcmVzb2x1dGlvbjogaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2lzc3Vlcy80NDkwNVxuICAgICAgaWYgKCEodXRpbC5pc0RlZXBTdHJpY3RFcXVhbChyb290Q2VydC5pc3N1ZXIsIHJvb3RDZXJ0LnN1YmplY3QpKSkge1xuICAgICAgICByZXR1cm4ga28obmV3IEVycm9yKGBTdWJqZWN0IGFuZCBJc3N1ZXIgb2YgY2VydGlmaWNhdGUgcmVjZWl2ZWQgYXJlIGRpZmZlcmVudC4gXG4gICAgICAgIFJlY2VpdmVkOiBcXCdTdWJqZWN0XFwnIGlzICR7SlNPTi5zdHJpbmdpZnkocm9vdENlcnQuc3ViamVjdCwgbnVsbCwgNCl9IGFuZCBcXCdJc3N1ZXJcXCc6JHtKU09OLnN0cmluZ2lmeShyb290Q2VydC5pc3N1ZXIsIG51bGwsIDQpfWApKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdmFsaWRUbyA9IG5ldyBEYXRlKHJvb3RDZXJ0LnZhbGlkX3RvKTtcbiAgICAgIGNvbnN0IGNlcnRpZmljYXRlVmFsaWRpdHkgPSBnZXRDZXJ0aWZpY2F0ZVZhbGlkaXR5KHZhbGlkVG8pO1xuXG4gICAgICBpZiAoY2VydGlmaWNhdGVWYWxpZGl0eSA8IDApIHtcbiAgICAgICAgcmV0dXJuIGtvKG5ldyBFcnJvcihgVGhlIGNlcnRpZmljYXRlIGhhcyBhbHJlYWR5IGV4cGlyZWQgb246ICR7dmFsaWRUby50b1VUQ1N0cmluZygpfWApKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2FybmluZyB1c2VyIGlmIGNlcnRpZmljYXRlIHZhbGlkaXR5IGlzIGV4cGlyaW5nIHdpdGhpbiA2IG1vbnRoc1xuICAgICAgaWYgKGNlcnRpZmljYXRlVmFsaWRpdHkgPCAxODApIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUgKi9cbiAgICAgICAgY29uc29sZS53YXJuKGBUaGUgcm9vdCBjZXJ0aWZpY2F0ZSBvYnRhaW5lZCB3b3VsZCBleHBpcmUgaW4gJHtjZXJ0aWZpY2F0ZVZhbGlkaXR5fSBkYXlzIWApO1xuICAgICAgfVxuXG4gICAgICBzb2NrZXQuZW5kKCk7XG5cbiAgICAgIGNvbnN0IHRodW1icHJpbnQgPSByb290Q2VydC5maW5nZXJwcmludC5zcGxpdCgnOicpLmpvaW4oJycpO1xuICAgICAgZXh0ZXJuYWwubG9nKGBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgdGh1bWJwcmludCBmb3IgJHtpc3N1ZXJVcmx9IGlzICR7dGh1bWJwcmludH1gKTtcblxuICAgICAgb2sodGh1bWJwcmludCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRvIGdldCB0aGUgdmFsaWRpdHkgdGltZWxpbmUgZm9yIHRoZSBjZXJ0aWZpY2F0ZVxuICogQHBhcmFtIGNlcnREYXRlIFRoZSB2YWxpZCB0byBkYXRlIGZvciB0aGUgY2VydGlmaWNhdGVcbiAqIEByZXR1cm5zIFRoZSBudW1iZXIgb2YgZGF5cyB0aGUgY2VydGlmaWNhdGUgaXMgdmFsaWQgd3J0IGN1cnJlbnQgZGF0ZVxuICovXG5mdW5jdGlvbiBnZXRDZXJ0aWZpY2F0ZVZhbGlkaXR5KGNlcnREYXRlOiBEYXRlKTogTnVtYmVyIHtcbiAgY29uc3QgbWlsbGlzZWNvbmRzSW5EYXkgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgY29uc3QgdmFsaWRpdHkgPSBNYXRoLnJvdW5kKChjZXJ0RGF0ZS5nZXRUaW1lKCkgLSBjdXJyZW50RGF0ZS5nZXRUaW1lKCkpIC8gbWlsbGlzZWNvbmRzSW5EYXkpO1xuXG4gIHJldHVybiB2YWxpZGl0eTtcbn1cblxuLy8gYWxsb3dzIHVuaXQgdGVzdCB0byByZXBsYWNlIHdpdGggbW9ja3Ncbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbmV4cG9ydCBjb25zdCBleHRlcm5hbCA9IHtcbiAgZG93bmxvYWRUaHVtYnByaW50LFxuICBsb2c6IGRlZmF1bHRMb2dnZXIsXG4gIGNyZWF0ZU9wZW5JRENvbm5lY3RQcm92aWRlcjogKHJlcTogYXdzLklBTS5DcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXJSZXF1ZXN0KSA9PiBpYW0oKS5jcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKS5wcm9taXNlKCksXG4gIGRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcjogKHJlcTogYXdzLklBTS5EZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXJSZXF1ZXN0KSA9PiBpYW0oKS5kZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKS5wcm9taXNlKCksXG4gIHVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQ6IChyZXE6IGF3cy5JQU0uVXBkYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyVGh1bWJwcmludFJlcXVlc3QpID0+IGlhbSgpLnVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQocmVxKS5wcm9taXNlKCksXG4gIGFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXI6IChyZXE6IGF3cy5JQU0uQWRkQ2xpZW50SURUb09wZW5JRENvbm5lY3RQcm92aWRlclJlcXVlc3QpID0+IGlhbSgpLmFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKS5wcm9taXNlKCksXG4gIHJlbW92ZUNsaWVudElERnJvbU9wZW5JRENvbm5lY3RQcm92aWRlcjogKHJlcTogYXdzLklBTS5SZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXJSZXF1ZXN0KSA9PiBpYW0oKS5yZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKS5wcm9taXNlKCksXG59O1xuIl19