import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 pt-10 sm:justify-center sm:pt-0">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-600/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="relative z-10 text-center mb-10">
                <Link href="/">
                    <ApplicationLogo className="scale-150" />
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl blur opacity-20"></div>
                <div className="relative w-full overflow-hidden bg-slate-900 border border-slate-800/50 px-10 py-12 shadow-2xl rounded-3xl backdrop-blur-3xl">
                    {children}
                </div>
            </div>
        </div>
    );
}
