$gitPath = "C:\Program Files\Git\bin\git.exe"

Write-Host "Starting deployment..."
Write-Host ""

# Configure Git
Write-Host "Configuring Git..."
& $gitPath config user.email "elmar@example.com"
& $gitPath config user.name "Elmar"
Write-Host "Git configured"
Write-Host ""

# Check status
Write-Host "Current changes:"
& $gitPath status --short
Write-Host ""

# Add changes
Write-Host "Staging all changes..."
& $gitPath add -A
Write-Host "Changes staged"
Write-Host ""

# Commit
Write-Host "Committing changes..."
& $gitPath commit -m "Update Fruits War game image to custom SVG"
Write-Host "Changes committed"
Write-Host ""

# Push
Write-Host "Pushing to GitHub..."
& $gitPath push
Write-Host "Changes pushed"
Write-Host ""

Write-Host "Deployment complete! Vercel will redeploy in 1-2 minutes."
