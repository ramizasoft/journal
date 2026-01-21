<?php

namespace App\Services;

use OpenAI;
use App\Models\Worklog;

class OpenAIService
{
    protected $client;

    public function __construct()
    {
        // Initial client with global key if present
        $this->setupClient(config('services.openai.key'));
    }

    public function setupClient(?string $apiKey)
    {
        if ($apiKey) {
            $this->client = OpenAI::client($apiKey);
        } else {
            $this->client = null;
        }
    }

    public function organizeNotes(string $rawNotes, ?string $existingLog = ''): string
    {
        $this->ensureClientReady();

        $systemPrompt = "You are an expert worklog assistant. Your task is to take a set of raw, sporadic work notes and reorganize them into a professional, structured chronological worklog in Markdown format.

RULES:
1. Group entries by logical topic or project.
2. Maintain a chronological flow.
3. Use clear headings (h2 or h3) for major categories.
4. Convert bullet points into professional descriptions.
5. If timestamps are provided, use them.
6. Merge entries into existing log content gracefully if provided.
7. Return ONLY the reorganized markdown content. No conversational filler.";

        $userPrompt = "Existing Log Content:\n---\n{$existingLog}\n---\nNew raw notes to add/reorganize:\n---\n{$rawNotes}\n---";

        $response = $this->client->chat()->create([
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt],
            ],
            'temperature' => 0.3,
        ]);

        return $response->choices[0]->message->content;
    }

    public function generateReport(string $content, string $style = 'detailed'): string
    {
        $this->ensureClientReady();

        $styles = [
            'executive' => 'Summarize these worklogs focusing on high-level achievements, milestones, and business value for leadership. Keep it punchy.',
            'detailed' => 'Create a comprehensive report of all technical activities, resolutions, and ongoing tasks. Include specifics.',
            'achievements' => 'Extract ONLY the major accomplishments and wins. Ignore routine maintenance or minor tasks.',
        ];

        $prompt = $styles[$style] ?? $styles['detailed'];

        $response = $this->client->chat()->create([
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => "You are an expert reporter. {$prompt}"],
                ['role' => 'user', 'content' => "Source Logs:\n{$content}"],
            ],
            'temperature' => 0.5,
        ]);

        return $response->choices[0]->message->content;
    }

    protected function ensureClientReady()
    {
        if (!$this->client) {
            throw new \Exception('OpenAI API Key is required. Please set it in your Profile settings.');
        }
    }
}
