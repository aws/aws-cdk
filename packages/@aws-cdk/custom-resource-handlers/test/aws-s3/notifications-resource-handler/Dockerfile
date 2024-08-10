# Should match the actual Lambda runtime version in https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-s3/lib/notifications-resource/notifications-resource-handler.ts
FROM public.ecr.aws/lambda/python:3.11

ADD . /opt/lambda
WORKDIR /opt/lambda

RUN pip3 install boto3==1.17.42
RUN python3 test_index.py

ENTRYPOINT [ "/bin/bash" ]