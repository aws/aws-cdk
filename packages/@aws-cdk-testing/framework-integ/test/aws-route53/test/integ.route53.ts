import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Alpn, ARecord, CaaAmazonRecord, CnameRecord, Continent, GeoLocation, HttpsRecord, HttpsRecordValue, PrivateHostedZone, PublicHostedZone, RecordTarget, SvcbRecord, SvcbRecordValue, TxtRecord } from 'aws-cdk-lib/aws-route53';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1, restrictDefaultSecurityGroup: false });

const privateZone = new PrivateHostedZone(stack, 'PrivateZone', {
  zoneName: 'cdk.local', vpc,
});

const publicZone = new PublicHostedZone(stack, 'PublicZone', {
  zoneName: 'cdk.test',
});
const publicSubZone = new PublicHostedZone(stack, 'PublicSubZone', {
  zoneName: 'sub.cdk.test',
});
publicZone.addDelegation(publicSubZone);

new PublicHostedZone(stack, 'PublicZoneWithDot', {
  zoneName: 'cdk.test',
  addTrailingDot: false,
});

new TxtRecord(privateZone, 'TXT', {
  zone: privateZone,
  recordName: '_foo',
  values: [
    'Bar!',
    'Baz?',
  ],
  ttl: cdk.Duration.minutes(1),
});

new CnameRecord(stack, 'CNAME', {
  zone: privateZone,
  recordName: 'www',
  domainName: 'server',
});

new ARecord(stack, 'A', {
  zone: privateZone,
  recordName: 'test',
  target: RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8'),
});

new ARecord(stack, 'GeoLocationContinent', {
  zone: privateZone,
  recordName: 'geolocation',
  target: RecordTarget.fromIpAddresses('1.2.3.0', '5.6.7.0'),
  geoLocation: GeoLocation.continent(Continent.EUROPE),
});

new ARecord(stack, 'GeoLocationCountry', {
  zone: privateZone,
  recordName: 'geolocation',
  target: RecordTarget.fromIpAddresses('1.2.3.1', '5.6.7.1'),
  geoLocation: GeoLocation.country('DE'),
});

new ARecord(stack, 'GeoLocationSubDividion', {
  zone: privateZone,
  recordName: 'geolocation',
  target: RecordTarget.fromIpAddresses('1.2.3.2', '5.6.7.2'),
  geoLocation: GeoLocation.subdivision('WA'),
});

new ARecord(stack, 'GeoLocationSubDividionUA', {
  zone: privateZone,
  target: RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.4'),
  geoLocation: GeoLocation.subdivision('30', 'UA'), // Ukraine, Kyiv
});

new ARecord(stack, 'GeoLocationDefault', {
  zone: privateZone,
  recordName: 'geolocation',
  target: RecordTarget.fromIpAddresses('1.2.3.3', '5.6.7.3'),
  geoLocation: GeoLocation.default(),
});

new CaaAmazonRecord(stack, 'CaaAmazon', {
  zone: publicZone,
});

new TxtRecord(stack, 'TXT', {
  zone: publicZone,
  values: [
    'this is a very long string'.repeat(10),
  ],
});

new SvcbRecord(stack, 'SVCB-AliasMode', {
  zone: publicZone,
  recordName: '_8080._svcb-alias',
  values: [SvcbRecordValue.alias('service.example.com')],
});
new SvcbRecord(stack, 'SVCB-ServiceMode', {
  zone: publicZone,
  recordName: '_8080._svcb-service',
  values: [SvcbRecordValue.service({ alpn: [Alpn.H3, Alpn.H2] })],
});
new SvcbRecord(stack, 'SVCB-ServiceMode-FullParams', {
  zone: publicZone,
  recordName: '_8080._svcb-service-fullparams',
  values: [SvcbRecordValue.service({
    priority: 2,
    targetName: 'service.example.com',
    mandatory: ['alpn'],
    alpn: [Alpn.H3, Alpn.H2, Alpn.HTTP1_1, Alpn.of('h3-29')],
    noDefaultAlpn: true,
    port: 8443,
    ipv4hint: ['127.0.0.1'],
    ipv6hint: ['::1'],
  })],
});

new HttpsRecord(stack, 'HTTPS-AliasMode', {
  zone: publicZone,
  recordName: 'https-alias',
  values: [HttpsRecordValue.alias('service.example.com')],
});
new HttpsRecord(stack, 'HTTPS-ServiceMode', {
  zone: publicZone,
  recordName: 'https-service',
  values: [HttpsRecordValue.service({ alpn: [Alpn.H3, Alpn.H2] })],
});
new HttpsRecord(stack, 'HTTPS-ServiceMode-FullParams', {
  zone: publicZone,
  recordName: 'https-service-fullparams',
  values: [HttpsRecordValue.service({
    priority: 2,
    targetName: 'service.example.com',
    mandatory: ['alpn'],
    alpn: [Alpn.H3, Alpn.H2, Alpn.HTTP1_1, Alpn.of('h3-29')],
    noDefaultAlpn: true,
    port: 8443,
    ipv4hint: ['127.0.0.1'],
    ipv6hint: ['::1'],
  })],
});

new cdk.CfnOutput(stack, 'PrivateZoneId', { value: privateZone.hostedZoneId });
new cdk.CfnOutput(stack, 'PublicZoneId', { value: publicZone.hostedZoneId });

app.synth();
