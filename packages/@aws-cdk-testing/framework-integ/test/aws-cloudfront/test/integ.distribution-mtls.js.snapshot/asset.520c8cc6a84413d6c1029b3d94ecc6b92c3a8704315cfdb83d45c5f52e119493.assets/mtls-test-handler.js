"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const https = __importStar(require("https"));
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
                denied: res.statusCode === 403,
            });
        });
        req.on('error', (err) => {
            // Without a client certificate, CloudFront can reject the TLS handshake
            // instead of returning an HTTP response. That is also a valid denial.
            if (!event.useCert) {
                resolve({
                    statusCode: 0,
                    statusMessage: err.message,
                    denied: true,
                });
                return;
            }
            reject(err);
        });
        req.end();
    });
}
