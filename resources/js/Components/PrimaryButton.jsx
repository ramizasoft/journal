export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-xl border border-transparent bg-cyan-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-cyan-500 focus:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 active:bg-cyan-700 shadow-lg shadow-cyan-900/20 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
