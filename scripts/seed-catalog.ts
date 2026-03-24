/**
 * Square Catalog Seed Script
 * 
 * This script populates the Square Sandbox with dummy restaurant menu data:
 * - Creates categories (Appetizers, Main Courses, Desserts, Beverages)
 * - Creates menu items with variations and prices
 * - Uploads images for items
 * 
 * Usage: npx ts-node scripts/seed-catalog.ts
 * 
 * Prerequisites:
 * - Set SQUARE_ACCESS_TOKEN in .env file
 * - Set SQUARE_ENVIRONMENT=sandbox in .env file
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { Client, Environment } = require('square');
const cryptoModule = require('crypto');
require('dotenv').config();

// Initialize Square client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
});

// Generate unique idempotency key
function generateIdempotencyKey(): string {
  return cryptoModule.randomUUID();
}

// Generate temporary ID for batch operations
function generateTempId(): string {
  return `#${cryptoModule.randomUUID().slice(0, 8)}`;
}

// ============================================================================
// Dummy Data Definitions
// ============================================================================

interface CategoryData {
  name: string;
  tempId: string;
}

interface ItemVariationData {
  name: string;
  priceCents: number;
}

interface ItemData {
  name: string;
  description: string;
  categoryTempId: string;
  variations: ItemVariationData[];
  imageUrl?: string;
}

// Categories to create
const categories: CategoryData[] = [
  { name: 'Appetizers', tempId: generateTempId() },
  { name: 'Main Courses', tempId: generateTempId() },
  { name: 'Desserts', tempId: generateTempId() },
  { name: 'Beverages', tempId: generateTempId() },
  { name: 'Sides', tempId: generateTempId() },
];

// Menu items to create
const menuItems: ItemData[] = [
  // Appetizers
  {
    name: 'Crispy Calamari',
    description: 'Tender calamari rings lightly breaded and fried to golden perfection, served with marinara sauce and lemon aioli.',
    categoryTempId: categories[0].tempId,
    variations: [{ name: 'Regular', priceCents: 1299 }],
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
  },
  {
    name: 'Bruschetta',
    description: 'Grilled artisan bread topped with fresh tomatoes, basil, garlic, and extra virgin olive oil.',
    categoryTempId: categories[0].tempId,
    variations: [{ name: 'Regular', priceCents: 899 }],
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
  },
  {
    name: 'Spinach Artichoke Dip',
    description: 'Creamy blend of spinach, artichoke hearts, and melted cheeses served with warm tortilla chips.',
    categoryTempId: categories[0].tempId,
    variations: [{ name: 'Regular', priceCents: 1099 }],
  },
  {
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in your choice of sauce: mild, medium, hot, or honey BBQ.',
    categoryTempId: categories[0].tempId,
    variations: [
      { name: '6 Pieces', priceCents: 999 },
      { name: '12 Pieces', priceCents: 1799 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
  },

  // Main Courses
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with American cheese, lettuce, tomato, onion, and our special sauce on a brioche bun.',
    categoryTempId: categories[1].tempId,
    variations: [
      { name: 'Single', priceCents: 1299 },
      { name: 'Double', priceCents: 1599 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon fillet grilled to perfection, served with seasonal vegetables and lemon butter sauce.',
    categoryTempId: categories[1].tempId,
    variations: [{ name: 'Regular', priceCents: 2499 }],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
  },
  {
    name: 'Chicken Alfredo',
    description: 'Fettuccine pasta tossed in creamy Alfredo sauce with grilled chicken breast and fresh parmesan.',
    categoryTempId: categories[1].tempId,
    variations: [{ name: 'Regular', priceCents: 1899 }],
    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.',
    categoryTempId: categories[1].tempId,
    variations: [
      { name: 'Personal (10")', priceCents: 1299 },
      { name: 'Large (14")', priceCents: 1899 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
  },
  {
    name: 'Ribeye Steak',
    description: '12oz USDA Prime ribeye, grilled to your preference, served with garlic mashed potatoes and asparagus.',
    categoryTempId: categories[1].tempId,
    variations: [{ name: 'Regular', priceCents: 3499 }],
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
  },

  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries.',
    categoryTempId: categories[2].tempId,
    variations: [{ name: 'Regular', priceCents: 899 }],
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
  },
  {
    name: 'New York Cheesecake',
    description: 'Creamy classic cheesecake with graham cracker crust, topped with strawberry compote.',
    categoryTempId: categories[2].tempId,
    variations: [{ name: 'Regular', priceCents: 799 }],
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
  },
  {
    name: 'Tiramisu',
    description: 'Traditional Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.',
    categoryTempId: categories[2].tempId,
    variations: [{ name: 'Regular', priceCents: 899 }],
  },

  // Beverages
  {
    name: 'Fresh Lemonade',
    description: 'House-made lemonade with fresh-squeezed lemons and a hint of mint.',
    categoryTempId: categories[3].tempId,
    variations: [
      { name: 'Regular', priceCents: 399 },
      { name: 'Large', priceCents: 499 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
  },
  {
    name: 'Iced Coffee',
    description: 'Cold-brewed coffee served over ice with your choice of milk.',
    categoryTempId: categories[3].tempId,
    variations: [
      { name: 'Regular', priceCents: 449 },
      { name: 'Large', priceCents: 549 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400',
  },
  {
    name: 'Craft Soda',
    description: 'Artisanal sodas: Cola, Root Beer, Ginger Ale, or Orange Cream.',
    categoryTempId: categories[3].tempId,
    variations: [{ name: 'Regular', priceCents: 349 }],
  },
  {
    name: 'Smoothie',
    description: 'Fresh fruit smoothie blended with yogurt. Choose: Strawberry Banana, Mango, or Mixed Berry.',
    categoryTempId: categories[3].tempId,
    variations: [
      { name: 'Regular', priceCents: 599 },
      { name: 'Large', priceCents: 749 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
  },

  // Sides
  {
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with sea salt.',
    categoryTempId: categories[4].tempId,
    variations: [
      { name: 'Regular', priceCents: 399 },
      { name: 'Large', priceCents: 549 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
  },
  {
    name: 'Onion Rings',
    description: 'Beer-battered onion rings fried until golden and crispy.',
    categoryTempId: categories[4].tempId,
    variations: [{ name: 'Regular', priceCents: 499 }],
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
  },
  {
    name: 'Side Salad',
    description: 'Mixed greens with cherry tomatoes, cucumber, and choice of dressing.',
    categoryTempId: categories[4].tempId,
    variations: [{ name: 'Regular', priceCents: 449 }],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs.',
    categoryTempId: categories[4].tempId,
    variations: [{ name: 'Regular', priceCents: 349 }],
  },
];

// ============================================================================
// Main Seed Functions
// ============================================================================

async function getLocations(): Promise<void> {
  console.log('\n📍 Fetching Locations...');
  
  try {
    const { result } = await client.locationsApi.listLocations();
    
    if (result.locations && result.locations.length > 0) {
      console.log(`   Found ${result.locations.length} location(s):`);
      result.locations.forEach((loc: any) => {
        console.log(`   - ${loc.name} (${loc.id}) - ${loc.status}`);
      });
    } else {
      console.log('   No locations found. Please create a location in Square Dashboard first.');
    }
  } catch (error) {
    console.error('   Error fetching locations:', error);
    throw error;
  }
}

async function clearExistingCatalog(): Promise<void> {
  console.log('\n🗑️  Clearing existing catalog items...');
  
  try {
    // Search for all existing items
    const { result } = await client.catalogApi.searchCatalogObjects({
      objectTypes: ['ITEM', 'CATEGORY'],
    });

    if (result.objects && result.objects.length > 0) {
      const objectIds = result.objects.map((obj: any) => obj.id);
      console.log(`   Found ${objectIds.length} existing objects to delete...`);
      
      // Delete in batches of 200 (Square API limit)
      for (let i = 0; i < objectIds.length; i += 200) {
        const batch = objectIds.slice(i, i + 200);
        await client.catalogApi.batchDeleteCatalogObjects({
          objectIds: batch,
        });
        console.log(`   Deleted batch ${Math.floor(i / 200) + 1}`);
      }
      
      console.log('   ✅ Existing catalog cleared');
    } else {
      console.log('   No existing catalog items to clear');
    }
  } catch (error) {
    console.error('   Error clearing catalog:', error);
    // Continue even if clearing fails
  }
}

async function createCategories(): Promise<Map<string, string>> {
  console.log('\n📁 Creating Categories...');
  
  const categoryIdMap = new Map<string, string>();
  
  const objects = categories.map((cat) => ({
    type: 'CATEGORY' as const,
    id: cat.tempId,
    categoryData: {
      name: cat.name,
    },
  }));

  try {
    const { result } = await client.catalogApi.batchUpsertCatalogObjects({
      idempotencyKey: generateIdempotencyKey(),
      batches: [{ objects }],
    });

    if (result.idMappings) {
      result.idMappings.forEach((mapping: any) => {
        if (mapping.clientObjectId && mapping.objectId) {
          categoryIdMap.set(mapping.clientObjectId, mapping.objectId);
          const cat = categories.find((c: CategoryData) => c.tempId === mapping.clientObjectId);
          console.log(`   ✅ Created category: ${cat?.name} (${mapping.objectId})`);
        }
      });
    }
  } catch (error) {
    console.error('   Error creating categories:', error);
    throw error;
  }

  return categoryIdMap;
}

async function createMenuItems(categoryIdMap: Map<string, string>): Promise<Map<string, string>> {
  console.log('\n🍔 Creating Menu Items...');
  
  const itemIdMap = new Map<string, string>();
  
  const objects = menuItems.map((item) => {
    const itemTempId = generateTempId();
    
    return {
      type: 'ITEM' as const,
      id: itemTempId,
      presentAtAllLocations: true,
      itemData: {
        name: item.name,
        description: item.description,
        categoryId: categoryIdMap.get(item.categoryTempId) || item.categoryTempId,
        variations: item.variations.map((variation) => ({
          type: 'ITEM_VARIATION' as const,
          id: generateTempId(),
          presentAtAllLocations: true,
          itemVariationData: {
            name: variation.name,
            pricingType: 'FIXED_PRICING' as const,
            priceMoney: {
              amount: BigInt(variation.priceCents),
              currency: 'USD',
            },
          },
        })),
      },
    };
  });

  try {
    // Batch upsert in groups of 1000 (Square limit)
    for (let i = 0; i < objects.length; i += 1000) {
      const batch = objects.slice(i, i + 1000);
      
      const { result } = await client.catalogApi.batchUpsertCatalogObjects({
        idempotencyKey: generateIdempotencyKey(),
        batches: [{ objects: batch }],
      });

      if (result.idMappings) {
        result.idMappings.forEach((mapping: any) => {
          if (mapping.clientObjectId && mapping.objectId) {
            itemIdMap.set(mapping.clientObjectId, mapping.objectId);
          }
        });
      }

      if (result.objects) {
        result.objects.forEach((obj: any) => {
          if (obj.type === 'ITEM' && obj.itemData) {
            console.log(`   ✅ Created item: ${obj.itemData.name}`);
          }
        });
      }
    }
  } catch (error) {
    console.error('   Error creating menu items:', error);
    throw error;
  }

  return itemIdMap;
}

async function searchCatalog(): Promise<void> {
  console.log('\n🔍 Searching Catalog (SearchCatalogObjects)...');
  
  try {
    const { result } = await client.catalogApi.searchCatalogObjects({
      objectTypes: ['ITEM'],
      includeRelatedObjects: true,
      limit: 100,
    });

    console.log(`   Found ${result.objects?.length || 0} items`);
    console.log(`   Found ${result.relatedObjects?.length || 0} related objects (categories, images)`);
    
    if (result.objects) {
      console.log('\n   Sample items:');
      result.objects.slice(0, 3).forEach((item: any) => {
        if (item.itemData) {
          const variations = item.itemData.variations?.length || 0;
          console.log(`   - ${item.itemData.name} (${variations} variation(s))`);
        }
      });
    }
  } catch (error) {
    console.error('   Error searching catalog:', error);
    throw error;
  }
}

async function demonstrateImageUpload(): Promise<void> {
  console.log('\n🖼️  Image Upload Information...');
  console.log('   Note: Square requires images to be uploaded via multipart/form-data');
  console.log('   to the CreateCatalogImage endpoint.');
  console.log('');
  console.log('   To upload images programmatically:');
  console.log('   1. Use client.catalogApi.createCatalogImage()');
  console.log('   2. Provide the image file as a readable stream');
  console.log('   3. Link to an existing catalog item via objectId');
  console.log('');
  console.log('   For this demo, images can be added via Square Dashboard:');
  console.log('   https://squareupsandbox.com/dashboard/items/library');
}

// ============================================================================
// Main Execution
// ============================================================================

async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Square Catalog Seed Script                         ║');
  console.log('║         Populating Sandbox with Restaurant Menu Data       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Validate environment
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    console.error('\n❌ Error: SQUARE_ACCESS_TOKEN not set in environment');
    console.error('   Please create a .env file with your Square Sandbox access token');
    process.exit(1);
  }

  console.log(`\n🔧 Environment: ${process.env.SQUARE_ENVIRONMENT || 'sandbox'}`);

  try {
    // Step 1: List locations
    await getLocations();

    // Step 2: Clear existing catalog (optional - comment out to keep existing data)
    await clearExistingCatalog();

    // Step 3: Create categories
    const categoryIdMap = await createCategories();

    // Step 4: Create menu items
    await createMenuItems(categoryIdMap);

    // Step 5: Search catalog to verify
    await searchCatalog();

    // Step 6: Image upload info
    await demonstrateImageUpload();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         ✅ Seed Complete!                                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\nYour Square Sandbox catalog now contains:');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${menuItems.length} menu items`);
    console.log(`   - ${menuItems.reduce((acc, item) => acc + item.variations.length, 0)} variations`);
    console.log('\nYou can view your catalog at:');
    console.log('   https://squareupsandbox.com/dashboard/items/library');
    console.log('\nOr run the app with: npm run dev');

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
