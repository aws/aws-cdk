package main

import (
    "fmt"
    "os/exec"
    "github.com/aws/aws-lambda-go/lambda"
)

func HandleRequest() error {
    cmd := exec.Command("/opt/awscli/aws", "--version")
    stdout, err := cmd.Output()

    if err != nil {
        fmt.Println(err.Error())
        return err
    }

    fmt.Println(string(stdout))
    return nil
}

func main() {
    lambda.Start(HandleRequest)
}
