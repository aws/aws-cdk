import { TLSSocket, DetailedPeerCertificate, Certificate } from 'tls';
import { downloadThumbprint } from '../../lib/oidc-provider/external';

const chainLength = 3;
let certificateCount = 0;
let placeholderCertificate: DetailedPeerCertificate;
let peerCertificate: DetailedPeerCertificate;

describe('downloadThumbprint', () => {

  const peerCertificateMock = jest.spyOn(TLSSocket.prototype, 'getPeerCertificate').mockImplementation(()=> {
    return peerCertificate;
  });

  beforeEach(() => {
    certificateCount = 0;
    peerCertificate = createChainedCertificateObject();

    // This is to create a circular reference in the root certificate
    getRootCertificateFromChain().issuerCertificate = peerCertificate;

    // To have silent test runs for this test
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test('is able to get root certificate from certificate chain', async () => {
    // WHEN
    await downloadThumbprint('https://example.com');

    // THEN
    expect(peerCertificateMock).toHaveBeenCalledTimes(2);
  });

  test('throws when subject and issuer are different of expected root certificate', async () => {
    // GIVEN
    const subject: Certificate = {
      C: 'another-country-code-root',
      ST: 'another-street-root',
      L: 'another-locality-root',
      O: 'another-organization-root',
      OU: 'another-organizational-unit-root',
      CN: 'another-common-name-root',
    };

    getRootCertificateFromChain().subject = subject;

    // THEN
    await expect(() => downloadThumbprint('https://example.com')).rejects.toThrowError(/Subject and Issuer of certificate received are different/);

    expect(peerCertificateMock).toHaveBeenCalledTimes(2);
  });

  test('throws error when certificate receieved is expired', async () => {
    // GIVEN
    const currentDate = new Date();
    const expiredValidityDate = subtractDaysFromDate(currentDate, 5);

    getRootCertificateFromChain().valid_to = expiredValidityDate.toUTCString();

    // THEN
    await expect(() => downloadThumbprint('https://example.com')).rejects.toThrowError(/The certificate has already expired on/);

    expect(peerCertificateMock).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    peerCertificateMock.mockClear();
  });
});

function createChainedCertificateObject(): DetailedPeerCertificate {
  return createCertificateObject();
}

function createCertificateObject(): DetailedPeerCertificate {
  const currentDate = new Date();

  if (certificateCount == chainLength ) {
    // Root Certificate with circular reference to first certificate
    return {
      subject: {
        C: 'country-code-root',
        ST: 'street-root',
        L: 'locality-root',
        O: 'organization-root',
        OU: 'organizational-unit-root',
        CN: 'common-name-root',
      },
      issuer: {
        C: 'country-code-root',
        ST: 'street-root',
        L: 'locality-root',
        O: 'organization-root',
        OU: 'organizational-unit-root',
        CN: 'common-name-root',
      },
      subjectaltname: 'subjectal-name-root',
      infoAccess: {
        key: ['value-root'],
      },
      modulus: 'modulus-root',
      exponent: 'exponent-root',
      valid_from: currentDate.toUTCString(),
      valid_to: addDaysToDate(currentDate, 200).toUTCString(),
      fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:00',
      fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:00',
      ext_key_usage: ['key-usage-root'],
      serialNumber: 'serial-number-root',
      raw: Buffer.alloc(10),
      issuerCertificate: placeholderCertificate,
    };
  }

  certificateCount++;

  const certificate = {
    subject: {
      C: `subject-country-code-${certificateCount}`,
      ST: `subject-street-${certificateCount}`,
      L: `subject-locality-${certificateCount}`,
      O: `subject-organization-${certificateCount}`,
      OU: `subject-organizational-unit-${certificateCount}`,
      CN: `subject-common-name-${certificateCount}`,
    },
    issuer: {
      C: `issuer-country-code-${certificateCount}`,
      ST: `issuer-street-${certificateCount}`,
      L: `issuer-locality-${certificateCount}`,
      O: `issuer-organization-${certificateCount}`,
      OU: `issuer-organizational-unit-${certificateCount}`,
      CN: `issuer-common-name-${certificateCount}`,
    },
    subjectaltname: `subjectal-name-${certificateCount}`,
    infoAccess: {
      key: [`value-${certificateCount}`],
    },
    modulus: `modulus-${certificateCount}`,
    exponent: `exponent-${certificateCount}`,
    valid_from: currentDate.toUTCString(),
    valid_to: addDaysToDate(currentDate, 200).toUTCString(),
    fingerprint: `01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:${certificateCount}D`,
    fingerprint256: `69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:0${certificateCount}`,
    ext_key_usage: [`key-usage-${certificateCount}`],
    serialNumber: `serial-number-${certificateCount}`,
    raw: Buffer.alloc(10),
    issuerCertificate: createCertificateObject(),
  };

  return certificate;
}

function addDaysToDate(date: Date, numberOfDays: number): Date {
  const newDate = new Date();
  return new Date(newDate.setDate(date.getDate() + numberOfDays));
}

function subtractDaysFromDate(date: Date, numberOfDays: number): Date {
  const newDate = new Date();
  return new Date(newDate.setDate(date.getDate() - numberOfDays));
}

function getRootCertificateFromChain(): DetailedPeerCertificate {
  let rootCert: DetailedPeerCertificate = peerCertificate;
  let certificateNumber = 0;

  while (chainLength > certificateNumber++) {
    rootCert = rootCert.issuerCertificate;
  }

  return rootCert;
}
