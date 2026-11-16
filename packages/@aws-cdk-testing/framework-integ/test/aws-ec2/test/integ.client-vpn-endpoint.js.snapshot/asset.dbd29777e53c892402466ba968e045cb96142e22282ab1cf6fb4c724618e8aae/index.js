"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const fs = require("fs");
const client_acm_1 = require("@aws-sdk/client-acm");
const acm = new client_acm_1.ACM();
async function handler(event) {
    switch (event.RequestType) {
        case 'Create':
            let serverImport;
            if (!event.ResourceProperties.ServerCertificateArn) {
                serverImport = await acm.importCertificate({
                    Certificate: fs.readFileSync('./server.crt'),
                    PrivateKey: fs.readFileSync('./server.key'),
                    CertificateChain: fs.readFileSync('./ca.crt'),
                });
            }
            let clientImport;
            if (!event.ResourceProperties.ClientCertificateArn) {
                clientImport = await acm.importCertificate({
                    Certificate: fs.readFileSync('./client1.domain.tld.crt'),
                    PrivateKey: fs.readFileSync('./client1.domain.tld.key'),
                    CertificateChain: fs.readFileSync('./ca.crt'),
                });
            }
            return {
                Data: {
                    ServerCertificateArn: serverImport?.CertificateArn,
                    ClientCertificateArn: clientImport?.CertificateArn,
                },
            };
        case 'Update':
            return;
        case 'Delete':
            if (event.ResourceProperties.ServerCertificateArn) {
                await acm.deleteCertificate({
                    CertificateArn: event.ResourceProperties.ServerCertificateArn,
                });
            }
            if (event.ResourceProperties.ClientCertificateArn) {
                await acm.deleteCertificate({
                    CertificateArn: event.ResourceProperties.ClientCertificateArn,
                });
            }
            return;
    }
}
