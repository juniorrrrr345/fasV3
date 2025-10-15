/**
 * Script de Migration D1
 * Migre les données de l'ancienne base vers la nouvelle
 */

const { execSync } = require('child_process');

// IDs des bases de données
const OLD_DB_ID = 'b38148fa-7325-4c06-99a3-ebeed3c8ea6f'; // Ancienne base
const NEW_DB_ID = '898fdea8-206c-4552-80f3-fe79511e26f5'; // Nouvelle base (gd33v3)

console.log('🔄 Migration des données D1...\n');

// Tables à migrer
const tables = ['products', 'categories', 'socials', 'settings', 'farms'];

/**
 * Exécute une commande wrangler et retourne le résultat
 */
function executeQuery(dbId, query, description) {
  console.log(`📊 ${description}...`);
  try {
    const result = execSync(
      `npx wrangler d1 execute ${dbId} --command "${query.replace(/"/g, '\\"')}"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    return result;
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    return null;
  }
}

/**
 * Exporte les données d'une table depuis l'ancienne base
 */
function exportTable(tableName) {
  console.log(`\n📤 Export de la table: ${tableName}`);
  
  const query = `SELECT * FROM ${tableName}`;
  const result = executeQuery(OLD_DB_ID, query, `Lecture de ${tableName}`);
  
  if (!result) {
    console.log(`⚠️  Table ${tableName} vide ou inexistante`);
    return [];
  }
  
  console.log(`✅ ${tableName} exportée`);
  return result;
}

/**
 * Compte les enregistrements dans une table
 */
function countRecords(dbId, tableName) {
  const result = executeQuery(dbId, `SELECT COUNT(*) as count FROM ${tableName}`, `Comptage ${tableName}`);
  if (!result) return 0;
  
  // Parser le résultat pour extraire le nombre
  const match = result.match(/count.*?(\d+)/i);
  return match ? parseInt(match[1]) : 0;
}

// Afficher le contenu de l'ancienne base
console.log('📋 Contenu de l\'ancienne base:\n');
tables.forEach(table => {
  const count = countRecords(OLD_DB_ID, table);
  console.log(`  - ${table}: ${count} enregistrement(s)`);
});

console.log('\n📋 Contenu de la nouvelle base (avant migration):\n');
tables.forEach(table => {
  const count = countRecords(NEW_DB_ID, table);
  console.log(`  - ${table}: ${count} enregistrement(s)`);
});

console.log('\n❓ Voulez-vous continuer la migration ?');
console.log('   Pour continuer, utilisez : node migrer-ancienne-base.cjs --migrate\n');

// Si --migrate est passé en argument, faire la migration
if (process.argv.includes('--migrate')) {
  console.log('\n🚀 Début de la migration...\n');
  
  // Pour l'instant, on affiche juste les données
  // La migration complète nécessiterait d'exporter en JSON puis réimporter
  
  console.log('⚠️  Migration automatique en développement');
  console.log('📝 Pour migrer manuellement:');
  console.log('\n1. Exportez chaque table de l\'ancienne base:');
  tables.forEach(table => {
    console.log(`   npx wrangler d1 execute ${OLD_DB_ID} --command "SELECT * FROM ${table}"`);
  });
  
  console.log('\n2. Ou utilisez le script migrer-donnees.cjs qui existe déjà');
}

console.log('\n✅ Script terminé');
