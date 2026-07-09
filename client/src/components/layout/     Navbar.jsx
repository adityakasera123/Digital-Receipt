function Navbar(){
    return (
        <header className="w-full">
            <nav className="container-custom flex items-center justify-between py-6">
                {/*logo */}
                <div>
                    <h1 className="text-2xl font-bold">
                        BILLVORA
                    </h1>
                </div>

                {/* navlinks */}

                <ul className="hidden gap-10 text-sm text-zinc-300 md:flex">
                    <li className="cursor-pointer hover:text-white">
                        Features
                    </li>
                    <li className="cursor-pointer hover:text-white">
                        How it works
                    </li>
                    <li className="cursor-pointer hover:text-white">
                        pricing
                    </li>
                    <li className="cursor-pointer hover:text-white">
                      Resources
                    </li>
                
                </ul>

                {/* button */}

                <div className="flex items-center gap-4">
                    <button className="text-sm text-zinc-300 hover:text-white"> 
                    Sign In
                    </button>
                   <button className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm text-white">
  Get Started
</button>
                </div>

            </nav>

        </header>
    )
}
export default Navbar;