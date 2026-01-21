import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Plus, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-100 leading-tight">Welcome back, {auth.user.name.split(' ')[0]}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-slate-950 min-h-[calc(100vh-64px)] overflow-hidden">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Main Call to Action */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group col-span-1 md:col-span-2"
                        >
                            <Link href={route('worklogs.index')}>
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative p-12 bg-slate-900 rounded-[2.5rem] border border-slate-800 flex flex-col items-center text-center space-y-6">
                                    <div className="p-5 bg-cyan-500/10 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                                        <Plus className="w-12 h-12 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Open Daily Journal</h3>
                                        <p className="text-slate-500 text-lg">Start dumping your thoughts for today and let AI organize them for you.</p>
                                    </div>
                                    <div className="px-8 py-3 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest shadow-xl">
                                        Launch Editor
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Recent History or Insights */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] backdrop-blur-3xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <History className="w-6 h-6 text-slate-500" />
                                <h4 className="font-bold text-slate-200">System Activity</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-4 h-4 text-cyan-500" />
                                        <span className="text-sm font-medium text-slate-400">AI Intelligence Online</span>
                                    </div>
                                    <div className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 text-[10px] font-black rounded-md uppercase">Active</div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-400">Secure Database Encryption</span>
                                    </div>
                                    <div className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-md uppercase">Ready</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-8 bg-gradient-to-br from-cyan-900/10 to-transparent border border-cyan-800/20 rounded-[2.5rem] flex flex-col justify-center items-center text-center space-y-4"
                        >
                            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-500">Premium Upgrade</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                You are using the standard AI suite.<br />
                                <span className="opacity-50 italic">"Efficiency is doing things right; effectiveness is doing the right things."</span>
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
