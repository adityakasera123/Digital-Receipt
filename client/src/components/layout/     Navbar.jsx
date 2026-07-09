function Navbar(){
    return (
        <header className="w-full">
      <nav className="container-custom flex h-20 items-center justify-between">
                {/*logo */}
                <div>
                    <h1 className="text-2xl font-semi tracking-tight">
                        BILLVORA
                    </h1>
                </div>

                {/* navlinks */}

                <ul className="hidden items-center gap-10 text-sm text-zinc-400 md:flex">
                    <li className="cursor-pointer text-zinc-400 transition-colors duration-300 hover:text-white">
                        Features
                    </li>
                    <li className="cursor-pointer text-zinc-400 transition-colors duration-300 hover:text-white">
                        How it works
                    </li>
                    <li className="cursor-pointer text-zinc-400 transition-colors duration-300 hover:text-white">
                        pricing
                    </li>
                    <li className="cursor-pointer text-zinc-400 transition-colors duration-300 hover:text-white">
                      Resources
                    </li>
                
                </ul>

                {/* button */}

                <div className="flex items-center gap-6">
                    <button className="text-sm text-zinc-300 hover:text-white"> 
                    Sign In
                    </button>
                   <button className="rounded-full bg-white px-4 py-1.5 text-base font-semibold text-black transition-all duration-300 hover:scale-[1.02]">
  Get Started
</button>
                </div>
           

            </nav>

        </header>
        
    )
}
export default Navbar;