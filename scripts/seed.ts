import { config } from 'dotenv'

config({ path: '.env.local' })

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { items } from '../src/pkg/db/schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env.local')
}

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client)

const ITEMS = [
  {
    title: 'Margherita',
    description:
      'A timeless Italian classic inspired by the traditional flavors of Naples. It starts with a rich tomato sauce made from carefully selected ripe tomatoes. Fresh mozzarella melts beautifully across the surface, creating a creamy and delicate texture. Fragrant basil leaves add a refreshing herbal aroma that complements every bite. The crust is baked until golden and slightly crisp on the outside while remaining soft inside. Simple ingredients come together to create a perfectly balanced and authentic pizza experience. This pizza is ideal for those who appreciate classic Italian cuisine and high-quality ingredients.',
    imageUrl:
      'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800',
  },
  {
    title: 'Pepperoni',
    description:
      'One of the most popular pizzas around the world, loved for its bold and satisfying flavor. A layer of rich tomato sauce serves as the perfect base for melted mozzarella cheese. Generous slices of pepperoni become slightly crispy around the edges during baking. The combination creates a savory, smoky, and mildly spicy taste profile. Every bite delivers a balance of gooey cheese, flavorful meat, and perfectly baked crust. It is a comforting choice that never goes out of style. Perfect for casual dinners, gatherings, or whenever you are craving a classic favorite.',
    imageUrl:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
  },
  {
    title: 'BBQ Chicken',
    description:
      'This pizza combines smoky barbecue flavors with tender grilled chicken for a unique twist on a traditional pie. A rich barbecue sauce replaces the classic tomato base and provides a slightly sweet and tangy flavor. Juicy chicken pieces are distributed evenly across the pizza to ensure flavor in every bite. Thinly sliced red onions add a subtle crunch and mild sharpness. Smoked cheese melts beautifully and enhances the overall depth of flavor. The result is a hearty and satisfying pizza with a perfect balance of sweetness and smokiness. It is an excellent option for anyone looking for something beyond the ordinary.',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
  },
  {
    title: 'Four Cheese',
    description: '',
    imageUrl:
      'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800',
  },
  {
    title: 'Veggie Supreme',
    description:
      'A colorful and flavorful pizza packed with fresh vegetables and vibrant ingredients. Tomato sauce and mozzarella provide a classic base that highlights the toppings. Bell peppers bring sweetness and crunch while mushrooms add earthy notes. Black olives contribute a rich and slightly salty flavor that ties everything together. The variety of vegetables creates both visual appeal and a satisfying texture. Each bite feels fresh, balanced, and full of natural flavors. It is an excellent choice for vegetarians or anyone seeking a lighter pizza option without sacrificing taste.',
    imageUrl:
      'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=800',
  },
  {
    title: 'Hawaiian',
    description:
      'A famous sweet-and-savory pizza that continues to inspire passionate debate among pizza lovers. Tender ham and juicy pineapple create a unique combination of flavors. The sweetness of the pineapple contrasts beautifully with the savory richness of the meat. Tomato sauce and mozzarella provide a familiar foundation that ties everything together. The crust is baked until golden and lightly crisp, adding texture to every bite. Each slice offers a refreshing balance between sweetness, saltiness, and creaminess. It is a fun and flavorful option for those who enjoy unexpected combinations.',
    imageUrl:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  },
  {
    title: 'Meat Lovers',
    description:
      'Designed for serious meat enthusiasts, this pizza is loaded with bold and hearty toppings. Pepperoni, sausage, bacon, and seasoned ground beef create an impressive combination of flavors and textures. A layer of tomato sauce helps balance the richness of the meats. Melted mozzarella binds everything together while adding a creamy finish. Each bite delivers a satisfying mix of smoky, savory, and slightly spicy notes. The generous toppings make this one of the most filling options on the menu. Perfect for sharing with friends or enjoying after a long day when only something substantial will do.',
    imageUrl:
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800',
  },
  {
    title: 'Truffle Mushroom',
    description: '',
    imageUrl: '',
  },
  {
    title: 'Spicy Diavola',
    description:
      'A bold Italian-style pizza created for those who enjoy a little heat. Spicy salami brings a robust flavor and a pleasant kick that builds with every bite. Tomato sauce and mozzarella provide a familiar base that balances the spice level. Chili flakes add extra intensity while enhancing the natural flavors of the toppings. The crust is baked until crisp and golden, creating the perfect texture contrast. Despite its heat, the pizza remains balanced and highly enjoyable. It is an excellent choice for adventurous eaters looking for something with personality.',
    imageUrl:
      'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800',
  },
  {
    title: 'Prosciutto e Rucola',
    description:
      'A classic Italian pizza known for its simplicity, elegance, and freshness. Thin slices of prosciutto crudo add a delicate savory flavor that pairs beautifully with melted mozzarella. Fresh arugula is added after baking to preserve its crisp texture and peppery taste. Tomato sauce provides brightness and acidity that balances the richness of the meat. The ingredients work together harmoniously without overwhelming one another. Every bite feels light, refined, and distinctly Mediterranean. It is a favorite among those who appreciate traditional Italian flavors and high-quality ingredients.',
    imageUrl:
      'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800',
  },
  {
    title: 'Smoked Salmon',
    description:
      'A sophisticated pizza inspired by the flavors of classic smoked salmon dishes. Cream cheese forms a smooth and creamy base that complements the seafood perfectly. Premium smoked salmon adds richness and a subtle smoky character. Capers provide bursts of briny flavor that enhance the overall complexity. Thinly sliced red onions contribute freshness and a gentle sharpness. The combination creates a unique and memorable pizza unlike traditional offerings. Ideal for those seeking something elegant, flavorful, and a little different from the usual choices.',
    imageUrl:
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800',
  },
  {
    title: 'Calzone Classico',
    description:
      'A traditional folded Italian pizza that delivers all the flavor of a classic pie in a unique format. The dough is carefully folded around a generous filling of ricotta, mozzarella, ham, and tomato sauce. As it bakes, the ingredients blend together into a rich and comforting mixture. The exterior becomes beautifully golden while the interior remains warm and creamy. Every bite offers a satisfying contrast between crisp crust and soft filling. Its enclosed design helps preserve moisture and intensify the flavors. This hearty specialty is perfect for anyone looking for a filling and authentic Italian meal.',
    imageUrl: '',
  },
]

async function seed() {
  // eslint-disable-next-line no-console
  console.log(`Deliting ${ITEMS.length} items...`)

  await db.delete(items)

  // eslint-disable-next-line no-console
  console.log(`Seeding ${ITEMS.length} items...`)

  await db.insert(items).values(ITEMS)

  // eslint-disable-next-line no-console
  console.log('Done.')
  await client.end()
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
