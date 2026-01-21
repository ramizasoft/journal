import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { FileText, Copy, Check, Download, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from '@inertiajs/react';

export default function Report({ auth, report, range, style }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(report);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-100 leading-tight">Journal Intelligence</h2>}
        >
            <Head title="Journal Report" />

            <div className="py-12 bg-slate-950 min-h-[calc(100vh-64px)] text-slate-200">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-8">
                        <Link
                            href={route('worklogs.index')}
                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Journal
                        </Link>

                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Report'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-12 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-10 opacity-50">
                                <FileText className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{style} Report / {range[0]} — {range[1]}</span>
                            </div>

                            <article className="prose prose-invert prose-cyan max-w-none prose-headings:font-black prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-white prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/5">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {report}
                                </ReactMarkdown>
                            </article>
                        </div>
                    </div>

                    <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-3xl text-center">
                        <p className="text-slate-500 text-sm mb-4 italic">"Success is the sum of small efforts, repeated day-in and day-out."</p>
                        <div className="flex justify-center gap-4">
                            <div className="h-1 w-12 bg-cyan-500/20 rounded-full"></div>
                            <div className="h-1 w-12 bg-cyan-500 rounded-full"></div>
                            <div className="h-1 w-12 bg-cyan-500/20 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
