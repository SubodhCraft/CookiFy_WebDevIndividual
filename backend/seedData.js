const { Recipe } = require('./models');

const seedRecipes = async () => {
    try {
        const count = await Recipe.count();
        if (count > 0) {
            return;
        }

        const recipes = [
            {
                title: 'Avocado Toast',
                description: 'Creamy avocado on toasted sourdough with greens and a sprinkle of sea salt. Simple, fresh, and filling.',
                image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&auto=format&fit=crop',
                prepTime: '15 min',
                calories: 320,
                difficulty: 'Easy',
                category: 'Breakfast',
                tags: ['Healthy', 'Quick', 'Vegan']
            },
            {
                title: 'Mushroom Risotto',
                description: 'Slow-cooked rice with mixed mushrooms and a touch of truffle oil. Rich, creamy, and comforting.',
                image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop',
                prepTime: '45 min',
                calories: 480,
                difficulty: 'Hard',
                category: 'Main Course',
                tags: ['Vegetarian', 'Italian', 'Comfort Food']
            },
            {
                title: 'Blueberry Smoothie Bowl',
                description: 'A colorful breakfast bowl with fresh blueberries, granola, coconut yogurt, and a drizzle of honey.',
                image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&auto=format&fit=crop',
                prepTime: '10 min',
                calories: 210,
                difficulty: 'Easy',
                category: 'Breakfast',
                tags: ['Healthy', 'Quick', 'Sweet']
            },
            {
                title: 'Pan-Seared Scallops',
                description: 'Golden seared scallops with a light lemon-butter sauce and fresh garden peas on the side.',
                image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&auto=format&fit=crop',
                prepTime: '25 min',
                calories: 340,
                difficulty: 'Medium',
                category: 'Seafood',
                tags: ['Dinner', 'Seafood', 'High Protein']
            }
        ];

        await Recipe.bulkCreate(recipes);
        console.log('✅ Recipes seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding recipes:', error);
    }
};

module.exports = seedRecipes;
