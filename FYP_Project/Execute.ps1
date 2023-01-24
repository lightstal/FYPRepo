foreach ($file in $jsFiles) {
    try {
        # use the Start-Process cmdlet to run the JavaScript file
        $process = Start-Process -FilePath "node.exe" -ArgumentList $file.FullName -Wait -PassThru -WindowStyle Hidden
        $exitCode = $process.ExitCode
        
        if ($exitCode -eq 0) {
            # log success
            $date = (Get-Date).ToString("yyyy-MM-dd")
            $time = (Get-Date).ToString("HH:mm:ss")
            "$($file.Name),Success,$date,$time" | Out-File -FilePath $logFile -Encoding UTF8 -Append
            Write-Host "Successfully ran $($file.Name) at $time on $date"
        } else {
            # log failure
            $date = (Get-Date).ToString("yyyy-MM-dd")
            $time = (Get-Date).ToString("HH:mm:ss")
            "$($file.Name),Failure,$date,$time, Exit Code $exitCode" | Out-File -FilePath $logFile -Encoding UTF8 -Append
            Write-Host "Error running $($file.Name) at $time on ${$date: Exit Code $exitCode}"
        }
    } catch {
        # log failure
        $date = (Get-Date).ToString("yyyy-MM-dd")
        $time = (Get-Date).ToString("HH:mm:ss")
        $error = $_.Exception.Message.Replace(":","_")
        "$($file.Name),Failure,$date,$time,$error" | Out-File -FilePath $logFile -Encoding UTF8 -Append
        Write-Host "Error running $($file.Name) at $time on ${$date: $error}"
    }
}
$process2 = Start-Process -FilePath "node.exe" -ArgumentList "C:\Users\Splunk\Documents\GitHub\FYPRepo\FYP_Project\index.js"-Wait -PassThru -WindowStyle Hidden
