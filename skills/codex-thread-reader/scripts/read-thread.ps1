[CmdletBinding(DefaultParameterSetName='Read')]
param(
  [Parameter(Mandatory=$true,ParameterSetName='Read')][string]$Thread,
  [Parameter(Mandatory=$true,ParameterSetName='Search')][string]$Search,
  [Parameter(ParameterSetName='Read')][string]$Query,
  [Parameter(ParameterSetName='Read')][string]$Cursor,
  [Parameter(ParameterSetName='Search')][switch]$Archived,
  [ValidateRange(1,20)][int]$Limit=3,
  [ValidateRange(1500,60000)][int]$MaxChars=8000,
  [ValidateRange(200,30000)][int]$MessageChars=2000,
  [string]$CodexBinary
)
$ErrorActionPreference='Stop'
try {
  if (!$CodexBinary) {
    $readerPackage=Get-AppxPackage -Name 'OpenAI.Codex' -ErrorAction SilentlyContinue | Sort-Object Version -Descending | Select-Object -First 1
    if ($readerPackage) { $CodexBinary=Join-Path $readerPackage.InstallLocation 'app\resources\codex.exe' }
    if (!$CodexBinary -or !(Test-Path -LiteralPath $CodexBinary -PathType Leaf)) {
      $readerCommand=Get-Command codex.exe -ErrorAction SilentlyContinue
      if ($readerCommand) { $CodexBinary=$readerCommand.Source }
    }
  }
  if (!$CodexBinary -or !(Test-Path -LiteralPath $CodexBinary -PathType Leaf)) { throw 'CODEX_BINARY_UNAVAILABLE: pass -CodexBinary with the installed Codex executable.' }
  $readerNodeCommand=Get-Command node.exe -ErrorAction SilentlyContinue
  $readerNode=if ($readerNodeCommand) { $readerNodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
  if (!(Test-Path -LiteralPath $readerNode -PathType Leaf)) { throw 'NODE_UNAVAILABLE: run the Node helper in an existing Node runtime.' }
  $readerArguments=@((Join-Path $PSScriptRoot 'read-thread.mjs'),'--binary',$CodexBinary,'--limit',[string]$Limit,'--max-chars',[string]$MaxChars,'--message-chars',[string]$MessageChars)
  if ($PSCmdlet.ParameterSetName -eq 'Read') {
    $readerArguments+=@('--thread',$Thread)
    if ($Query) { $readerArguments+=@('--query',$Query) }
    if ($Cursor) { $readerArguments+=@('--cursor',$Cursor) }
  } else {
    $readerArguments+=@('--search',$Search)
    if ($Archived) { $readerArguments+='--archived' }
  }
  & $readerNode @readerArguments
  if ($LASTEXITCODE -ne 0) { throw ('THREAD_READER_EXIT_' + $LASTEXITCODE) }
} catch {
  Write-Error $_.Exception.Message
}
