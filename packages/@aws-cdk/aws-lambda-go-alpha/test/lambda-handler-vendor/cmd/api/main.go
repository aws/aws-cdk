package main

import (
  "bytes"
  "log"
  "io"
  "math"
  "net/http"
  "strconv"
  "os"
)

func main() {
  endpoint := "http://" + os.Getenv("AWS_LAMBDA_RUNTIME_API") + "/2018-06-01/runtime/invocation/"

  for {
    // Get requestId
    headersResponse, err := http.Get(endpoint + "next")
    if err != nil {
      log.Printf("failed to retrieve lambda requestId with error: %v", err)
      return
    }

    defer headersResponse.Body.Close()

    requestId := headersResponse.Header.Get("Lambda-Runtime-Aws-Request-Id")
    log.Printf("handling lambda request id: %s", requestId)

    // Post response
    body := []byte(strconv.FormatFloat(math.Pow(2, 8), 'f', 0, 64))
    log.Printf("sending response: %s", string(body))

    reportResponse, err := http.Post(endpoint + requestId + "/response", "text/plain", bytes.NewBuffer(body))
    bodyBytes, err := io.ReadAll(reportResponse.Body)
    log.Printf("Got reportResponse body: %s", string(bodyBytes))
    if err != nil {
      log.Printf("failed to post response with error: %v", err)
      return
    }
    defer reportResponse.Body.Close()
  }
}
