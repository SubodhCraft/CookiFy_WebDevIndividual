const getLandingPageData = async (req, res) => {
    try {
        const landingData = {
            stats: {
                totalRecipes: 10000,
                totalChefs: 5000,
                totalUsers: 15000,
                cuisinesAvailable: 50
            },
            features: [
                {
                    id: 1,
                    title: 'Vast Collection',
                    description: 'Thousands of recipes from cuisines worldwide',
                    icon: '📖'
                },
                {
                    id: 2,
                    title: 'Expert Tips',
                    description: 'Learn from professional chefs and home cooks',
                    icon: '👨‍🍳'
                },
                {
                    id: 3,
                    title: 'Save Favorites',
                    description: 'Create your personal cookbook collection',
                    icon: '❤️'
                }
            ],
            testimonials: [
                {
                    id: 1,
                    name: 'Sarah Johnson',
                    role: 'Home Cook',
                    comment: 'CookiFy has transformed my cooking! I discover new recipes every day.',
                    rating: 5
                },
                {
                    id: 2,
                    name: 'Mike Chen',
                    role: 'Food Blogger',
                    comment: 'The best recipe platform I\'ve ever used. Highly recommended!',
                    rating: 5
                },
                {
                    id: 3,
                    name: 'Emily Davis',
                    role: 'Professional Chef',
                    comment: 'Great community and amazing recipe collection. Love sharing my recipes here!',
                    rating: 5
                }
            ],
            heroContent: {
                title: 'Welcome to CookiFy',
                tagline: 'Where Every Recipe Tells a Delicious Story',
                description: 'Discover, create, and share amazing recipes from around the world.'
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
