$port = 8085
$root = "c:\Users\Voidcore\Desktop\Files\Collage\Antigravity"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "THERMACASE Server started at http://localhost:$port/"
} catch {
    Write-Host "Failed to start server on port ${port}: $_"
    exit 1
}

function Process-Request($context, $rootPath) {
    $request = $context.Request
    $response = $context.Response
    try {
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Accept-Ranges", "bytes")
        $response.AddHeader("Cache-Control", "public, max-age=3600")

        $rawPath = $request.Url.LocalPath
        if ($rawPath -eq "/" -or [string]::IsNullOrWhiteSpace($rawPath)) { 
            $rawPath = "/index.html" 
        }
        
        $relative = $rawPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $rootPath $relative
        
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".png"  { $response.ContentType = "image/png" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                ".webp" { $response.ContentType = "image/webp" }
                ".mp4"  { $response.ContentType = "video/mp4" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $fileInfo = New-Object System.IO.FileInfo($filePath)
            $fileLength = $fileInfo.Length
            
            $rangeHeader = $request.Headers["Range"]
            if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
                $range = $rangeHeader.Substring(6).Split('-')
                $start = [long]$range[0]
                $end = if ($range.Length -gt 1 -and ![string]::IsNullOrEmpty($range[1])) { [long]$range[1] } else { $fileLength - 1 }
                if ($end -ge $fileLength) { $end = $fileLength - 1 }
                $length = $end - $start + 1
                
                $response.StatusCode = 206
                $response.AddHeader("Content-Range", "bytes $start-$end/$fileLength")
                $response.ContentLength64 = $length
                
                $fs = [System.IO.File]::OpenRead($filePath)
                $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                $buffer = New-Object byte[] 65536
                $bytesRemaining = $length
                while ($bytesRemaining -gt 0) {
                    $toRead = [Math]::Min([long]$buffer.Length, $bytesRemaining)
                    $bytesRead = $fs.Read($buffer, 0, [int]$toRead)
                    if ($bytesRead -le 0) { break }
                    $response.OutputStream.Write($buffer, 0, $bytesRead)
                    $bytesRemaining -= $bytesRead
                }
                $fs.Close()
            } else {
                $response.StatusCode = 200
                $response.ContentLength64 = $fileLength
                $fs = [System.IO.File]::OpenRead($filePath)
                $buffer = New-Object byte[] 65536
                while (($bytesRead = $fs.Read($buffer, 0, $buffer.Length)) -gt 0) {
                    $response.OutputStream.Write($buffer, 0, $bytesRead)
                }
                $fs.Close()
            }
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
    } catch {
        # Client disconnect or stream error
    } finally {
        try {
            $response.Close()
        } catch {}
    }
}

while ($listener.IsListening) {
    try {
        $task = $listener.GetContextAsync()
        $context = $task.GetAwaiter().GetResult()
        # Process each request
        Process-Request $context $root
    } catch {
        # continue loop
    }
}
