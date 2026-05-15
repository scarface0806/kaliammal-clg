<?php
/**
 * mail.php  –  Universal Form Handler
 * Kaliammal College of Education
 *
 * Handles: Contact Enquiry | Registration | Admission Enquiry
 * Returns: JSON { success: bool, message: string }
 */

// ── Configuration ─────────────────────────────────────────────────────────────
define('RECIPIENT',   'kaliammalcollege@gmail.com');
define('SITE_NAME',   'Kaliammal College of Education');
define('FROM_DOMAIN', 'kaliammal.in');   // Must match your hosting domain
// ─────────────────────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=UTF-8');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ── Honeypot spam check ───────────────────────────────────────────────────────
if (!empty($_POST['_honey'])) {
    // Silent success – fool bots
    echo json_encode(['success' => true, 'message' => 'Submitted.']);
    exit;
}

// ── Sanitize helper ───────────────────────────────────────────────────────────
function ks($val) {
    return htmlspecialchars(strip_tags(trim((string) $val)), ENT_QUOTES, 'UTF-8');
}

// ── Collect and sanitize fields ───────────────────────────────────────────────
$form_type   = ks($_POST['_form_type']   ?? 'general');
$name        = ks($_POST['name']         ?? '');
$full_name   = ks($_POST['fullName']     ?? $name);
$father_name = ks($_POST['fatherName']   ?? '');
$email       = ks($_POST['email']        ?? '');
$phone       = ks($_POST['phone']        ?? '');
$whatsapp    = ks($_POST['whatsapp']     ?? '');
$city        = ks($_POST['city']         ?? '');
$program     = ks($_POST['program']      ?? ks($_POST['course'] ?? ''));
$message     = ks($_POST['message']      ?? '');

// Use fullName for admission form, plain name for others
$display_name = !empty($full_name) ? $full_name : $name;

// ── Validation ────────────────────────────────────────────────────────────────
if (empty($display_name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Full name is required.']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'A valid email address is required.']);
    exit;
}

// Header-injection guard
$dangerous = ["\r", "\n", "Content-Type:", "Bcc:", "Cc:", "To:"];
foreach ($dangerous as $p) {
    if (stripos($display_name, $p) !== false || stripos($email, $p) !== false) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid input detected.']);
        exit;
    }
}

// ── Build subject ─────────────────────────────────────────────────────────────
$subject_map = [
    'admission' => 'Admission Enquiry',
    'contact'   => 'Contact Enquiry',
    'register'  => 'Registration Enquiry',
];
$label   = $subject_map[$form_type] ?? 'Website Enquiry';
$subject = $label . ' - ' . SITE_NAME;

// ── Build email body ──────────────────────────────────────────────────────────
$div  = str_repeat('-', 50);
$body = SITE_NAME . " - Website Enquiry\r\n"
      . $div . "\r\n"
      . "Form Type  : " . strtoupper($form_type) . "\r\n"
      . "Date/Time  : " . date('d M Y, H:i:s') . " IST\r\n"
      . $div . "\r\n\r\n"
      . "Name       : " . $display_name . "\r\n";

if (!empty($father_name)) $body .= "Father     : " . $father_name . "\r\n";
$body .= "Email      : " . $email . "\r\n";
if (!empty($phone))    $body .= "Phone      : " . $phone    . "\r\n";
if (!empty($whatsapp)) $body .= "WhatsApp   : " . $whatsapp . "\r\n";
if (!empty($city))     $body .= "City/Town  : " . $city     . "\r\n";
if (!empty($program))  $body .= "Programme  : " . $program  . "\r\n";
if (!empty($message))  $body .= "\r\nMessage:\r\n" . $message . "\r\n";

$body .= "\r\n" . $div . "\r\n"
       . "Submitted via the " . SITE_NAME . " website.\r\n";

// ── Mail headers ──────────────────────────────────────────────────────────────
$from    = 'noreply@' . FROM_DOMAIN;
$headers = "From: " . SITE_NAME . " <" . $from . ">\r\n"
         . "Reply-To: " . $display_name . " <" . $email . ">\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "X-Mailer: PHP/" . phpversion() . "\r\n"
         . "X-Priority: 3\r\n";

// ── Send ──────────────────────────────────────────────────────────────────────
$sent = mail(RECIPIENT, $subject, $body, $headers);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your enquiry has been received. We will contact you shortly.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Mail delivery failed. Please call 6380496226 or email kaliammalcollege@gmail.com directly.'
    ]);
}
