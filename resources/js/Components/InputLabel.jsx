export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-bold uppercase tracking-widest text-slate-500 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
