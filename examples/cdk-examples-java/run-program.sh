#!/bin/bash
cd project
exec mvn -q exec:java \
  -Dexec.mainClass=com.amazonaws.cdk.examples.HelloJavaApp \
  -Dexec.args="app $@"

