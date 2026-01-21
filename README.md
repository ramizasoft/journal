# 📓 Journal AI

A premium, AI-powered personal journaling and work diary application built for clarity, privacy, and insight.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-v11-FF2D20?logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?logo=tailwind-css)

---

## ✨ Features

- **🧠 AI Transformation**: Dump your messy thoughts, sporadic notes, or bullet points. Our AI reorganization engine (powered by GPT-4o) transforms them into structured, professional narratives.
- **🔐 Personal Privacy (BYOK)**: Secure, encrypted storage for your data. Users can provide their own OpenAI API key to bypass global limits and ensure personal usage quotas.
- **📊 Intelligence Reports**: Generate professional summaries or "Achievements" reports for any custom date range. Perfect for weekly performance reviews or monthly reflections.
- **🌑 Premium Aesthetic**: A modern, dark-themed user interface designed with a focus on deep focus, readability, and high-end aesthetics.
- **🧩 Multi-User Support**: Robust authentication and private data silo for every registered user.

---

## 🚀 Getting Started

### Prerequisites

- **PHP**: 8.2+
- **Composer**
- **Node.js & NPM**
- **MySQL / SQLite**

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:ramizasoft/journal.git
   cd journal
   ```

2. **Install Dependencies**:
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Migration**:
   ```bash
   # Create the database first, then run:
   php artisan migrate
   ```

5. **Start Application**:
   Open two terminals:
   - **Terminal 1**: `php artisan serve`
   - **Terminal 2**: `npm run dev`

---

## 🔧 How to Use

1. **Setup Your Intelligence**:
   Once registered, head to **Profile Settings** and provide your **OpenAI API Key**. This enables the AI-powered features for your personal account.

2. **Log Your Day**:
   Go to the **Journal** tab. Simply type whatever is on your mind in the "Input Terminal". Don't worry about formatting—just record the facts.

3. **Reorganize**:
   Click **AI Reorganize**. The system will analyze your raw notes and produce a structured, chronological entry in the "Processed Output" pane.

4. **Generate Reports**:
   Use the **Intelligence Report** section to select a date range. Choose between a "Detailed Breakdown", "Executive Summary", or "Key Achievements" style to generate a consolidated report for your records.

---

## 🛠️ Technology Stack

- **Backend**: Laravel 11
- **Frontend**: React.js with Inertia.js
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: MySQL (with Schema indexing fix for compatibility)
- **AI Integration**: OpenAI GPT-4o API

---

## 📜 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
