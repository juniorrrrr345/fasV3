const fs = require('fs');
const { execSync } = require('child_process');

const NEW_DB = 'calitekv3-db';

// Lire l'export
const data = JSON.parse(fs.readFileSync('export-produits-calitek.txt', 'utf8'));
const products = data[0].results;

console.log(`🚀 Migration de ${products.length} produits vers CalitekV3...\n`);

let successCount = 0;
let errorCount = 0;

products.forEach((product, index) => {
  try {
    // Échapper les apostrophes
    const data = JSON.parse(fs.readFileSync('produits.json', 'utf8'));
    const description = (product.description || '').replace(/'/g, "''");
    const photo = product.image_url || '';
    const video = product.video_url || '';
    const variants = (product.prices || '{}').replace(/'/g, "''");
    
    const sql = `INSERT OR REPLACE INTO products (id, name, description, category, farm, photo, video, medias, variants, price, createdAt, updatedAt) VALUES ('${product.id}', '${name}', '${description}', '${product.category_id || ''}', '${product.farm_id || ''}', '${photo}', '${video}', '[]', '${variants}', '0', datetime('now'), datetime('now'));`;
    
    execSync(`wrangler d1 execute ${NEW_DB} --command="${sql}" --remote`, { stdio: 'pipe' });
    
    successCount++;
    console.log(`✅ [${index + 1}/${products.length}] ${product.id} - ${product.name}`);
    
  } catch (error) {
    errorCount++;
    console.error(`❌ [${index + 1}/${products.length}] Erreur ${product.id}:`, error.message);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   ✅ Réussis: ${successCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);
console.log(`\n✅ Migration terminée !`);