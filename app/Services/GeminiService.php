<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    protected $apiKey;
    protected $model = 'gemini-2.0-flash-exp';  // Fastest, most cost-effective
    
    public function setupClient($apiKey)
    {
        $this->apiKey = $apiKey;
    }
    
    public function organizeNotes($rawContent, $existingOrganized = null)
    {
        if (empty($this->apiKey)) {
            throw new \Exception('Gemini API key is not configured.');
        }
        
        $prompt = $this->buildOrganizePrompt($rawContent, $existingOrganized);
        
        $response = Http::timeout(30)->post(
            "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}",
            [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 2048,
                ]
            ]
        );
        
        if (!$response->successful()) {
            throw new \Exception('Gemini API error: ' . $response->body());
        }
        
        $data = $response->json();
        
        if (!isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            throw new \Exception('Unexpected Gemini API response format.');
        }
        
        return $data['candidates'][0]['content']['parts'][0]['text'];
    }
    
    public function generateReport($combinedContent, $style = 'detailed')
    {
        if (empty($this->apiKey)) {
            throw new \Exception('Gemini API key is not configured.');
        }
        
        $prompt = $this->buildReportPrompt($combinedContent, $style);
        
        $response = Http::timeout(30)->post(
            "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}",
            [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 4096,
                ]
            ]
        );
        
        if (!$response->successful()) {
            throw new \Exception('Gemini API error: ' . $response->body());
        }
        
        $data = $response->json();
        
        if (!isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            throw new \Exception('Unexpected Gemini API response format.');
        }
        
        return $data['candidates'][0]['content']['parts'][0]['text'];
    }
    
    protected function buildOrganizePrompt($rawContent, $existingOrganized)
    {
        $basePrompt = "You are a productivity assistant. Organize the following raw work notes into a clean, structured format using Markdown.

Break down the content into:
- **Key Achievements** (bullet points of what was accomplished)
- **Tasks Completed** (specific tasks done)
- **In Progress** (what's currently being worked on)
- **Blockers** (any issues or challenges)
- **Next Steps** (what needs to be done next)

Keep the tone professional but concise. Use clear headings and bullet points.

";

        if ($existingOrganized) {
            $basePrompt .= "Existing organized content:\n---\n{$existingOrganized}\n---\n\n";
            $basePrompt .= "New raw notes to merge:\n---\n{$rawContent}\n---\n\n";
            $basePrompt .= "Merge the new notes with the existing organized content, avoiding duplicates and maintaining chronological order.";
        } else {
            $basePrompt .= "Raw notes:\n---\n{$rawContent}\n---";
        }
        
        return $basePrompt;
    }
    
    protected function buildReportPrompt($combinedContent, $style)
    {
        $styleInstructions = match($style) {
            'executive' => 'Create a high-level executive summary focusing on key outcomes, major achievements, and strategic insights. Keep it concise and business-focused.',
            'achievements' => 'Focus solely on highlighting achievements and wins. Present them in order of impact. Be specific and quantify results where possible.',
            'detailed' => 'Provide a comprehensive breakdown of all activities, progress, and outcomes. Include context and details that would be useful for future reference.',
            default => 'Provide a balanced overview of work completed during this period.',
        };
        
        return "You are a productivity assistant creating a work report.

Style: {$style}
Instructions: {$styleInstructions}

Work logs to analyze:
---
{$combinedContent}
---

Generate the report in Markdown format with clear sections and formatting.";
    }
}
