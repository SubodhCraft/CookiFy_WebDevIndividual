
const Footer = () => {
    return (
        <footer className="footer bg-[#07070a] border-t border-white/5 py-24 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 relative z-10">
                <div className="col-span-2 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tighter text-white">COOKIFY.PRO</span>
                    </div>
                    <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
                        Elevating home kitchens through technology and community since 2024.
                        The largest decentralized recipe network in the world.
                    </p>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-xl glass-card border-white/5 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors">
                                <div className="w-4 h-4 bg-slate-400 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Platform</h4>
                    <ul className="space-y-4 text-slate-500 text-sm font-bold">
                        {['Recipe Vault', 'AI Planning', 'Smart Grocery', 'Labs'].map(link => (
                            <li key={link} className="hover:text-indigo-400 transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Company</h4>
                    <ul className="space-y-4 text-slate-500 text-sm font-bold">
                        {['About Us', 'Careers', 'Press', 'Legal'].map(link => (
                            <li key={link} className="hover:text-indigo-400 transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Support</h4>
                    <ul className="space-y-4 text-slate-500 text-sm font-bold">
                        {['Help Center', 'API Status', 'Security', 'Contact'].map(link => (
                            <li key={link} className="hover:text-indigo-400 transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                <div>© 2024 Cookify Global Operations. All Rights Reserved.</div>
                <div className="flex gap-8">
                    <span>Terms of Service</span>
                    <span>Privacy Policy</span>
                    <span>Cookie Shield</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
