import argparse
import json
import os
import random
import resource
import string
import tempfile
import time
import unittest

import index

# set TEST_AWSCLI_PATH to point to the "aws" stub we have here
scriptdir = os.path.dirname(os.path.realpath(__file__))
os.environ["TEST_AWSCLI_PATH"] = os.path.join(scriptdir, "aws")

# Global variables to store file paths
TEST_DIR = None
SMALL_JSON_FILE = None
LARGE_JSON_FILE = None
COMPLEX_JSON_FILE = None
COMPLEX_JSON_FILE_WITH_MARKER = None
SMALL_TEXT_FILE = None
LARGE_TEXT_FILE = None

# Memory limits for tests
MEMORY_LIMIT_STANDARD = 32 * 1024  # 32MB
MEMORY_LIMIT_COMPLEX = 256 * 1024  # 256MB


def create_json_file(filename, size_kb):
    """Create a JSON file of specified size in KB"""
    with open(filename, "w") as f:
        f.write('{\n  "data": [\n')

        # Calculate how many lines we need to reach the target size
        line_template = '    "Line{}: This is test data with some content to make it realistic.{}",\n'
        line_size = len(line_template.format(0, ""))
        lines_needed = (size_kb * 1024) // line_size

        for i in range(lines_needed - 1):
            f.write(line_template.format(i, ""))

        # Last line without comma
        f.write(
            '    "Line{}: This is test data with some content to make it realistic.{}"\n'.format(lines_needed - 1, "")
        )
        f.write("  ]\n}")


def create_complex_json_file(filename, target_size_kb, include_marker=None):
    """Create a complex JSON file with nested structure of specified size in KB"""

    # Generate random string of specified length
    def random_string(length):
        return "".join(random.choice(string.ascii_letters) for _ in range(length))

    # Create a complex nested structure
    root_object = {}

    # Number of root keys
    num_root_keys = 100

    # Number of sub-keys per root key
    num_sub_keys = 20

    # Initial array size per sub-key
    initial_array_size = 5

    # Create the initial structure
    for i in range(num_root_keys):
        root_key = f"root_key_{i}"
        root_object[root_key] = {}

        for j in range(num_sub_keys):
            sub_key = f"sub_key_{j}"
            root_object[root_key][sub_key] = []

            for k in range(initial_array_size):
                value = ""
                if include_marker:
                    value = random.choice(include_marker)
                value = random_string(20 - len(value)) + value
                root_object[root_key][sub_key].append(
                    {"id": f"item_{k}", "value": value, "description": random_string(50)}
                )

    # Convert to JSON to check size
    json_data = json.dumps(root_object)
    current_size = len(json_data) / 1024  # Size in KB

    # Calculate how many more items we need to add to reach target size
    if current_size < target_size_kb:
        # Calculate approximately how many more items we need
        item_size = current_size / (num_root_keys * num_sub_keys * initial_array_size)
        total_items_needed = int((target_size_kb / item_size))
        items_per_array = total_items_needed // (num_root_keys * num_sub_keys)

        # Add more items to each array
        for i in range(num_root_keys):
            root_key = f"root_key_{i}"
            for j in range(num_sub_keys):
                sub_key = f"sub_key_{j}"
                for k in range(initial_array_size, items_per_array):
                    root_object[root_key][sub_key].append(
                        {
                            "id": f"item_{k}",
                            "value": random_string(20),
                            "description": random_string(50),
                            "metadata": {
                                "created": "2025-01-01",
                                "modified": "2025-01-02",
                                "tags": [random_string(10), random_string(10), random_string(10)],
                            },
                        }
                    )
            current_size = len(json.dumps(root_object)) / 1024
            if current_size >= target_size_kb:
                break

    # Write the final JSON to file
    with open(filename, "w") as f:
        json.dump(root_object, f, indent=2)


def create_text_file(filename, size_kb):
    """Create a text file of specified size in KB"""
    with open(filename, "w") as f:
        line_template = "Line{}: This is test data with some content to make it realistic.\n"
        line_size = len(line_template.format(0))
        lines_needed = (size_kb * 1024) // line_size

        for i in range(lines_needed):
            f.write(line_template.format(i))


def initialize_test_files():
    """Initialize all test files and return their paths"""
    # Create test directory
    TEST_DIR = tempfile.mkdtemp()

    # Define file paths
    SMALL_JSON_FILE = os.path.join(TEST_DIR, "small.json")
    LARGE_JSON_FILE = os.path.join(TEST_DIR, "large.json")
    COMPLEX_JSON_FILE = os.path.join(TEST_DIR, "complex.json")
    COMPLEX_JSON_FILE_WITH_MARKER = os.path.join(TEST_DIR, "complex_marker.json")
    SMALL_TEXT_FILE = os.path.join(TEST_DIR, "small.txt")
    LARGE_TEXT_FILE = os.path.join(TEST_DIR, "large.txt")

    # Create a small JSON file (1KB)
    create_json_file(SMALL_JSON_FILE, 1)
    small_size = os.path.getsize(SMALL_JSON_FILE) / 1024
    print(f"Small JSON file created: {small_size:.2f} KB")

    # Create a large JSON file (10MB)
    create_json_file(LARGE_JSON_FILE, 10 * 1024)
    large_size = os.path.getsize(LARGE_JSON_FILE) / 1024
    print(f"Large JSON file created: {large_size:.2f} KB")

    # Create a complex JSON file (10MB)
    create_complex_json_file(COMPLEX_JSON_FILE, 10 * 1024)
    complex_size = os.path.getsize(COMPLEX_JSON_FILE) / 1024
    print(f"Complex JSON file created: {complex_size:.2f} KB")

    # Create a complex JSON file with marker (10MB)
    create_complex_json_file(COMPLEX_JSON_FILE_WITH_MARKER, 10 * 1024, ["_marker1_", "<<marker:0xbaba:42>>", "_TOKEN_"])
    complex_size = os.path.getsize(COMPLEX_JSON_FILE_WITH_MARKER) / 1024
    print(f"Complex JSON file with marker created: {complex_size:.2f} KB")

    # Create a small text file (1KB)
    create_text_file(SMALL_TEXT_FILE, 1)
    small_text_size = os.path.getsize(SMALL_TEXT_FILE) / 1024
    print(f"Small text file created: {small_text_size:.2f} KB")

    # Create a large text file (10MB)
    create_text_file(LARGE_TEXT_FILE, 10 * 1024)
    large_text_size = os.path.getsize(LARGE_TEXT_FILE) / 1024
    print(f"Large text file created: {large_text_size:.2f} KB")

    # Return the test directory
    return TEST_DIR


def cleanup_test_files():
    """Clean up test files"""
    if TEST_DIR and os.path.exists(TEST_DIR):
        import shutil

        shutil.rmtree(TEST_DIR)


def measure_performance(func, *args, **kwargs):
    """Measure execution time and memory usage of a function"""
    # Get initial memory usage
    start_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    print(f"Memory before test: {start_memory} KB")
    start_time = time.time()

    # Execute the function
    result = func(*args, **kwargs)

    # Measure time and memory after execution
    end_time = time.time()

    end_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    print(f"Memory after test: {end_memory} KB")

    execution_time = end_time - start_time
    memory_used = end_memory - start_memory  # in KB

    return result, execution_time, memory_used


class TestLargeFiles(unittest.TestCase):
    def test_small_json_file_performance(self):
        """Test performance with a small JSON file"""
        file_size = os.path.getsize(SMALL_JSON_FILE) / 1024
        markers = {"_TOKEN_": "replacement"}
        _, execution_time, memory_used = measure_performance(index.replace_markers, SMALL_JSON_FILE, markers, True)

        print(f"Small JSON file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(SMALL_JSON_FILE))

        # Verify memory usage is within limits
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_STANDARD,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_STANDARD} KB)",
        )

    def test_large_json_file_performance(self):
        """Test performance with a large JSON file"""
        file_size = os.path.getsize(LARGE_JSON_FILE) / 1024
        markers = {"_TOKEN_": "replacement"}
        _, execution_time, memory_used = measure_performance(index.replace_markers, LARGE_JSON_FILE, markers, True)

        print(f"Large JSON file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(LARGE_JSON_FILE))

        # Verify memory usage is within limits
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_STANDARD,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_STANDARD} KB)",
        )

    def test_complex_json_file_performance(self):
        """Test performance with a complex JSON file"""
        file_size = os.path.getsize(COMPLEX_JSON_FILE) / 1024
        markers = {"_TOKEN_": "replacement"}
        _, execution_time, memory_used = measure_performance(index.replace_markers, COMPLEX_JSON_FILE, markers, True)

        print(f"Complex JSON file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(COMPLEX_JSON_FILE))

        # Verify memory usage is within limits
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_STANDARD,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_STANDARD} KB)",
        )

    def test_complex_json_file_no_marker_performance(self):
        """Test performance with a complex JSON file"""
        file_size = os.path.getsize(COMPLEX_JSON_FILE) / 1024
        markers = {}
        _, execution_time, memory_used = measure_performance(index.replace_markers, COMPLEX_JSON_FILE, markers, True)

        print(f"Complex JSON file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(COMPLEX_JSON_FILE))

        # Verify memory usage is within limits
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_STANDARD,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_STANDARD} KB)",
        )

    def test_complex_json_file_double_quote_marker_performance(self):
        """Test performance with a complex JSON file with double quotes in markers"""
        file_size = os.path.getsize(COMPLEX_JSON_FILE) / 1024
        markers = {"_TOKEN_": 'rep"lacem"ent'}
        _, execution_time, memory_used = measure_performance(index.replace_markers, COMPLEX_JSON_FILE, markers, True)

        print(f"Complex JSON file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(COMPLEX_JSON_FILE))

        # Verify memory usage is within limits - this test has a higher limit due to JSON parsing
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_COMPLEX,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_COMPLEX} KB)",
        )

    def test_complex_json_file_with_marker_double_quote_marker_performance(self):
        """Test performance with a complex JSON file with double quotes in markers"""
        file_size = os.path.getsize(COMPLEX_JSON_FILE_WITH_MARKER) / 1024
        markers = {"_TOKEN_": 'rep"lacem"ent'}
        _, execution_time, memory_used = measure_performance(
            index.replace_markers, COMPLEX_JSON_FILE_WITH_MARKER, markers, True
        )

        print(f"Complex JSON file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(COMPLEX_JSON_FILE_WITH_MARKER))

        # Verify memory usage is within limits - this test has a higher limit due to JSON parsing
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_COMPLEX,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_COMPLEX} KB)",
        )

    def test_small_text_file_performance(self):
        """Test performance with a small text file"""
        file_size = os.path.getsize(SMALL_TEXT_FILE) / 1024
        markers = {"_TOKEN_": "replacement"}
        _, execution_time, memory_used = measure_performance(index.replace_markers, SMALL_TEXT_FILE, markers, True)

        print(f"Small text file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(SMALL_TEXT_FILE))

        # Verify memory usage is within limits
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_STANDARD,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_STANDARD} KB)",
        )

    def test_large_text_file_performance(self):
        """Test performance with a large text file"""
        file_size = os.path.getsize(LARGE_TEXT_FILE) / 1024
        markers = {"_TOKEN_": "replacement"}
        _, execution_time, memory_used = measure_performance(index.replace_markers, LARGE_TEXT_FILE, markers, True)

        print(f"Large text file ({file_size:.2f} KB):")
        print(f"  Execution time: {execution_time:.4f} seconds")
        print(f"  Memory used: {memory_used} KB")

        # Verify the file still exists and was processed
        self.assertTrue(os.path.exists(LARGE_TEXT_FILE))

        # Verify memory usage is within limits
        self.assertLessEqual(
            memory_used,
            MEMORY_LIMIT_STANDARD,
            f"Memory usage ({memory_used} KB) exceeds limit ({MEMORY_LIMIT_STANDARD} KB)",
        )


def run_init():
    """Initialize test files and print paths"""
    test_dir = initialize_test_files()
    print(f"TEST_DIR={test_dir}")
    print(f"SMALL_JSON_FILE={SMALL_JSON_FILE}")
    print(f"LARGE_JSON_FILE={LARGE_JSON_FILE}")
    print(f"COMPLEX_JSON_FILE={COMPLEX_JSON_FILE}")
    print(f"COMPLEX_JSON_FILE_WITH_MARKER={COMPLEX_JSON_FILE_WITH_MARKER}")
    print(f"SMALL_TEXT_FILE={SMALL_TEXT_FILE}")
    print(f"LARGE_TEXT_FILE={LARGE_TEXT_FILE}")


def run_test(test_name):
    """Run a specific test"""
    # Run the specified test
    suite = unittest.TestSuite()
    suite.addTest(TestLargeFiles(test_name))
    runner = unittest.TextTestRunner()
    runner.run(suite)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run large file tests")
    parser.add_argument("--init", action="store_true", help="Initialize test files")
    parser.add_argument("--test", type=str, help="Run a specific test")
    parser.add_argument("--test-dir", type=str, help="Test directory with pre-created files")

    args = parser.parse_args()

    if args.init:
        run_init()
    elif args.test:
        if args.test_dir:
            # Use pre-created files
            TEST_DIR = args.test_dir
            SMALL_JSON_FILE = os.path.join(TEST_DIR, "small.json")
            LARGE_JSON_FILE = os.path.join(TEST_DIR, "large.json")
            COMPLEX_JSON_FILE = os.path.join(TEST_DIR, "complex.json")
            COMPLEX_JSON_FILE_WITH_MARKER = os.path.join(TEST_DIR, "complex_marker.json")
            SMALL_TEXT_FILE = os.path.join(TEST_DIR, "small.txt")
            LARGE_TEXT_FILE = os.path.join(TEST_DIR, "large.txt")

            run_test(args.test)
        else:
            print("Error: --test-dir is required when running a specific test")
    else:
        print("Error: Either --init or --test must be specified")
