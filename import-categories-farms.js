/**
 * Script d'Import des Catégories et Farms vers gd33v3
 */

const API_URL = 'https://thegd33.calitek-junior.workers.dev';

// Données des catégories
const categories = [
  {id: 2, name: "VAPE THC 💨", icon: "📦", description: "Vapes THC premium"},
  {id: 4, name: "WEED 🥬🍀", icon: "📦", description: "Weed de qualité"},
  {id: 5, name: "90U TOP 🇲🇦", icon: "📦", description: "Hash 90U"},
  {id: 6, name: "120u Premium 🥇", icon: "📦", description: "Hash 120U Premium"},
  {id: 7, name: "CALI CANADA 🇨🇦", icon: "🏷️", description: "Weed Cali & Canada"},
  {id: 8, name: "FRESH FROZEN ❄️🧊", icon: "🏷️", description: "Fresh Frozen Hash"},
  {id: 9, name: "PLASMASTATIC ⚡️👨🏽‍🔬", icon: "🏷️", description: "Plasmastatic Hash"},
  {id: 10, name: "SERINGUE THC 💨", icon: "🏷️", description: "Seringues THC"}
];

// Données des farms
const farms = [
  {id: 1, name: "JUNGLE BOYS 🇺🇸", description: "Production GD33", image: ""},
  {id: 3, name: "DELTA CORP ®️ 🇺🇸", description: "Production GD33", image: ""},
  {id: 5, name: "PARLAY ™️ By L.A 🇺🇸", description: "Production GD33", image: ""},
  {id: 6, name: "GAZ SÉLECTION 🇲🇦 ⛰️", description: "Production GD33", image: ""},
  {id: 7, name: "CALI DANK FARMS 🚜👨🏽‍🌾", description: "Premium Cali weed", image: ""},
  {id: 8, name: "DABWOODS 🇺🇸", description: "Vapes THC premium", image: ""}
];

async function importerCategories() {
  console.log(`\n📂 Import de ${categories.length} catégories\n`);
  
  let succes = 0;
  let erreurs = 0;
  
  for (const cat of categories) {
    console.log(`🏷️  Import: ${cat.name}`);
    
    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: cat.id.toString(),
          name: cat.name,
          icon: cat.icon,
          description: cat.description
        })
      });
      
      if (response.ok) {
        console.log(`✅ ${cat.name} - OK`);
        succes++;
      } else {
        const error = await response.text();
        console.log(`❌ ${cat.name} - Erreur: ${error}`);
        erreurs++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ ${cat.name} - Erreur: ${error.message}`);
      erreurs++;
    }
  }
  
  console.log(`\n📊 Catégories:`);
  console.log(`✅ Succès: ${succes}`);
  console.log(`❌ Erreurs: ${erreurs}`);
}

async function importerFarms() {
  console.log(`\n🌾 Import de ${farms.length} farms\n`);
  
  let succes = 0;
  let erreurs = 0;
  
  for (const farm of farms) {
    console.log(`🚜 Import: ${farm.name}`);
    
    try {
      const response = await fetch(`${API_URL}/api/farms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: farm.id.toString(),
          name: farm.name,
          description: farm.description,
          image: farm.image
        })
      });
      
      if (response.ok) {
        console.log(`✅ ${farm.name} - OK`);
        succes++;
      } else {
        const error = await response.text();
        console.log(`❌ ${farm.name} - Erreur: ${error}`);
        erreurs++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ ${farm.name} - Erreur: ${error.message}`);
      erreurs++;
    }
  }
  
  console.log(`\n📊 Farms:`);
  console.log(`✅ Succès: ${succes}`);
  console.log(`❌ Erreurs: ${erreurs}`);
}

async function main() {
  console.log('🚀 Import Catégories & Farms vers gd33v3');
  console.log('=========================================\n');
  
  await importerCategories();
  await importerFarms();
  
  console.log('\n🎉 Import complet terminé !');
  console.log('\n🔍 Vérifier :');
  console.log(`   Catégories: ${API_URL}/api/categories`);
  console.log(`   Farms: ${API_URL}/api/farms`);
  console.log(`   Produits: ${API_URL}/api/products`);
}

main();
