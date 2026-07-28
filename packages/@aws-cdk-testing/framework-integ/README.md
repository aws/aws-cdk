# AWS CDK Framework Integration Test Suite

Run the full test suite with `yarn integ`.

See `integ-runner` package or `yarn integ --help` for detailed instructions.

## Common Errors

### Error: For this test you must provide your own HostedZoneId/HostedZoneName/DomainName/Certificate

Some test cases require a publicly available domain name attached to a Amazon Route 53 Hosted Zone to work.
These test cases need to add DNS records that are then retrieved via the public internet infrastructure. This can be a subdomain to an existing domain, but it must have a Hosted Zone configured and nameservers delegated to it.

If you haven't got one ready, see the [Route 53 guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html) to manually create a hosted zone.

Some test cases require an ACM public certificate on a publicly available domain name to work.
These test cases need a public certificate which uses DNS for domain ownership validation.

See the [AWS Certificate Manager guide](https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html) to request an Amazon-Issued certificate.

AWS CDK core team members, please check our team internal docs for guidance on how to configure domains for testing.

#### How to correctly run these tests

**A) Each test needs exclusive access to the Hosted Zone.**\
You can only run one test at a time.

**B) Must be run with `--disable-update-workflow`**\
The checked-in snapshot uses dummy values that will not deploy.

- Go to your Hosted Zone and write down the values for `HostedZoneId`, `HostedZoneName` and `DomainName`.
   All values must related to the **same** Hosted Zone.
- Go to your AWS Certificate Manager and write down the ARN for the `Certificate`
   The certificate should be attached to a domain name in the **same** Hosted Zone.
- In your terminal run the following commands:

```console
export HOSTED_ZONE_ID=your_hosted_zone_id
export HOSTED_ZONE_NAME=your_hosted_zone_name
export DOMAIN_NAME=your_domain_name
export CERT_ARN=your_certificate_arn
```

- Finally, in the same terminal run your specific test case with the **update workflow disabled**. For example:

```console
yarn integ --disable-update-workflow aws-certificatemanager/test/integ.certificate-name
```

### Error: Docker pull from `public.ecr.aws` results in "403 Forbidden"

When running CDK integration tests locally, you may encounter a **"403 Forbidden"** error while trying to pull Docker images from `public.ecr.aws`.

This happens because Docker requires proper authentication to access ECR repositories, even public ones.  
You can fix it by authenticating with AWS ECR Public before running your tests:

```sh
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

Refer to the [Amazon ECR public registry authentication documentation](https://docs.aws.amazon.com/AmazonECR/latest/public/public-registry-auth.html) for additional details.
