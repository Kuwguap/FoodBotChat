const foodData = [
    { name: 'pizza', sizes: { small: 10, medium: 15, large: 20 } },
    { name: 'burger', sizes: { single: 5, double: 8 } },
    // ... other food items
  ];
  
  const getFoodSuggestions = (budget) => {
    return foodData.flatMap(food => Object.entries(food.sizes)
      .filter(([size, price]) => price <= budget)
      .map(([size, price]) => `${food.name} (${size})`));
  };
  
  function findClosestFood(suggestions, budget) {
    if (!suggestions || suggestions.length === 0 || budget < 0) {
      return null;
    }
  
    const filteredSuggestions = suggestions.filter(food => food.price <= budget);
    if (filteredSuggestions.length === 0) {
      return null;
    }
  
    return filteredSuggestions.reduce((closest, current) => {
      const closestDiff = Math.abs(closest.price - budget);
      const currentDiff = Math.abs(current.price - budget);
      return currentDiff < closestDiff ? current : closest;
    }, filteredSuggestions[0]);
  }
  
  export default getFoodSuggestions;
  