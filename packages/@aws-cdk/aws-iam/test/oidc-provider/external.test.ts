// jest.mock('tls', () => {
//   return {
//     TLSSocket: {
//       getPeerCertificate: mockPeerCertificate,
//     },
//   };
// });

let certificateCount = 0;
const certificates = new Array();
const peerCertificate = createChainedCertificateObject();
const mockPeerCertificate = jest.fn().mockReturnValue(peerCertificate);

const mockTLSSocket = {
  getPeerCertificate: mockPeerCertificate,
};

// const tlsMock = jest.createMockFromModule('tls');

jest.mock('tls', () => {
  return {
    ...jest.requireActual('tls'),
    TLSSocket: jest.fn(() => mockTLSSocket),
  };
});

import { DetailedPeerCertificate } from 'tls';
import { downloadThumbprint } from '../../lib/oidc-provider/external';

describe('downloadThumbprint', () => {
  test('is able to get root certificate from certificate chain', async () => {
    //GIVEN
    // tlsMock.connect = jest.fn();

    // WHEN
    await downloadThumbprint('https://example.com');
  });

  test('throws when unable to obtain root certificate from certificate chain', () => {

  });

  test('throws error when certificate receieved is expired', () => {

  });

  test('shows warning when certificate obtained is going to expire within 6 months', () => {

  });
});

function createChainedCertificateObject(): DetailedPeerCertificate {
  return createCertificateObject();
}

function createCertificateObject(): DetailedPeerCertificate {
  const currentDate = new Date();

  if (certificateCount > 3 ) {
    // Root Certificate with circular reference to first certificate
    return {
      subject: {
        C: `country-code-${certificateCount}`,
        ST: `street-${certificateCount}`,
        L: `locality-${certificateCount}`,
        O: `organization-${certificateCount}`,
        OU: `organizational-unit-${certificateCount}`,
        CN: `common-name-${certificateCount}`,
      },
      issuer: {
        C: `country-code-${certificateCount}`,
        ST: `street-${certificateCount}`,
        L: `locality-${certificateCount}`,
        O: `organization-${certificateCount}`,
        OU: `organizational-unit-${certificateCount}`,
        CN: `common-name-${certificateCount}`,
      },
      subjectaltname: `subjectal-name-${certificateCount}`,
      infoAccess: {
        key: [`value-${certificateCount}`],
      },
      modulus: `modulus-${certificateCount}`,
      exponent: `exponent-${certificateCount}`,
      valid_from: currentDate.toString(),
      valid_to: addDaysToDate(currentDate, 200).toString(),
      fingerprint: `01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:${certificateCount}D`,
      fingerprint256: `69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:0${certificateCount}`,
      ext_key_usage: [`key-usage-${certificateCount}`],
      serialNumber: `serial-number-${certificateCount}`,
      raw: Buffer.alloc(10),
      issuerCertificate: certificates[0],
    };
  }

  certificateCount++;

  const certificate = {
    subject: {
      C: `country-code-${certificateCount}`,
      ST: `street-${certificateCount}`,
      L: `locality-${certificateCount}`,
      O: `organization-${certificateCount}`,
      OU: `organizational-unit-${certificateCount}`,
      CN: `common-name-${certificateCount}`,
    },
    issuer: {
      C: `country-code-${certificateCount}`,
      ST: `street-${certificateCount}`,
      L: `locality-${certificateCount}`,
      O: `organization-${certificateCount}`,
      OU: `organizational-unit-${certificateCount}`,
      CN: `common-name-${certificateCount}`,
    },
    subjectaltname: `subjectal-name-${certificateCount}`,
    infoAccess: {
      key: [`value-${certificateCount}`],
    },
    modulus: `modulus-${certificateCount}`,
    exponent: `exponent-${certificateCount}`,
    valid_from: currentDate.toString(),
    valid_to: addDaysToDate(currentDate, 200).toString(),
    fingerprint: `01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:${certificateCount}D`,
    fingerprint256: `69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:0${certificateCount}`,
    ext_key_usage: [`key-usage-${certificateCount}`],
    serialNumber: `serial-number-${certificateCount}`,
    raw: Buffer.alloc(10),
    issuerCertificate: createCertificateObject(),
  };

  certificates.push(certificate);

  return certificate;
}

function addDaysToDate(date: Date, numberOfDays: number) {
  const newDate = new Date();
  return newDate.setDate(date.getDate() + numberOfDays);
}
