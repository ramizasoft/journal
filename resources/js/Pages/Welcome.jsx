import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Sparkles, Save, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to Journal" />
            <div className="bg-slate-950 text-slate-200 min-h-screen selection:bg-cyan-500 selection:text-white font-sans overflow-hidden">
                {/* Visual highlights */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <header className="flex justify-between items-center py-10">
                        <ApplicationLogo className="scale-125 origin-left" />
                        <nav className="flex items-center gap-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    Go to Journal
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 bg-cyan-600 rounded-xl font-black text-sm text-white hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)] active:scale-95"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="mt-20 lg:mt-32">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                                    <Sparkles className="w-4 h-4 text-cyan-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">AI-Powered Journaling</span>
                                </div>
                                <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                                    Dump your thoughts.<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI clarifies reality.</span>
                                </h1>
                                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                                    A premium multi-user space to log your day, sporadic notes, and milestones. Let high-level intelligence reorganize your chaos into professional chronicles.
                                </p>
                                <div className="flex gap-4">
                                    <Link
                                        href={route('register')}
                                        className="px-10 py-4 bg-white text-black rounded-2xl font-black text-lg flex items-center gap-2 group hover:gap-4 transition-all"
                                    >
                                        Create Free Journal
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative hidden lg:block"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-20 animate-pulse"></div>
                                <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-4 bg-slate-800 rounded-full w-3/4"></div>
                                            <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
                                            <div className="h-20 bg-slate-800/50 rounded-2xl w-full flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-cyan-500/30" />
                                            </div>
                                            <div className="h-4 bg-slate-800 rounded-full w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <section className="mt-40 grid md:grid-cols-3 gap-8">
                            <div className="p-8 bg-slate-900/40 border border-slate-800/50 rounded-3xl hover:bg-slate-900/60 transition-colors">
                                <Save className="w-8 h-8 text-cyan-500 mb-4" />
                                <h3 className="font-bold text-xl text-white mb-2">Secure Storage</h3>
                                <p className="text-slate-500 text-sm italic leading-relaxed">Encrypted data storage with personal API key support for complete privacy.</p>
                            </div>
                            <div className="p-8 bg-slate-900/40 border border-slate-800/50 rounded-3xl hover:bg-slate-900/60 transition-colors">
                                <Sparkles className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="font-bold text-xl text-white mb-2">AI Reorganization</h3>
                                <p className="text-slate-500 text-sm italic leading-relaxed">Transform messy notes into structured chronological work diaries automatically.</p>
                            </div>
                            <div className="p-8 bg-slate-900/40 border border-slate-800/50 rounded-3xl hover:bg-slate-900/60 transition-colors">
                                <FileText className="w-8 h-8 text-purple-500 mb-4" />
                                <h3 className="font-bold text-xl text-white mb-2">Intelligence Reports</h3>
                                <p className="text-slate-500 text-sm italic leading-relaxed">Generate weekly or monthly highlights and executive summaries with one click.</p>
                            </div>
                        </section>
                    </main>

                    <footer className="py-20 text-center border-t border-slate-900 mt-20">
                        <p className="text-slate-600 text-sm font-bold tracking-widest uppercase">© 2026 Journal AI — Built for Clarity</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
