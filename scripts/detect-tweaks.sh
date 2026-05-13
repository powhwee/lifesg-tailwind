#!/bin/bash

# A simple script to audit the codebase for "band-aid" or "whack-a-mole" UI tweaks
# Usage: ./scripts/detect-tweaks.sh

TARGET_DIR="src/"

echo "=================================================================="
echo "🔍 AUDIT: Arbitrary CSS Variables in Tailwind"
echo "=================================================================="
echo "Looking for classes like text-[var(--...)] or border-[var(--...)]."
echo "These should ideally be mapped in tailwind.config.ts instead."
echo ""
grep -rE '\[var\(--' "$TARGET_DIR" | wc -l | awk '{print "Found " $1 " occurrences."}'

echo ""
echo "=================================================================="
echo "🔍 AUDIT: Arbitrary Spacing/Sizing/Positioning (Whack-a-mole fixes)"
echo "=================================================================="
echo "Looking for hardcoded pixel values like pt-[2px], w-[300px], top-[14px]."
echo "These often indicate a component is being hacked to fit a specific screen,"
echo "rather than using the standard design system spacing tokens."
echo ""
grep -rE '\b[pmwh]t?b?l?r?[xy]?-\[[0-9]+(px|rem|em|%)\]' "$TARGET_DIR"

echo ""
echo "=================================================================="
echo "🔍 AUDIT: Negative Margins (Often used to force alignment)"
echo "=================================================================="
echo "Looking for -mt-, -ml-, etc."
echo ""
grep -rE '\B-[pm][tblrxy]?-[0-9]+' "$TARGET_DIR"

echo ""
echo "Run with 'grep -rE <pattern> src/' manually to see the exact files and lines."
