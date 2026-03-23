@echo off
if not exist "app\[locale]" mkdir "app\[locale]"
move "app\admin" "app\[locale]\"
move "app\apply" "app\[locale]\"
move "app\dashboard" "app\[locale]\"
move "app\login" "app\[locale]\"
move "app\page.tsx" "app\[locale]\"
move "app\layout.tsx" "app\[locale]\"
echo Done.
