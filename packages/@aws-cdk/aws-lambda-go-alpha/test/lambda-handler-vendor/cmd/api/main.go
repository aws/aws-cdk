package main

// Intentionally empty. There were issues with 'gopkg.in', so:
// - we cannot depend on 'github.com/aws/aws-lambda-go'
//    - since: it has a dependency on 'gopkg.in/yaml.v3'
// - therefore: we cannot type the handler properly here
//
// It doesn't matter that this isn't an actual Lambda handler, we
// just need the test build to succeed.

func main() {
}
