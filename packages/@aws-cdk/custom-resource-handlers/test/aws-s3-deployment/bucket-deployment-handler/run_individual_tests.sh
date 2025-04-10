#!/bin/bash
# Script to run each test individually for more accurate memory measurements

echo "Running tests individually to get accurate memory measurements..."

# Initialize test files first
echo -e "\n\n=== Initializing Test Files ==="
TEST_DIR=$(python3 -m test_large_files --init | grep "TEST_DIR=" | cut -d'=' -f2)
echo -e "\n\nTest directory: $TEST_DIR"

# Run each test individually with the pre-created files
echo -e "\n\n=== Small JSON File Test ==="
python3 -m test_large_files --test test_small_json_file_performance --test-dir "$TEST_DIR"

echo -e "\n\n=== Large JSON File Test ==="
python3 -m test_large_files --test test_large_json_file_performance --test-dir "$TEST_DIR"

echo -e "\n\n=== Complex JSON File Test ==="
python3 -m test_large_files --test test_complex_json_file_performance --test-dir "$TEST_DIR"

echo -e "\n\n=== Small Text File Test ==="
python3 -m test_large_files --test test_small_text_file_performance --test-dir "$TEST_DIR"

echo -e "\n\n=== Large Text File Test ==="
python3 -m test_large_files --test test_large_text_file_performance --test-dir "$TEST_DIR"

echo -e "\n\n=== Complex JSON File with no markers Test ==="
python3 -m test_large_files --test test_complex_json_file_no_marker_performance --test-dir "$TEST_DIR"

echo -e "\n\n=== Complex JSON File with markers with double quote markers Test ==="
python3 -m test_large_files --test test_complex_json_file_with_marker_double_quote_marker_performance --test-dir "$TEST_DIR"

echo -e "\n\n=== Complex small JSON File with markers with double quote markers Test ==="
python3 -m test_large_files --test test_small_complex_json_file_with_marker_double_quote_marker_performance --test-dir "$TEST_DIR"

echo -e "\n\nAll tests completed."

# Clean up test files
rm -rf "$TEST_DIR"
