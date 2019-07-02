from aws_cdk import (
    aws_iam as iam,
    aws_s3 as s3,
    core,
)


class HelloConstruct(core.Construct):

    @property
    def buckets(self):
        return tuple(self._buckets)

    def __init__(self, scope: core.Construct, id: str, num_buckets: int) -> None:
        super().__init__(scope, id)
        self._buckets = []
        for i in range(0, num_buckets):
            self._buckets.append(s3.Bucket(self, f"Bucket-{i}"))
    
    def grant_read(self, principal: iam.IPrincipal):
        for b in self.buckets:
            b.grant_read(principal, "*")
