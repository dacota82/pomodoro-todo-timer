# GitHub에 업로드하는 스크립트
# 사용 전: gh auth login (최초 1회)

$ErrorActionPreference = "Stop"
$git = "C:\Program Files\Git\bin\git.exe"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
$repoName = "pomodoro-todo-timer"

Set-Location $PSScriptRoot

& $gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "GitHub 로그인이 필요합니다. 아래 명령을 실행하세요:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor Cyan
    exit 1
}

$remotes = & $git remote 2>$null
if ($remotes -notcontains "origin") {
    Write-Host "GitHub 저장소 생성 중: $repoName" -ForegroundColor Green
    & $gh repo create $repoName --public --source=. --remote=origin --description "Pomodoro timer + Todo list app (vanilla HTML/CSS/JS)"
}

Write-Host "GitHub에 push 중..." -ForegroundColor Green
& $git push -u origin main

Write-Host ""
Write-Host "완료!" -ForegroundColor Green
& $gh repo view --web
