# Manual verification

Following https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html

After starting the cluster and installing `kubectl` and `aws-iam-authenticator`:

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: <ROLE ARN>
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
```

```
aws eks update-kubeconfig --name {{ClusterName}}

# File above, with substitutions
kubectl apply -f aws-auth-cm.yaml

# Check that nodes joined (may take a while)
kubectl get nodes

# Start services (will autocreate a load balancer)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-master-controller.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-master-service.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-slave-controller.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/redis-slave-service.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/guestbook-controller.json
kubectl apply -f https://raw.githubusercontent.com/kubernetes/examples/master/guestbook-go/guestbook-service.json

# Check up on service status
kubectl get services -o wide
```

Visit the website that appears under LoadBalancer on port 3000. The Amazon corporate network will block this
port, in which case you add this:

```
ssh -L 3000:<ELB ADDRESS>:3000 ssh-box-somewhere.example.com

# Visit http://localhost:3000/
```

Clean the services before you stop the cluster to get rid of the load balancer
(otherwise you won't be able to delete the stack):

```
kubectl delete --all services

```
