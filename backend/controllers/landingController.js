const getLandingPageData = async (req, res) => {
    try {
        const landingData = {
            features: [
                {
                    number: '01',
                    title: 'Thousands of Recipes',
                    description: 'Browse a huge collection of recipes shared by home cooks and food lovers from around the world.'
                },
                {
                    number: '02',
                    title: 'Easy to Follow',
                    description: 'Every recipe comes with clear steps, ingredient lists, and helpful tips so anyone can cook along.'
                },
                {
                    number: '03',
                    title: 'Save Your Favorites',
                    description: 'Keep the recipes you love in your own personal collection to come back to anytime.'
                },
                {
                    number: '04',
                    title: 'Share & Connect',
                    description: 'Post your own recipes, get feedback from others, and discover what the community is making.'
                }
            ],
            testimonials: [
                {
                    quote: "Cookify made cooking so much easier for me. I find new recipes every day and the community is super helpful!",
                    author: "Alexandra Chen",
                    role: "Home Cook",
                    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop"
                },
                {
                    quote: "I love how simple it is to share my recipes and see what others are making. Great app for food lovers.",
                    author: "Marcus Williams",
                    role: "Food Enthusiast",
                    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop"
                },
                {
                    quote: "The recipe search is amazing. I always find something new to try based on what I have in my kitchen.",
                    author: "Sarah Mitchell",
                    role: "Home Chef",
                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                }
            ],
            categories: [
                { name: 'Breakfast & Brunch', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&h=800&auto=format&fit=crop', count: '120+ recipes' },
                { name: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&h=800&auto=format&fit=crop', count: '95+ recipes' },
                { name: 'Quick Meals', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&h=800&auto=format&fit=crop', count: '80+ recipes' },
                { name: 'Healthy Bowls', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&h=800&auto=format&fit=crop', count: '60+ recipes' }
            ],
            heroContent: {
                title: 'The Art of Cooking, Reimagined',
                subtitle: 'Fresh recipes daily',
                description: 'Browse thousands of handpicked recipes, save your favorites, and share your own creations with a global community of food lovers.'
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
