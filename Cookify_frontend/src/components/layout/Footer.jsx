import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
                    {/* Brand Description - spans 2 columns */}
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <img src="/Cookify.png" alt="Cookify Logo" className="w-10 h-10 object-contain" />
                            <span className="text-2xl font-bold text-gray-900 font-heading tracking-tight">Cookify</span>
                        </div>
                        <p className="text-gray-500 leading-relaxed text-sm max-w-sm">
                            Cookify: Discover, create, and share delicious recipes with a community of food lovers worldwide.
                        </p>
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#2E7D32] hover:bg-[#E8F5E9] transition-all cursor-pointer">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.411 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.27.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.38.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.694-4.564 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.409 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Product</h4>
                        <ul className="space-y-4">
                            {['Explore Recipes', 'Add Recipe', 'Categories', 'Popular'].map(item => (
                                <li key={item}>
                                    <Link to="/" className="text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Support</h4>
                        <ul className="space-y-4">
                            {['Help Center', 'Contact', 'Privacy', 'Terms'].map(item => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-gray-500 hover:text-[#2E7D32] transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-gray-400">
                        © {currentYear} Cookify. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        {['Terms of Service', 'Privacy Policy', 'Cookies'].map(item => (
                            <a key={item} href="#" className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
