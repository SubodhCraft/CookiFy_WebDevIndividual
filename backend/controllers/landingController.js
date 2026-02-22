const getLandingPageData = async (req, res) => {
    try {
        const landingData = {
            stats: [
                { value: '50K+', label: 'Curated Recipes' },
                { value: '150+', label: 'Countries' },
                { value: '500K+', label: 'Active Members' },
                { value: '4.9', label: 'App Store Rating' }
            ],
            features: [
                {
                    number: '01',
                    title: 'Curated Collection',
                    description: 'Access over 50,000 professionally tested recipes from award-winning chefs and culinary experts worldwide.'
                },
                {
                    number: '02',
                    title: 'Personalized Experience',
                    description: 'AI-powered recommendations tailored to your dietary preferences, skill level, and available ingredients.'
                },
                {
                    number: '03',
                    title: 'Step-by-Step Guidance',
                    description: 'Detailed instructions with video tutorials, timing guides, and pro tips for flawless execution.'
                },
                {
                    number: '04',
                    title: 'Community & Sharing',
                    description: 'Connect with passionate food lovers, share your creations, and discover trending recipes.'
                }
            ],
            testimonials: [
                {
                    quote: "CookiFy has completely transformed how I approach cooking. The quality of recipes and attention to detail is unmatched.",
                    author: "Alexandra Chen",
                    role: "Culinary Director, The Modern Kitchen",
                    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop"
                },
                {
                    quote: "As a professional chef, I'm impressed by the depth and authenticity of recipes. This is the gold standard for culinary platforms.",
                    author: "Marcus Williams",
                    role: "Executive Chef, Eleven Madison Park",
                    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop"
                },
                {
                    quote: "The personalized recommendations have helped me discover cuisines I never knew I'd love. Absolutely brilliant platform.",
                    author: "Sarah Mitchell",
                    role: "Food Writer, Bon Appétit",
                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                }
            ],
            categories: [
                { name: 'Artisanal', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&h=800&auto=format&fit=crop', count: '2,400+ recipes' },
                { name: 'Patisserie', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&h=800&auto=format&fit=crop', count: '3,100+ recipes' },
                { name: 'Gourmet', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&h=800&auto=format&fit=crop', count: '1,800+ recipes' },
                { name: 'Molecular', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&h=800&auto=format&fit=crop', count: '2,200+ recipes' }
            ],
            heroContent: {
                title: 'Where Culinary Excellence Meets Home',
                subtitle: 'The Art of Cooking, Reimagined',
                description: 'Discover a refined collection of world-class recipes, curated by professional chefs and delivered via Cloudinary CDN.'
            }
        };

        res.status(200).json({
            success: true,
            data: landingData
        });
    } catch (error) {
        console.error('Landing Page Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load landing page data',
            error: error.message
        });
    }
};

const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        console.log(`Newsletter subscription: ${email}`);

        res.status(200).json({
            success: true,
            message: 'Thank you for subscribing to our newsletter!'
        });
    } catch (error) {
        console.error('Newsletter Subscription Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again.',
            error: error.message
        });
    }
};

const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        console.log('Contact Form Submission:', { name, email, subject, message });

        res.status(200).json({
            success: true,
            message: 'Thank you for contacting us! We\'ll get back to you soon.'
        });
    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit contact form. Please try again.',
            error: error.message
        });
    }
};

module.exports = {
    getLandingPageData,
    subscribeNewsletter,
    submitContactForm
};
