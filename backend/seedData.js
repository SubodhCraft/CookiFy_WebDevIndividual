const { Recipe } = require('./models');

const seedRecipes = async () => {
    try {
        const count = await Recipe.count();
        if (count > 0) {
            // Optional: Update existing recipes to use Cloudinary if needed
            // For now, only seed if empty
            return;
        }

        const recipes = [
            {
                title: 'Supreme Avocado Tartine',
                description: 'A masterpiece of texture and taste. Creamy avocado on sourdough with micro-greens and a sprinkle of sea salt.',
                image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&auto=format&fit=crop',
                prepTime: '15 min',
                calories: 320,
                difficulty: 'Easy',
                category: 'Gourmet Breakfast',
                tags: ['Artisanal', 'Healthy', 'Vegan']
            },
            {
                title: 'Truffle-Infused Risotto',
                description: 'Slow-cooked Arborio rice with wild forest mushrooms and authentic Italian truffle oil.',
                image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop',
                prepTime: '45 min',
                calories: 480,
                difficulty: 'Hard',
                category: 'Signature Main',
                tags: ['Luxury', 'Vegetarian', 'Italian']
            },
            {
                title: 'Blueberry Zen Bowl',
                description: 'A vibrant collection of antioxidants and superfoods. Fresh blueberries, granola, coconut yogurt, and honey.',
                image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&auto=format&fit=crop',
                prepTime: '10 min',
                calories: 210,
                difficulty: 'Easy',
                category: 'Vibrant Snacks',
                tags: ['Superfood', 'Raw', 'Sweet']
            },
            {
                title: 'Seared Scallops Port',
                description: 'Perfectly caramelized scallops served with a light lemon-butter reduction and garden peas.',
                image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&auto=format&fit=crop',
                prepTime: '25 min',
                calories: 340,
                difficulty: 'Medium',
                category: 'Seafood',
                tags: ['Protein', 'Gourmet', 'Coastal']
            }
        ];

        await Recipe.bulkCreate(recipes);
        console.log('✅ Recipes seeded successfully with Cloudinary Assets');
    } catch (error) {
        console.error('❌ Error seeding recipes:', error);
    }
};

module.exports = seedRecipes;
