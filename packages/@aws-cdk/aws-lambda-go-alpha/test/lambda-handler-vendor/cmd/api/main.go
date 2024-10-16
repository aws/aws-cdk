package main

import (
  "bytes"
  "log"
  "math"
  "net/http"
  "strconv"
  "os"
)

func main() {
  endpoint := "http://" + os.Getenv("AWS_LAMBDA_RUNTIME_API") + "/2018-06-01/runtime/invocation"

  // Get requestId
  headersResponse, err := http.Get(endpoint + "/next")
  if err != nil {
    log.Printf("failed to retrieve lambda requestId with error: %v", err)
    return
  }

  requestId := headersResponse.Header.Get("Lambda-Runtime-Aws-Request-Id")
  log.Printf("handling lambda request id: %s", requestId)

  // Post response
  body := []byte(strconv.FormatFloat(math.Pow(2, 8), 'f', 0, 64))
  _, err = http.NewRequest("POST", endpoint + "/" + requestId + "/response", bytes.NewBuffer(body))

  if err != nil {
    log.Printf("failed to post response with error: %v", err)
    return
  }
}
