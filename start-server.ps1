$port = 8080
$root = $PSScriptRoot

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.mp3'  = 'audio/mpeg'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

$url = "http://localhost:$port/"
Write-Host ""
Write-Host " Pomodoro Todo 로컬 서버" -ForegroundColor Cyan
Write-Host " ========================" -ForegroundColor Cyan
Write-Host " 주소: $url" -ForegroundColor Green
Write-Host " 종료: Ctrl + C" -ForegroundColor Yellow
Write-Host ""

Start-Process $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = [Uri]::UnescapeDataString($request.Url.LocalPath)
        if ($localPath -eq '/' -or $localPath -eq '') {
            $localPath = '/index.html'
        }

        $relativePath = $localPath.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $root $relativePath

        if ((Test-Path $filePath -PathType Leaf) -and $filePath.StartsWith($root)) {
            $ext = [IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = 'application/octet-stream' }

            $bytes = [IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $notFound = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
            $response.ContentType = 'text/plain; charset=utf-8'
            $response.ContentLength64 = $notFound.Length
            $response.StatusCode = 404
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
