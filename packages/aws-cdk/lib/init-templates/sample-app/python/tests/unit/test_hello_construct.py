import unittest

from aws_cdk import core

from hello.hello_construct import HelloConstruct

class TestHelloConstruct(unittest.TestCase):

    def setUp(self):
        self.app = core.App()
        self.stack = core.Stack(self.app, "TestStack")
    
    def test_num_buckets(self):
        num_buckets = 10
        hello = HelloConstruct(self.stack, "Test1", num_buckets)
        assert len(hello.buckets) == num_buckets