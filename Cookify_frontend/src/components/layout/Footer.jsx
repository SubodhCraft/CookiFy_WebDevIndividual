const Footer = () => {
    const footerLinks = [
        { title: 'Product', links: ['Features', 'Recipes', 'Meal Plans', 'Mobile App'] },
        { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
        { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'Licenses'] }
    ];

    const socialLinks = ['Twitter', 'Instagram', 'YouTube', 'Pinterest'];

    return (
        <footer className="py-16 bg-secondary text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-secondary-light rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </div>
                            <span className="text-xl font-serif font-semibold">CookiFy</span>
                        </div>
                        <p className="text-neutral-400 leading-relaxed max-w-sm mb-8">
                            Elevating home cooking through curated recipes, expert guidance, and a passionate global community.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 bg-secondary-light rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-700 transition-colors"
                                >
                                    <span className="sr-only">{social}</span>
                                    {/* Placeholder social icons */}
                                    <span className="text-xs font-bold">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((column) => (
                        <div key={column.title}>
                            <h4 className="font-medium mb-6 text-white">{column.title}</h4>
                            <ul className="space-y-4">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-secondary-light flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} CookiFy. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm">Terms of Service</a>
                        <a href="#" className="text-neutral-500 hover:text-white transition-colors text-sm">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
