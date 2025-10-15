const { execSync } = require('child_process');

const OLD_DB = 'CALITEK';
const NEW_DB = 'calitekv3-db';

console.log('🚀 Migration CORRECTE des produits CALITEK...\n');

// Supprimer tous les produits
console.log('🗑️  Suppression des anciens produits...');
execSync(`wrangler d1 execute ${NEW_DB} --command="DELETE FROM products;" --remote`, { stdio: 'pipe' });

// Récupérer les produits
const result = execSync(
  `wrangler d1 execute ${OLD_DB} --command="SELECT * FROM products ORDER BY id;" --remote --json`,
  { encoding: 'utf8' }
);

const data = JSON.parse(result);
const products = data[0].results;

console.log(`📦 ${products.length} produits trouvés\n`);

let successCount = 0;
let errorCount = 0;

products.forEach((product, index) => {
  try {
    const name = (product.name || '').replace(/'/g, "''").replace(/\n/g, ' ').replace(/\r/g, '');
    const description = (product.description || '').replace(/'/g, "''").replace(/\n/g, ' ').replace(/\r/g, '');
    const photo = product.image_url || '';
    const video = product.video_url || '';
    
    // IMPORTANT : Garder le JSON intact, juste échapper les apostrophes simples
    const variants = (product.prices || '{}').replace(/'/g, "''");
    
    const sql = `INSERT INTO products (id, name, description, category, farm, photo, video, medias, variants, price, createdAt, updatedAt) VALUES ('${product.id}', '${name}', '${description}', '${product.category_id || ''}', '${product.farm_id || ''}', '${photo}', '${video}', '[]', '${variants}', '0', datetime('now'), datetime('now'));`;
    
    execSync(`wrangler d1 execute ${NEW_DB} --command="${sql}" --remote`, { stdio: 'pipe' });
    
    successCount++;
    console.log(`✅ [${index + 1}/${products.length}] ${product.id} - ${product.name.substring(0, 30)}`);
    
  } catch (error) {
    errorCount++;
    console.error(`❌ [${index + 1}/${products.length}] ${product.id}`);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   ✅ Réussis: ${successCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);
console.log(`\n✅ Migration terminée !`);