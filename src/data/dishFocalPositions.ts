/**
 * Per-dish focal point positioning for menu card frames.
 * Keyed by stable dish ID.
 * Portrait photos (height > width) are adjusted vertically to center the actual dish/plate
 * and crop away excess background/table/wall.
 * Landscape photos default to 'center center'.
 */

export const DISH_FOCAL_POSITIONS: Record<string, string> = {
  // Additional Dishes
  "ks-20261015-001": "center center", // Yam Ring (750x750 square)

  // Chicken
  "ks-20261015-006": "center 44%", // Kung Bao Chicken
  "ks-20261015-008": "center 47%", // Claypot Chicken
  "ks-20261015-009": "center 42%", // Roasted Chicken
  "ks-20261015-010": "center 50%", // Prawn Paste Chicken
  "ks-20261015-035": "center 52%", // Golden Dragon Chicken

  // Fish & Seafood
  "ks-20261015-024": "center 44%", // Black Bean Fish Meat
  "ks-20261015-025": "center 40%", // Claypot Fish Meat (Curry Fish Tail)
  "ks-20261015-029": "center 42%", // Sambal Fish Meat
  "ks-20261015-030": "center 43%", // Sweet and Sour Slice Fish

  // Frogs
  "ks-20261015-032": "center 60%", // Deep Fried Frog

  // Hor Fun
  "ks-20261015-045": "center 48%", // Sanluo Hor Fun
  "ks-20261015-046": "center 48%", // Black Bean Fish Hor Fun
  "ks-20261015-048": "center 44%", // Seafood and Pork Hor Fun
  "ks-20261015-049": "center 46%", // Moonlight Hor Fun
  "ks-20261015-050": "center 46%", // Big Prawn Hor Fun

  // Noodles
  "ks-20261015-051": "center 45%", // Black Bean Fish Meat Bee Hoon
  "ks-20261015-052": "center 42%", // Dry Bee Hoon
  "ks-20261015-053": "center 49%", // Fish Meat Bee Hoon Soup
  "ks-20261015-055": "center 48%", // Eggs Crispy Noodle
  "ks-20261015-057": "center 38%", // Prawn Bee Hoon Soup / Big Prawn Soup
  "ks-20261015-058": "center 47%", // Crispy Noodle

  // Pork
  "ks-20261015-060": "center 41%", // Black Sauce Roasted Pork
  "ks-20261015-064": "center 43%", // Sweet and Sour Pork

  // Rice
  "ks-20261015-066": "center 44%", // Black Bean with Sliced Fish Rice
  "ks-20261015-067": "center 49%", // Black Sauce with Roasted Pork Rice
  "ks-20261015-068": "center 42%", // Seafood Fried Rice
  "ks-20261015-069": "center 47%", // Beef Fried Rice
  "ks-20261015-070": "center 48%", // Braised Rice
  "ks-20261015-071": "center 51%", // Thai Style Fried Rice
  "ks-20261015-072": "center 49%", // Kai Lan Roasted Pork Rice
  "ks-20261015-073": "center 41%", // Kai Lan with Beef Rice
  "ks-20261015-074": "center 52%", // Soup Rice
  "ks-20261015-075": "center 43%", // Spring Onion Beef Rice
  "ks-20261015-076": "center 49%", // Sweet & Sour Pork Rice
  "ks-20261015-077": "center 49%", // Roasted Pork Tofu Rice
  "ks-20261015-078": "center 45%", // Yang Zhuo Fried Rice

  // Soups
  "ks-20261015-087": "center 44%", // Sliced Fish Soup
  "ks-20261015-088": "center 47%", // Salted Vegetables Tofu Soup
  "ks-20261015-089": "center 43%", // Spinach Soup
  "ks-20261015-090": "center 43%", // Fish Meat Soup
  "ks-20261015-091": "center 52%", // Fish Maw Soup
  "ks-20261015-092": "center 44%", // Bittergourd Soup

  // Dessert / Additional
  "ks-20261015-100": "center 46%", // Yam Paste
};

/**
 * Returns the CSS objectPosition value for a dish image.
 */
export function getDishFocalPosition(dishId?: string): string {
  if (!dishId) return 'center center';
  return DISH_FOCAL_POSITIONS[dishId] || 'center center';
}
