#!/bin/bash

# A simple script to audit the codebase for "band-aid" or "whack-a-mole" UI tweaks
# Usage: ./scripts/detect-tweaks.sh

CORE_DIR="src/components/ui/"
DEMO_DIR="src/"

echo "=================================================================="
echo "🔍 AUDIT: Arbitrary CSS Variables in Tailwind"
echo "=================================================================="
echo "Looking for classes like text-[var(--...)] or border-[var(--...)]."
echo "These should ideally be mapped via @theme in globals.css."
echo ""
CORE_COUNT=$(grep -rE '\[var\(--' "$CORE_DIR" 2>/dev/null | wc -l | tr -d ' ')
TOTAL_COUNT=$(grep -rE '\[var\(--' "$DEMO_DIR" 2>/dev/null | wc -l | tr -d ' ')
DEMO_COUNT=$((TOTAL_COUNT - CORE_COUNT))
echo "  Core components (src/components/ui/): $CORE_COUNT occurrences"
echo "  Demos & pages:                        $DEMO_COUNT occurrences"
echo "  Total:                                 $TOTAL_COUNT occurrences"

echo ""
echo "=================================================================="
echo "🔍 AUDIT: Arbitrary Spacing/Sizing/Positioning (Whack-a-mole fixes)"
echo "=================================================================="
echo "Looking for hardcoded pixel values like pt-[2px], w-[300px], top-[14px]."
echo "These often indicate a component is being hacked to fit a specific screen,"
echo "rather than using the standard design system spacing tokens."
echo ""
echo "--- Core components (src/components/ui/) ---"
grep -rE '\b[pmwh]t?b?l?r?[xy]?-\[[0-9]+(px|rem|em|%)\]' "$CORE_DIR" 2>/dev/null || echo "  (none found ✓)"
echo ""
echo "--- Demos & sections ---"
grep -rE '\b[pmwh]t?b?l?r?[xy]?-\[[0-9]+(px|rem|em|%)\]' "$DEMO_DIR" --include="*-default.tsx" 2>/dev/null || echo "  (none found ✓)"

echo ""
echo "=================================================================="
echo "🔍 AUDIT: Negative Margins (Often used to force alignment)"
echo "=================================================================="
echo "Looking for -mt-, -ml-, etc."
echo ""
echo "--- Core components (src/components/ui/) ---"
grep -rE '\B-[pm][tblrxy]?-[0-9]+' "$CORE_DIR" 2>/dev/null || echo "  (none found ✓)"
echo ""
echo "--- Demos & sections ---"
grep -rE '\B-[pm][tblrxy]?-[0-9]+' "$DEMO_DIR" --include="*-default.tsx" 2>/dev/null || echo "  (none found ✓)"

echo ""
echo "Run with 'grep -rE <pattern> src/' manually to see the exact files and lines."
