export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-300 shadow-sm transition duration-150 ease-in-out hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2 active:bg-slate-950 disabled:opacity-25 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
