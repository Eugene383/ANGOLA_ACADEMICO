# Remove git conflict markers keeping HEAD block for matched files
$includes = @('*.ts','*.tsx','*.js','*.jsx','*.json','*.md')
Get-ChildItem -Path . -Include $includes -Recurse | ForEach-Object {
  $path = $_.FullName
  try {
    $text = Get-Content -Raw -Encoding UTF8 $path
  } catch { return }
  $pattern = '(?ms)^<<<<<<< HEAD\r?\n(.*?)\r?\n^=======\r?\n.*?^>>>>>>>.*\r?\n?'
  $new = [regex]::Replace($text, $pattern, '$1')
  if ($new -ne $text) {
    Set-Content -Path $path -Value $new -Encoding UTF8
    Write-Output "Fixed: $path"
  }
}
