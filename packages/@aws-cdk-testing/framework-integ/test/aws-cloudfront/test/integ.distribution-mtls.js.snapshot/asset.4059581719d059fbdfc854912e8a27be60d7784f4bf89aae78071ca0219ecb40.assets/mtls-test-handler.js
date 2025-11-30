"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
/* eslint-disable import/no-extraneous-dependencies */
const https = require("https");
const client_s3_1 = require("@aws-sdk/client-s3");
class CertificateRetrievalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CertificateRetrievalError';
    }
}
async function handler(event) {
    let cert;
    let key;
    if (event.useCert) {
        const s3 = new client_s3_1.S3Client({});
        // Get client certificate from S3
        const certObj = await s3.send(new client_s3_1.GetObjectCommand({
            Bucket: event.certBucket,
            Key: 'client-cert.pem',
        }));
        const keyObj = await s3.send(new client_s3_1.GetObjectCommand({
            Bucket: event.certBucket,
            Key: 'client-key.pem',
        }));
        cert = await certObj.Body?.transformToString();
        key = await keyObj.Body?.transformToString();
        if (!cert || !key) {
            throw new CertificateRetrievalError('Failed to retrieve client certificate or key from S3');
        }
    }
    return new Promise((resolve, reject) => {
        const options = {
            hostname: event.distributionDomainName,
            port: 443,
            path: '/index.html',
            method: 'GET',
            rejectUnauthorized: false, // Allow CloudFront's default certificate
        };
        // Add client certificate if useCert is true
        if (event.useCert && cert && key) {
            options.cert = cert;
            options.key = key;
        }
        const req = https.request(options, (res) => {
            resolve({
                statusCode: res.statusCode ?? 0,
                statusMessage: res.statusMessage ?? '',
            });
        });
        req.on('error', (err) => {
            reject(err);
        });
        req.end();
    });
}
