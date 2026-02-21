
const Footer = () => {
    return (
        <footer className="footer bg-white border-t border-black/[0.05] py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

            <div className="w-full px-6 lg:px-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 relative z-10">
                <div className="col-span-2 space-y-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">COOKIFY</span>
                    </div>
                    <p className="text-gray-500 max-w-sm leading-relaxed font-medium text-lg">
                        Establishing fresh culinary standards through technology and organic community since 2026.
                        The largest fresh-first recipe network in the world.
                    </p>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-2xl bg-gray-50 border border-black/[0.03] flex items-center justify-center hover:bg-green-50 hover:border-green-500/20 cursor-pointer transition-all">
                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Platform</h4>
                    <ul className="space-y-5 text-gray-500 text-sm font-bold">
                        {['Recipe Vault', 'AI Planning', 'Smart Grocery', 'Labs'].map(link => (
                            <li key={link} className="hover:text-green-600 transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-8">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Company</h4>
                    <ul className="space-y-5 text-gray-500 text-sm font-bold">
                        {['About Us', 'Careers', 'Press', 'Legal'].map(link => (
                            <li key={link} className="hover:text-green-600 transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-8">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Support</h4>
                    <ul className="space-y-5 text-gray-500 text-sm font-bold">
                        {['Help Center', 'API Status', 'Security', 'Contact'].map(link => (
                            <li key={link} className="hover:text-green-600 transition-colors cursor-pointer">{link}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="w-full px-6 lg:px-20 mt-32 pt-10 border-t border-black/[0.05] flex flex-col md:flex-row justify-between gap-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                <div>© 2026 Cookify Global Operations. All Rights Reserved.</div>
                <div className="flex flex-wrap gap-10">
                    <span className="cursor-pointer hover:text-green-600 transition-colors">Terms of Service</span>
                    <span className="cursor-pointer hover:text-green-600 transition-colors">Privacy Policy</span>
                    <span className="cursor-pointer hover:text-green-600 transition-colors">Sustainability</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
