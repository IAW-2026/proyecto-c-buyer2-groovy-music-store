export default function SimpleNavBar() {
    return (
        <nav className="w-full min-h-[70px] md:min-h-[84px] flex items-center justify-between px-5 md:px-8 py-4 md:py-5 bg-primary text-white relative">
            <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                <div className="font-cormorant text-2xl md:text-3xl font-light tracking-[0.25em] md:tracking-[0.55em] select-none block px-2 py-1">
                    GROOVY
                </div>
            </div>
            
        </nav>
    );
}