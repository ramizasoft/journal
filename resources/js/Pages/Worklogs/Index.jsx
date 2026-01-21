import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Save, Sparkles, Calendar as CalendarIcon, FileText, CheckCircle2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Modal from '@/Components/Modal';

export default function Index({ auth, worklogs, hasGeminiKey }) {
    const { flash } = usePage().props;

    const today = new Date().toISOString().split('T')[0];
    const [selectedDate] = useState(today); // Fixed to today
    const [currentLog, setCurrentLog] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved
    const [showToast, setShowToast] = useState(true);

    // Get errors from page props (for process action)
    const pageErrors = usePage().props.errors || {};

    const { data, setData, post, processing } = useForm({
        raw_content: '',
    });

    // Auto-dismiss toast notifications after 5 seconds
    useEffect(() => {
        if (flash?.success || flash?.error || Object.keys(pageErrors).length > 0) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash, pageErrors]);

    useEffect(() => {
        const log = worklogs.find(w => {
            // Normalize log_date to YYYY-MM-DD format
            const logDate = typeof w.log_date === 'string'
                ? w.log_date.split('T')[0].split(' ')[0]
                : w.log_date;
            return logDate === selectedDate;
        });
        setCurrentLog(log || null);
        setData('raw_content', log?.raw_content || '');
    }, [selectedDate, worklogs]);

    // Auto-save logic
    useEffect(() => {
        if (data.raw_content === (currentLog?.raw_content || '')) {
            return;
        }

        setSaveStatus('idle');
        const timeoutId = setTimeout(() => {
            setSaveStatus('saving');
            axios.post(route('worklogs.store'), {
                raw_content: data.raw_content
            }).then(() => {
                setSaveStatus('saved');
            }).catch(() => {
                setSaveStatus('idle');
            });
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [data.raw_content]);

    const handleSave = (e) => {
        e.preventDefault();
        post(route('worklogs.store'), {
            preserveScroll: true,
        });
    };

    const handleProcess = () => {
        if (!currentLog?.id) return;
        router.post(route('worklogs.process', currentLog.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Journal" />

            <div className="py-12 bg-slate-950 min-h-[calc(100vh-64px)] text-slate-200">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {!hasGeminiKey && (
                        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                </div>
                                <p className="text-sm text-amber-200/80 font-medium">
                                    You haven't set your Gemini API key yet. AI features will be limited.
                                </p>
                            </div>
                            <Link href={route('profile.edit')} className="text-xs font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                                Set Key now →
                            </Link>
                        </div>
                    )}

                    {/* Toast Notifications */}
                    <AnimatePresence>
                        {showToast && flash?.success && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="fixed top-24 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl rounded-2xl shadow-2xl"
                            >
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <p className="text-sm text-emerald-200 font-medium whitespace-nowrap">{flash.success}</p>
                            </motion.div>
                        )}

                        {showToast && (flash?.error || Object.keys(pageErrors).length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="fixed top-24 right-6 z-50 flex items-start gap-4 px-6 py-4 bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md"
                            >
                                <div className="p-1 bg-red-500/20 rounded-lg mt-0.5">
                                    <Sparkles className="w-4 h-4 text-red-500" />
                                </div>
                                <div>
                                    {flash?.error && <p className="text-sm text-red-200 font-medium">{flash.error}</p>}
                                    {Object.entries(pageErrors).map(([key, value]) => (
                                        <p key={key} className="text-sm text-red-200 font-medium">{value}</p>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/80 rounded-2xl border border-slate-800/50 backdrop-blur-2xl shadow-xl">
                                <CalendarIcon className="w-5 h-5 text-cyan-400" />
                                <span className="text-lg font-bold text-slate-100">
                                    {new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowReportModal(true)}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-xl flex items-center gap-2 group"
                            >
                                <FileText className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Intelligence Reports</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-500 min-w-[100px]">
                                {saveStatus === 'saving' && (
                                    <>
                                        <RefreshCcw className="w-4 h-4 animate-spin text-cyan-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Saving</span>
                                    </>
                                )}
                                {saveStatus === 'saved' && (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Saved</span>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={processing}
                                className="group relative flex items-center gap-2 px-8 py-3.5 bg-slate-900 border border-slate-700/50 rounded-2xl font-bold transition-all hover:bg-slate-800 hover:border-slate-600 disabled:opacity-50 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Save className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                <span>Save Now</span>
                            </button>

                            <button
                                onClick={handleProcess}
                                disabled={!currentLog || processing}
                                className="group relative flex items-center gap-3 px-8 py-3.5 bg-cyan-600 rounded-2xl font-black text-white transition-all hover:bg-cyan-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]"
                            >
                                <Sparkles className="w-5 h-5 animate-pulse" />
                                <span>AI Reorganize</span>
                            </button>
                        </div>
                    </div>

                    <Modal show={showReportModal} onClose={() => setShowReportModal(false)} maxWidth="2xl">
                        <div className="p-10 bg-slate-900 text-slate-200">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-cyan-500/10 rounded-2xl">
                                    <FileText className="w-8 h-8 text-cyan-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Intelligence Report</h2>
                                    <p className="text-slate-400 font-medium">Summarize your progress over time.</p>
                                </div>
                            </div>

                            <form action={route('worklogs.report')} method="GET" className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Start Date</label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            className="w-full bg-slate-950 border-slate-800 rounded-[1.5rem] p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">End Date</label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            className="w-full bg-slate-950 border-slate-800 rounded-[1.5rem] p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Report Style</label>
                                    <select
                                        name="style"
                                        className="w-full bg-slate-950 border-slate-800 rounded-[1.5rem] p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="detailed">Detailed Breakdown</option>
                                        <option value="executive">Executive Summary</option>
                                        <option value="achievements">Key Achievements</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowReportModal(false)}
                                        className="flex-1 px-8 py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold hover:bg-slate-750 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] px-8 py-4 bg-cyan-600 text-white rounded-2xl font-black shadow-lg shadow-cyan-900/20 hover:bg-cyan-500 transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        Generate Report
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Editor Pane */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between px-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                                    Input Terminal
                                </label>
                                <div className="flex items-center gap-4">
                                    {currentLog?.raw_content && (
                                        <span className="text-[10px] font-medium text-emerald-500/70 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Continuing today's log
                                        </span>
                                    )}
                                    {processing && <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 animate-pulse">Syncing...</span>}
                                </div>
                            </div>
                            <div className="relative flex-1 group shadow-2xl">
                                <div className="absolute -inset-[1px] bg-gradient-to-b from-slate-700 to-slate-900 rounded-[2rem] opacity-50"></div>
                                <textarea
                                    value={data.raw_content}
                                    onChange={e => setData('raw_content', e.target.value)}
                                    placeholder="Type sporadic notes, tasks, or milestones here..."
                                    className="relative w-full h-[650px] bg-slate-900/90 border-none rounded-[2rem] p-10 focus:ring-2 focus:ring-cyan-500/20 transition-all text-slate-300 font-mono text-lg leading-relaxed placeholder:text-slate-700 overflow-y-auto backdrop-blur-3xl"
                                ></textarea>
                            </div>
                        </motion.div>

                        {/* Preview Pane */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between px-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-600"></div>
                                    Processed Output
                                </label>
                            </div>
                            <div className="relative flex-1 shadow-2xl">
                                <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-900/20 to-slate-900 rounded-[2rem] opacity-50"></div>
                                <div className="relative w-full h-[650px] bg-slate-900/50 border border-slate-800/50 rounded-[2rem] p-10 backdrop-blur-3xl overflow-y-auto prose prose-invert prose-cyan max-w-none prose-headings:font-black prose-p:text-slate-400 prose-p:leading-relaxed prose-li:text-slate-400 prose-strong:text-white">
                                    {currentLog?.organized_content ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                pre: ({ node, ...props }) => <div {...props} className="not-prose" />,
                                                code: ({ node, inline, className, children, ...props }) => {
                                                    return !inline ? (
                                                        <pre className="bg-slate-800/50 p-4 rounded-xl overflow-x-auto">
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        </pre>
                                                    ) : (
                                                        <code className="bg-slate-800/50 px-1.5 py-0.5 rounded text-cyan-200" {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {currentLog.organized_content.replace(/^```markdown\n|^```\n|```$/g, '')}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-6">
                                            <div className="relative">
                                                <Sparkles className="w-16 h-16 opacity-10" />
                                                <div className="absolute inset-0 blur-2xl bg-cyan-500/10 rounded-full"></div>
                                            </div>
                                            <p className="text-center font-bold text-sm tracking-tight opacity-40">
                                                AI ENGINE IDLE<br />
                                                <span className="font-normal text-xs opacity-60">Ready to organize your day.</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
