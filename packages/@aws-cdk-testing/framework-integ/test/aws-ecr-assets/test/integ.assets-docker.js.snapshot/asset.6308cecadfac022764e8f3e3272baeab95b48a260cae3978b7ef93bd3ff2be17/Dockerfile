FROM public.ecr.aws/lambda/python:3.6
RUN yum makecache fast
RUN yum install -y openssh-clients
RUN ssh-keygen -t rsa -b 2048 -f /root/.ssh/id_rsa -q -N ""
RUN ssh-keygen -y -f /root/.ssh/id_rsa > /root/.ssh/id_rsa.pub
WORKDIR /app
CMD python3 index.py