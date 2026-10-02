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
const fs = __importStar(require("fs"));
const client_acm_1 = require("@aws-sdk/client-acm");
const acm = new client_acm_1.ACM();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * Deletes the certificate, tolerating the two race conditions of a stack teardown:
 * - `ResourceInUseException`: the domain name still references the cert; retry until
 *   API Gateway has finished releasing it.
 * - `ResourceNotFoundException`: already deleted; treat as success (idempotent).
 */
async function deleteCertificate(arn) {
    for (let attempt = 0; attempt < 10; attempt++) {
        try {
            await acm.deleteCertificate({ CertificateArn: arn });
            return;
        }
        catch (e) {
            if (e?.name === 'ResourceNotFoundException')
                return;
            if (e?.name === 'ResourceInUseException') {
                await sleep(15_000);
                continue;
            }
            throw e;
        }
    }
    // Final attempt; let a persistent error surface.
    await acm.deleteCertificate({ CertificateArn: arn });
}
async function handler(event) {
    switch (event.RequestType) {
        case 'Create': {
            const imported = await acm.importCertificate({
                Certificate: fs.readFileSync('./cert.pem'),
                PrivateKey: fs.readFileSync('./key.pem'),
            });
            return {
                PhysicalResourceId: imported.CertificateArn,
                Data: { CertificateArn: imported.CertificateArn },
            };
        }
        case 'Update':
            return { PhysicalResourceId: event.PhysicalResourceId };
        case 'Delete':
            if (event.PhysicalResourceId?.startsWith('arn:')) {
                await deleteCertificate(event.PhysicalResourceId);
            }
            return;
    }
}
