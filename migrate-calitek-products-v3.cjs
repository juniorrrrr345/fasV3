const { execSync } = require('child_process');

const OLD_DB = 'CALITEK';
const NEW_DB = 'calitekv3-db';

console.log('🚀 Migration des produits CALITEK vers CalitekV3...\n');

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
    // Échapper TOUS les caractères spéciaux
    const cleanString = (str) => {
      if (!str) return '';
      return str
        .replace(/\\/g, '\\\\')  // Backslash
        .replace(/'/g, "''")      // Apostrophes
        .replace(/\n/g, ' ')      // Retours à la ligne
        .replace(/\r/g, '')       // Retours chariot
        .replace(/\t/g, ' ');     // Tabulations
    };
    
    const name = cleanString(product.name);
    const description = cleanString(product.description);
    const photo = product.image_url || '';
    const video = product.video_url || '';
    const variants = cleanString(product.prices || '{}');
    
    const sql = `INSERT OR REPLACE INTO products (id, name, description, category, farm, photo, video, medias, variants, price, createdAt, updatedAt) VALUES ('${product.id}', '${name}', '${description}', '${product.category_id || ''}', '${product.farm_id || ''}', '${photo}', '${video}', '[]', '${variants}', '0', datetime('now'), datetime('now'));`;
    
    execSync(`wrangler d1 execute ${NEW_DB} --command="${sql}" --remote`, { stdio: 'pipe' });
    
    successCount++;
    console.log(`✅ [${index + 1}/${products.length}] ${product.id} - ${product.name.substring(0, 30)}`);
    
  } catch (error) {
    errorCount++;
    console.error(`❌ [${index + 1}/${products.length}] ${product.id} - ${product.name.substring(0, 30)}`);
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   ✅ Réussis: ${successCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);
console.log(`\n✅ Migration terminée !`);