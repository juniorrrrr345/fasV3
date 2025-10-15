/**
 * Script pour corriger les IDs des catégories et farms sur tous les produits
 */

const API_URL = 'https://thegd33.calitek-junior.workers.dev';

// Mapping des noms vers les IDs
const categoryMapping = {
  'VAPE THC 💨': '2',
  'WEED 🥬🍀': '4',
  '90U TOP 🇲🇦': '5',
  '120u Premium 🥇': '6',
  'CALI CANADA 🇨🇦': '7',
  'FRESH FROZEN ❄️🧊': '8',
  'PLASMASTATIC ⚡️👨🏽‍🔬': '9',
  'SERINGUE THC 💨': '10'
};

const farmMapping = {
  'JUNGLE BOYS 🇺🇸': '1',
  'DELTA CORP ®️ 🇺🇸': '3',
  'PARLAY ™️ By L.A 🇺🇸': '5',
  'GAZ SÉLECTION 🇲🇦 ⛰️': '6',
  'CALI DANK FARMS 🚜👨🏽‍🌾': '7',
  'DABWOODS 🇺🇸': '8'
};

async function fixProducts() {
  console.log('🔧 Correction des IDs des catégories et farms\n');
  
  // Récupérer tous les produits
  const response = await fetch(`${API_URL}/api/products`);
  const products = await response.json();
  
  console.log(`📦 ${products.length} produits à vérifier\n`);
  
  let fixed = 0;
  let errors = 0;
  
  for (const product of products) {
    let needsUpdate = false;
    let newCategory = product.category;
    let newFarm = product.farm;
    
    // Si category est un nom, convertir en ID
    if (categoryMapping[product.category]) {
      newCategory = categoryMapping[product.category];
      needsUpdate = true;
      console.log(`🏷️  ${product.name}: Catégorie "${product.category}" → ID ${newCategory}`);
    }
    
    // Si farm est un nom, convertir en ID
    if (farmMapping[product.farm]) {
      newFarm = farmMapping[product.farm];
      needsUpdate = true;
      console.log(`🌾 ${product.name}: Farm "${product.farm}" → ID ${newFarm}`);
    }
    
    // Mettre à jour si nécessaire
    if (needsUpdate) {
      try {
        const updateResponse = await fetch(`${API_URL}/api/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...product,
            category: newCategory,
            farm: newFarm
          })
        });
        
        if (updateResponse.ok) {
          console.log(`✅ ${product.name} - Corrigé\n`);
          fixed++;
        } else {
          console.log(`❌ ${product.name} - Erreur\n`);
          errors++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ ${product.name} - Erreur: ${error.message}\n`);
        errors++;
      }
    } else {
      console.log(`✓ ${product.name} - Déjà correct (cat:${product.category}, farm:${product.farm})`);
    }
  }
  
  console.log(`\n📊 Résultat:`);
  console.log(`✅ Produits corrigés: ${fixed}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`✓ Déjà corrects: ${products.length - fixed - errors}`);
  console.log(`\n🎉 Correction terminée !`);
}

fixProducts();
