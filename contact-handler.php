<?php
// Contact Form Handler
// This script handles form submissions and sends emails

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON data from request body
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'subject', 'message'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Field '$field' is required"]);
        exit();
    }
}

// Sanitize input data
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($input['phone']));
$subject = htmlspecialchars(trim($input['subject']));
$message = htmlspecialchars(trim($input['message']));
$timestamp = $input['timestamp'] ?? date('Y-m-d H:i:s');

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

// Email configuration
$to_email = 'supplaunch@gmail.com';
$from_email = $email;
$email_subject = "New Contact Form Submission: " . $subject;

// Create email body
$email_body = "
New contact form submission received:

Name: $name
Email: $email
Phone: $phone
Subject: $subject
Timestamp: $timestamp

Message:
$message

---
Sent from Launch Supp Portfolio
";

// Email headers
$headers = [
    'From: ' . $from_email,
    'Reply-To: ' . $from_email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
$mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));

// Log the submission (optional)
$log_entry = date('Y-m-d H:i:s') . " - $name ($email) - $subject\n";
file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);

// Send WhatsApp message (using WhatsApp Business API or webhook)
$whatsapp_message = "
*New Contact Form Submission*

*Name:* $name
*Email:* $email
*Phone:* $phone
*Subject:* $subject

*Message:*
$message

---
Sent from Launch Supp Portfolio
";

// You can integrate with WhatsApp Business API here
// For now, we'll just log it
$whatsapp_log = date('Y-m-d H:i:s') . " - WhatsApp message for $name ($phone)\n";
file_put_contents('whatsapp_log.txt', $whatsapp_log, FILE_APPEND | LOCK_EX);

// Response
if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully!',
        'data' => [
            'name' => $name,
            'email' => $email,
            'timestamp' => $timestamp
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email'
    ]);
}
?>
