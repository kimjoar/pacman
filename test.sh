#!/bin/bash

set -e

echo "JSHint"

jshint lib
jshint bin

echo "Nodeunit"

nodeunit spec