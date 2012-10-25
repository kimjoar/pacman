#!/bin/bash

rm -rf example/public
rm -rf example/files
mkdir -p example/files/txt
mkdir -p example/files/html

for i in {1..20000}; do
    echo $i
    echo "$i" > "example/files/txt/$(echo $i).txt"
done

for i in {1..20000}; do
    echo $i
    echo "$i" > "example/files/html/$(echo $i).html"
done
