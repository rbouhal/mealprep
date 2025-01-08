import data from "../data.json"; // Import the meal data

export const generatePlan = () => {
  const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Randomly pick meals
  const breakfasts = getRandomItems(Object.entries(data.breakfast), 3);
  const lunches = getRandomItems(Object.entries(data.lunch), 3);
  const dinners = getRandomItems(Object.entries(data.dinner), 5);
  const snacks = getRandomItems(Object.entries(data.snacks), 4);
  const drinks = getRandomItems(Object.entries(data.drinks), 3);
  const desserts = getRandomItems(Object.entries(data.deserts), 4);

  // Generate a 7-day plan with alternating meals
  const weeklyPlan = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    breakfast: breakfasts[i % breakfasts.length],
    lunch: lunches[i % lunches.length],
    dinner: dinners[i % dinners.length],
  }));

  // Consolidate ingredients into a deduplicated list
  const allIngredients = new Set();
  weeklyPlan.forEach((day) => {
    [day.breakfast, day.lunch, day.dinner].forEach((meal) =>
      meal[1].forEach((ingredient) => allIngredients.add(ingredient))
    );
  });
  snacks.forEach((snack) => snack[1].forEach((ingredient) => allIngredients.add(ingredient)));
  drinks.forEach((drink) => drink[1].forEach((ingredient) => allIngredients.add(ingredient)));
  desserts.forEach((dessert) => dessert[1].forEach((ingredient) => allIngredients.add(ingredient)));

  return {
    weeklyPlan,
    snacks: snacks.map(([name]) => name),
    drinks: drinks.map(([name]) => name),
    desserts: desserts.map(([name]) => name),
    ingredients: Array.from(allIngredients),
  };
};
