export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`flex items-center gap-2 ${props.className}`}>
            <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 bg-cyan-600 rounded-lg rotate-12 absolute blur-lg opacity-40"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg relative flex items-center justify-center shadow-lg transform hover:rotate-0 transition-transform duration-500">
                    <span className="text-white font-black text-xs">J</span>
                </div>
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-800 dark:text-white uppercase">Journal</span>
        </div>
    );
}
