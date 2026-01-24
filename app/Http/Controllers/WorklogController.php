<?php

namespace App\Http\Controllers;

use App\Models\Worklog;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

class WorklogController extends Controller
{
    protected $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }

    public function index()
    {
        return Inertia::render('Worklogs/Index', [
            'worklogs' => auth()->user()->worklogs()
                ->orderBy('log_date', 'desc')
                ->get(),
            'hasGeminiKey' => !empty(auth()->user()->gemini_key),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'raw_content' => 'nullable|string',
        ]);

        $worklog = auth()->user()->worklogs()->updateOrCreate(
            ['log_date' => Carbon::today()],
            ['raw_content' => $validated['raw_content'] ?? '']
        );

        return back()->with('success', 'Raw notes saved.');
    }

    public function process($worklogId)
    {
        // Find the worklog scoped to the authenticated user
        $worklog = auth()->user()->worklogs()->findOrFail($worklogId);

        if (empty($worklog->raw_content)) {
            return back()->withErrors(['process' => 'No notes to process.']);
        }

        // Rate limiting: 1 attempt per 30 seconds per user per worklog
        $throttleKey = 'process-worklog:' . auth()->id() . ':' . $worklogId;
        
        if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'process' => "Please wait {$seconds} " . Str::plural('second', $seconds) . " before reorganizing again."
            ]);
        }

        try {
            $user = auth()->user();
            $userKey = $user->gemini_key ?: config('services.gemini.key');
            
            if (empty($userKey)) {
                throw new \Exception('No Gemini API key found. Please set one in your profile.');
            }

            $this->gemini->setupClient($userKey);

            $organized = $this->gemini->organizeNotes($worklog->raw_content, $worklog->organized_content);
            $worklog->update(['organized_content' => $organized]);
            
            // Hit rate limiter after successful processing (30 second cooldown)
            RateLimiter::hit($throttleKey, 30);
            
            return back()->with('success', 'Logs organized by AI!');
        } catch (\Exception $e) {
            return back()->withErrors(['process' => $e->getMessage()]);
        }
    }

    public function generateReport(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'style' => 'required|in:executive,detailed,achievements',
        ]);

        // Rate limiting: 1 attempt per 60 seconds per user for report generation
        $throttleKey = 'generate-report:' . auth()->id();
        
        if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return back()->withErrors([
                'report' => "Please wait {$seconds} " . Str::plural('second', $seconds) . " before generating another report."
            ]);
        }

        $logs = auth()->user()->worklogs()
            ->whereBetween('log_date', [$validated['start_date'], $validated['end_date']])
            ->whereNotNull('organized_content')
            ->orderBy('log_date', 'asc')
            ->get();

        if ($logs->isEmpty()) {
            return back()->withErrors(['report' => 'No organized logs found for this date range.']);
        }

        $combinedContent = $logs->pluck('organized_content')->implode("\n\n---\n\n");

        try {
            $user = auth()->user();
            $userKey = $user->gemini_key ?: config('services.gemini.key');

            if (empty($userKey)) {
                throw new \Exception('No Gemini API key found. Please set one in your profile.');
            }

            $this->gemini->setupClient($userKey);

            $report = $this->gemini->generateReport($combinedContent, $validated['style']);
            
            // Hit rate limiter after successful report generation (60 second cooldown)
            RateLimiter::hit($throttleKey, 60);
            
            return Inertia::render('Worklogs/Report', [
                'report' => $report,
                'range' => [$validated['start_date'], $validated['end_date']],
                'style' => $validated['style']
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['report' => $e->getMessage()]);
        }
    }
}
