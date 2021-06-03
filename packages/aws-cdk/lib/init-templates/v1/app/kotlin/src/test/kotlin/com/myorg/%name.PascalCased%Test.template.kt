package com.myorg

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import software.amazon.awscdk.core.App

class %name.PascalCased%Test {
    private val mapper = ObjectMapper().configure(SerializationFeature.INDENT_OUTPUT, true)

    @Test
    fun testStack() {
        val app = App()
        val stack = %name.PascalCased%Stack(app, "test")

        // synthesize the stack to a CloudFormation template
        val actual = mapper.valueToTree<JsonNode>(app.synth().getStackArtifact(stack.artifactId).template)

        // Update once resources have been added to the stack
        Assertions.assertThat(actual["Resources"]).isNull()
    }
}
