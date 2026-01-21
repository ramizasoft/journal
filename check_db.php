<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Worklog;

$user = User::where('email', 'browser_test_2@example.com')->first();
if ($user) {
    echo "User ID: " . $user->id . "\n";
    $worklogs = $user->worklogs;
    foreach ($worklogs as $log) {
        echo "Log Date: " . $log->log_date . "\n";
        echo "Raw Content: " . ($log->raw_content ?: '[EMPTY]') . "\n";
    }
} else {
    echo "User not found\n";
}
