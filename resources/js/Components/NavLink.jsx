import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-cyan-500 text-slate-100 focus:border-cyan-400'
                    : 'border-transparent text-slate-500 hover:border-slate-700 hover:text-slate-300 focus:border-slate-700 focus:text-slate-300') +
                className
            }
        >
            {children}
        </Link>
    );
}
