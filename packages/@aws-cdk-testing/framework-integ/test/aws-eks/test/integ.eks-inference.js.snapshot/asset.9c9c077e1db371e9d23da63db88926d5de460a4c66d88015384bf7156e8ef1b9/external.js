"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.external = void 0;
const tls = require("tls");
const url = require("url");
// eslint-disable-next-line import/no-extraneous-dependencies
const sdk = require("@aws-sdk/client-iam");
let client;
function iam() {
    if (!client) {
        client = new sdk.IAM({});
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
    return new Promise((ok, ko) => {
        const purl = url.parse(issuerUrl);
        const port = purl.port ? parseInt(purl.port, 10) : 443;
        if (!purl.host) {
            return ko(new Error(`unable to determine host from issuer url ${issuerUrl}`));
        }
        exports.external.log(`Fetching x509 certificate chain from issuer ${issuerUrl}`);
        const socket = tls.connect(port, purl.host, { rejectUnauthorized: false, servername: purl.host });
        socket.once('error', ko);
        socket.once('secureConnect', () => {
            let cert = socket.getPeerX509Certificate();
            if (!cert) {
                throw new Error(`Unable to retrieve X509 certificate from host ${purl.host}`);
            }
            while (cert.issuerCertificate) {
                printCertificate(cert);
                cert = cert.issuerCertificate;
            }
            const validTo = new Date(cert.validTo);
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
            const thumbprint = extractThumbprint(cert);
            exports.external.log(`Certificate Authority thumbprint for ${issuerUrl} is ${thumbprint}`);
            ok(thumbprint);
        });
    });
}
function extractThumbprint(cert) {
    return cert.fingerprint.split(':').join('');
}
function printCertificate(cert) {
    exports.external.log('-------------BEGIN CERT----------------');
    exports.external.log(`Thumbprint: ${extractThumbprint(cert)}`);
    exports.external.log(`Valid To: ${cert.validTo}`);
    if (cert.issuerCertificate) {
        exports.external.log(`Issuer Thumbprint: ${extractThumbprint(cert.issuerCertificate)}`);
    }
    exports.external.log(`Issuer: ${cert.issuer}`);
    exports.external.log(`Subject: ${cert.subject}`);
    exports.external.log('-------------END CERT------------------');
}
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
    createOpenIDConnectProvider: (req) => iam().createOpenIDConnectProvider(req),
    deleteOpenIDConnectProvider: (req) => iam().deleteOpenIDConnectProvider(req),
    updateOpenIDConnectProviderThumbprint: (req) => iam().updateOpenIDConnectProviderThumbprint(req),
    addClientIDToOpenIDConnectProvider: (req) => iam().addClientIDToOpenIDConnectProvider(req),
    removeClientIDFromOpenIDConnectProvider: (req) => iam().removeClientIDFromOpenIDConnectProvider(req),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleHRlcm5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyQkFBMkI7QUFDM0IsMkJBQTJCO0FBQzNCLDZEQUE2RDtBQUM3RCwyQ0FBMkM7QUFFM0MsSUFBSSxNQUFlLENBQUM7QUFDcEIsU0FBUyxHQUFHO0lBQ1YsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUFFLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7S0FBRTtJQUMxQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsR0FBVyxFQUFFLEdBQUcsSUFBVztJQUNoRCxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsU0FBaUI7SUFFakQsT0FBTyxJQUFJLE9BQU8sQ0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNwQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxPQUFPLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsK0NBQStDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFekUsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbEcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFekIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzNDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDL0U7WUFDRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDN0IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7YUFDL0I7WUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkMsTUFBTSxtQkFBbUIsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU1RCxJQUFJLG1CQUFtQixHQUFHLENBQUMsRUFBRTtnQkFDM0IsT0FBTyxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsMkNBQTJDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxRjtZQUVELG1FQUFtRTtZQUNuRSxJQUFJLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtnQkFDN0IseUNBQXlDO2dCQUN6QyxPQUFPLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxtQkFBbUIsUUFBUSxDQUFDLENBQUM7YUFDNUY7WUFFRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFYixNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsU0FBUyxPQUFPLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFFbkYsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFxQjtJQUM5QyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFxQjtJQUM3QyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0lBQ3hELGdCQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELGdCQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDMUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLGlCQUFpQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNqRjtJQUNELGdCQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDdkMsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN6QyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxzQkFBc0IsQ0FBQyxRQUFjO0lBQzVDLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzlDLE1BQU0sV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFFL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO0lBRTlGLE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFRCx5Q0FBeUM7QUFDekMsNEJBQTRCO0FBQ2YsUUFBQSxRQUFRLEdBQUc7SUFDdEIsa0JBQWtCO0lBQ2xCLEdBQUcsRUFBRSxhQUFhO0lBQ2xCLDJCQUEyQixFQUFFLENBQUMsR0FBZ0QsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDO0lBQ3pILDJCQUEyQixFQUFFLENBQUMsR0FBZ0QsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDO0lBQ3pILHFDQUFxQyxFQUFFLENBQUMsR0FBMEQsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMscUNBQXFDLENBQUMsR0FBRyxDQUFDO0lBQ3ZKLGtDQUFrQyxFQUFFLENBQUMsR0FBdUQsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsa0NBQWtDLENBQUMsR0FBRyxDQUFDO0lBQzlJLHVDQUF1QyxFQUFFLENBQUMsR0FBNEQsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsdUNBQXVDLENBQUMsR0FBRyxDQUFDO0NBQzlKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBpc3RhbmJ1bCBpZ25vcmUgZmlsZSAqL1xuaW1wb3J0IHsgWDUwOUNlcnRpZmljYXRlIH0gZnJvbSAnbm9kZTpjcnlwdG8nO1xuaW1wb3J0ICogYXMgdGxzIGZyb20gJ3Rscyc7XG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIHNkayBmcm9tICdAYXdzLXNkay9jbGllbnQtaWFtJztcblxubGV0IGNsaWVudDogc2RrLklBTTtcbmZ1bmN0aW9uIGlhbSgpOiBzZGsuSUFNIHtcbiAgaWYgKCFjbGllbnQpIHsgY2xpZW50ID0gbmV3IHNkay5JQU0oe30pOyB9XG4gIHJldHVybiBjbGllbnQ7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRMb2dnZXIoZm10OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUubG9nKGZtdCwgLi4uYXJncyk7XG59XG5cbi8qKlxuICogRG93bmxvYWRzIHRoZSBDQSB0aHVtYnByaW50IGZyb20gdGhlIGlzc3VlciBVUkxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZG93bmxvYWRUaHVtYnByaW50KGlzc3VlclVybDogc3RyaW5nKSB7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKG9rLCBrbykgPT4ge1xuICAgIGNvbnN0IHB1cmwgPSB1cmwucGFyc2UoaXNzdWVyVXJsKTtcbiAgICBjb25zdCBwb3J0ID0gcHVybC5wb3J0ID8gcGFyc2VJbnQocHVybC5wb3J0LCAxMCkgOiA0NDM7XG5cbiAgICBpZiAoIXB1cmwuaG9zdCkge1xuICAgICAgcmV0dXJuIGtvKG5ldyBFcnJvcihgdW5hYmxlIHRvIGRldGVybWluZSBob3N0IGZyb20gaXNzdWVyIHVybCAke2lzc3VlclVybH1gKSk7XG4gICAgfVxuXG4gICAgZXh0ZXJuYWwubG9nKGBGZXRjaGluZyB4NTA5IGNlcnRpZmljYXRlIGNoYWluIGZyb20gaXNzdWVyICR7aXNzdWVyVXJsfWApO1xuXG4gICAgY29uc3Qgc29ja2V0ID0gdGxzLmNvbm5lY3QocG9ydCwgcHVybC5ob3N0LCB7IHJlamVjdFVuYXV0aG9yaXplZDogZmFsc2UsIHNlcnZlcm5hbWU6IHB1cmwuaG9zdCB9KTtcbiAgICBzb2NrZXQub25jZSgnZXJyb3InLCBrbyk7XG5cbiAgICBzb2NrZXQub25jZSgnc2VjdXJlQ29ubmVjdCcsICgpID0+IHtcbiAgICAgIGxldCBjZXJ0ID0gc29ja2V0LmdldFBlZXJYNTA5Q2VydGlmaWNhdGUoKTtcbiAgICAgIGlmICghY2VydCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZXRyaWV2ZSBYNTA5IGNlcnRpZmljYXRlIGZyb20gaG9zdCAke3B1cmwuaG9zdH1gKTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChjZXJ0Lmlzc3VlckNlcnRpZmljYXRlKSB7XG4gICAgICAgIHByaW50Q2VydGlmaWNhdGUoY2VydCk7XG4gICAgICAgIGNlcnQgPSBjZXJ0Lmlzc3VlckNlcnRpZmljYXRlO1xuICAgICAgfVxuICAgICAgY29uc3QgdmFsaWRUbyA9IG5ldyBEYXRlKGNlcnQudmFsaWRUbyk7XG4gICAgICBjb25zdCBjZXJ0aWZpY2F0ZVZhbGlkaXR5ID0gZ2V0Q2VydGlmaWNhdGVWYWxpZGl0eSh2YWxpZFRvKTtcblxuICAgICAgaWYgKGNlcnRpZmljYXRlVmFsaWRpdHkgPCAwKSB7XG4gICAgICAgIHJldHVybiBrbyhuZXcgRXJyb3IoYFRoZSBjZXJ0aWZpY2F0ZSBoYXMgYWxyZWFkeSBleHBpcmVkIG9uOiAke3ZhbGlkVG8udG9VVENTdHJpbmcoKX1gKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFdhcm5pbmcgdXNlciBpZiBjZXJ0aWZpY2F0ZSB2YWxpZGl0eSBpcyBleHBpcmluZyB3aXRoaW4gNiBtb250aHNcbiAgICAgIGlmIChjZXJ0aWZpY2F0ZVZhbGlkaXR5IDwgMTgwKSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlICovXG4gICAgICAgIGNvbnNvbGUud2FybihgVGhlIHJvb3QgY2VydGlmaWNhdGUgb2J0YWluZWQgd291bGQgZXhwaXJlIGluICR7Y2VydGlmaWNhdGVWYWxpZGl0eX0gZGF5cyFgKTtcbiAgICAgIH1cblxuICAgICAgc29ja2V0LmVuZCgpO1xuXG4gICAgICBjb25zdCB0aHVtYnByaW50ID0gZXh0cmFjdFRodW1icHJpbnQoY2VydCk7XG4gICAgICBleHRlcm5hbC5sb2coYENlcnRpZmljYXRlIEF1dGhvcml0eSB0aHVtYnByaW50IGZvciAke2lzc3VlclVybH0gaXMgJHt0aHVtYnByaW50fWApO1xuXG4gICAgICBvayh0aHVtYnByaW50KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RUaHVtYnByaW50KGNlcnQ6IFg1MDlDZXJ0aWZpY2F0ZSkge1xuICByZXR1cm4gY2VydC5maW5nZXJwcmludC5zcGxpdCgnOicpLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBwcmludENlcnRpZmljYXRlKGNlcnQ6IFg1MDlDZXJ0aWZpY2F0ZSkge1xuICBleHRlcm5hbC5sb2coJy0tLS0tLS0tLS0tLS1CRUdJTiBDRVJULS0tLS0tLS0tLS0tLS0tLScpO1xuICBleHRlcm5hbC5sb2coYFRodW1icHJpbnQ6ICR7ZXh0cmFjdFRodW1icHJpbnQoY2VydCl9YCk7XG4gIGV4dGVybmFsLmxvZyhgVmFsaWQgVG86ICR7Y2VydC52YWxpZFRvfWApO1xuICBpZiAoY2VydC5pc3N1ZXJDZXJ0aWZpY2F0ZSkge1xuICAgIGV4dGVybmFsLmxvZyhgSXNzdWVyIFRodW1icHJpbnQ6ICR7ZXh0cmFjdFRodW1icHJpbnQoY2VydC5pc3N1ZXJDZXJ0aWZpY2F0ZSl9YCk7XG4gIH1cbiAgZXh0ZXJuYWwubG9nKGBJc3N1ZXI6ICR7Y2VydC5pc3N1ZXJ9YCk7XG4gIGV4dGVybmFsLmxvZyhgU3ViamVjdDogJHtjZXJ0LnN1YmplY3R9YCk7XG4gIGV4dGVybmFsLmxvZygnLS0tLS0tLS0tLS0tLUVORCBDRVJULS0tLS0tLS0tLS0tLS0tLS0tJyk7XG59XG5cbi8qKlxuICogVG8gZ2V0IHRoZSB2YWxpZGl0eSB0aW1lbGluZSBmb3IgdGhlIGNlcnRpZmljYXRlXG4gKiBAcGFyYW0gY2VydERhdGUgVGhlIHZhbGlkIHRvIGRhdGUgZm9yIHRoZSBjZXJ0aWZpY2F0ZVxuICogQHJldHVybnMgVGhlIG51bWJlciBvZiBkYXlzIHRoZSBjZXJ0aWZpY2F0ZSBpcyB2YWxpZCB3cnQgY3VycmVudCBkYXRlXG4gKi9cbmZ1bmN0aW9uIGdldENlcnRpZmljYXRlVmFsaWRpdHkoY2VydERhdGU6IERhdGUpOiBudW1iZXIge1xuICBjb25zdCBtaWxsaXNlY29uZHNJbkRheSA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcblxuICBjb25zdCB2YWxpZGl0eSA9IE1hdGgucm91bmQoKGNlcnREYXRlLmdldFRpbWUoKSAtIGN1cnJlbnREYXRlLmdldFRpbWUoKSkgLyBtaWxsaXNlY29uZHNJbkRheSk7XG5cbiAgcmV0dXJuIHZhbGlkaXR5O1xufVxuXG4vLyBhbGxvd3MgdW5pdCB0ZXN0IHRvIHJlcGxhY2Ugd2l0aCBtb2Nrc1xuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuZXhwb3J0IGNvbnN0IGV4dGVybmFsID0ge1xuICBkb3dubG9hZFRodW1icHJpbnQsXG4gIGxvZzogZGVmYXVsdExvZ2dlcixcbiAgY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyOiAocmVxOiBzZGsuQ3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyQ29tbWFuZElucHV0KSA9PiBpYW0oKS5jcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKSxcbiAgZGVsZXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyOiAocmVxOiBzZGsuRGVsZXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyQ29tbWFuZElucHV0KSA9PiBpYW0oKS5kZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKSxcbiAgdXBkYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyVGh1bWJwcmludDogKHJlcTogc2RrLlVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnRDb21tYW5kSW5wdXQpID0+IGlhbSgpLnVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQocmVxKSxcbiAgYWRkQ2xpZW50SURUb09wZW5JRENvbm5lY3RQcm92aWRlcjogKHJlcTogc2RrLkFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXJDb21tYW5kSW5wdXQpID0+IGlhbSgpLmFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKSxcbiAgcmVtb3ZlQ2xpZW50SURGcm9tT3BlbklEQ29ubmVjdFByb3ZpZGVyOiAocmVxOiBzZGsuUmVtb3ZlQ2xpZW50SURGcm9tT3BlbklEQ29ubmVjdFByb3ZpZGVyQ29tbWFuZElucHV0KSA9PiBpYW0oKS5yZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXIocmVxKSxcbn07XG4iXX0=