import {
    Search,
    Bell,
    ChevronDown,
} from 'lucide-react';


export default function DashNavbar() {
    // useEffect(()=>{
    // //API

    // },[])
    return (
        <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/90 backdrop-blur-xl">
            <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">

                {/* Left Side */}
                <div>
                    <h1 className="text-base font-bold leading-tight text-gray-900">
                        Admin Portal
                    </h1>

                    <p className="mt-0.5 text-xs text-gray-500">
                        Manage your application
                    </p>
                </div>

                {/* Search UI */}
                <div className="hidden max-w-md flex-1 sm:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-500/50"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-1.5">

                    {/* Notification UI */}
                    <button
                        type="button"
                        className="relative rounded-xl p-2.5 transition hover:bg-gray-100"
                    >
                        <Bell className="h-5 w-5 text-gray-600" />

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                    </button>

                    <div className="mx-1 h-6 w-px bg-gray-200" />

                    {/* Profile UI */}
                    <div className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1 pr-3 transition hover:bg-gray-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 ring-2 ring-teal-500/30">
                            <span className="text-sm font-bold text-white">
                                A
                            </span>
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-bold leading-tight text-gray-900">
                                Admin
                            </p>

                            <p className="text-[10px] text-gray-500">
                                Administrator
                            </p>
                        </div>

                        <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
                    </div>

                </div>
            </div>
        </header>
    );
}
