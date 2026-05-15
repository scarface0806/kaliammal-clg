$enc  = [System.Text.UTF8Encoding]::new($false)
$root = 'd:\Santhosh\kaliammal'
$n    = 0

$telLinks  = '<a href="tel:+916380496226">6380496226</a>, <a href="tel:+919894633795">98946-33795</a>, <a href="tel:+919994391907">99943-91907</a>'
$mailLink  = '<a href="mailto:kaliammalcollege@gmail.com">kaliammalcollege@gmail.com</a>'

Get-ChildItem "$root\*.html" | ForEach-Object {
    $file = $_
    $c    = [IO.File]::ReadAllText($file.FullName, $enc)
    $orig = $c

    # ── 1. HEADER PHONE  (handles single-line AND multiline wrap) ──────────────
    $c = [regex]::Replace($c,
        '<li><a href="#"><i class="zmdi zmdi-phone"></i> 6380496226, 98946-33795,\s*99943-91907</a></li>',
        "<li><a href=`"tel:+916380496226`"><i class=`"zmdi zmdi-phone`"></i> 6380496226</a>, <a href=`"tel:+919894633795`">98946-33795</a>, <a href=`"tel:+919994391907`">99943-91907</a></li>")

    # ── 2. HEADER EMAIL ────────────────────────────────────────────────────────
    $c = $c.Replace(
        '<li><a href="#"><i class="zmdi zmdi-email"></i> kaliammalcollege@gmail.com</a></li>',
        '<li><a href="mailto:kaliammalcollege@gmail.com"><i class="zmdi zmdi-email"></i> kaliammalcollege@gmail.com</a></li>')

    # ── 3. FOOTER PHONE ────────────────────────────────────────────────────────
    $c = $c.Replace(
        '<p>Mobile: 6380496226, 98946-33795, 99943-91907</p>',
        "<p>Mobile: $telLinks</p>")

    # ── 4. FOOTER EMAIL — no space before colon ────────────────────────────────
    $c = $c.Replace(
        '<p>e-mail: kaliammalcollege@gmail.com</p>',
        "<p>e-mail: $mailLink</p>")

    # ── 5. FOOTER EMAIL — space before colon (index.html variant) ─────────────
    $c = $c.Replace(
        '<p>e-mail : kaliammalcollege@gmail.com</p>',
        "<p>e-mail : $mailLink</p>")

    if ($c -ne $orig) {
        [IO.File]::WriteAllText($file.FullName, $c, $enc)
        $n++
        Write-Host "  patched: $($file.Name)"
    }
}
Write-Host ""
Write-Host "Total files patched: $n"
