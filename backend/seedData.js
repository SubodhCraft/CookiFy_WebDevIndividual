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
                description: 'A masterpiece of texture and taste featuring Cloudinary-optimized visual fidelity. Creamy avocado on sourdough with micro-greens.',
                image: 'https://res.cloudinary.com/demo/image/upload/v1612455744/sample.jpg', // Cloudinary Sample
                prepTime: '15 min',
                calories: 320,
                difficulty: 'Easy',
                category: 'Gourmet Breakfast',
                tags: ['Artisanal', 'Healthy', 'Vegan']
            },
            {
                title: 'Truffle-Infused Risotto',
                description: 'Slow-cooked Arborio rice with wild forest mushrooms and authentic Italian truffle oil.',
                image: 'https://res.cloudinary.com/demo/image/upload/c_fill,h_800,w_1200/v1/samples/food/fish-vegetables.jpg',
                prepTime: '45 min',
                calories: 480,
                difficulty: 'Hard',
                category: 'Signature Main',
                tags: ['Luxury', 'Vegetarian', 'Italian']
            },
            {
                title: 'Blueberry Zen Bowl',
                description: 'A vibrant collection of antioxidants and superfoods. Optimized for visual clarity via Cloudinary CDN.',
                image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/dessert.jpg',
                prepTime: '10 min',
                calories: 210,
                difficulty: 'Easy',
                category: 'Vibrant Snacks',
                tags: ['Superfood', 'Raw', 'Sweet']
            },
            {
                title: 'Seared Scallops Port',
                description: 'Perfectly caramelized scallops served with a light lemon-butter reduction and garden peas.',
                image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices.jpg',
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
