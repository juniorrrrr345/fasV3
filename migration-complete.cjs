/**
 * Script de Migration Complète D1
 * Migre TOUTES les données de l'ancienne base vers gd33v3
 */

const { execSync } = require('child_process');
const fs = require('fs');

// IDs des bases de données
const OLD_DB_ID = 'b38148fa-7325-4c06-99a3-ebeed3c8ea6f';
const NEW_DB_ID = '898fdea8-206c-4552-80f3-fe79511e26f5'; // gd33v3

console.log('🔄 MIGRATION COMPLÈTE D1');
console.log('========================\n');
console.log(`📤 Source: ${OLD_DB_ID}`);
console.log(`📥 Destination: ${NEW_DB_ID} (gd33v3)\n`);

/**
 * Exécute une commande wrangler
 */
function executeCommand(command, description) {
  console.log(`⏳ ${description}...`);
  try {
    const result = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    console.log(`✅ ${description} - OK`);
    return result;
  } catch (error) {
    console.error(`❌ ${description} - ERREUR`);
    console.error(error.message);
    return null;
  }
}

// ÉTAPE 1 : Lister les bases disponibles
console.log('📋 ÉTAPE 1 : Vérification des bases D1\n');
executeCommand('npx wrangler d1 list', 'Liste des bases D1');

// ÉTAPE 2 : Exporter chaque table de l'ancienne base
console.log('\n📤 ÉTAPE 2 : Export des tables\n');

const tables = {
  products: [
    'id', 'name', 'description', 'category', 'farm', 
    'photo', 'video', 'medias', 'variants', 'price', 
    'createdAt', 'updatedAt'
  ],
  categories: ['id', 'name', 'icon', 'description'],
  socials: ['id', 'name', 'icon', 'description', 'url'],
  settings: ['key', 'value'],
  farms: ['id', 'name', 'image', 'description'],
  admin_users: ['id', 'username', 'password', 'createdAt', 'updatedAt']
};

const exportedData = {};

// Exporter chaque table
for (const [tableName, columns] of Object.entries(tables)) {
  console.log(`\n📊 Export de: ${tableName}`);
  
  // Compter les enregistrements
  const countCmd = `npx wrangler d1 execute ${OLD_DB_ID} --command "SELECT COUNT(*) as count FROM ${tableName}"`;
  const countResult = executeCommand(countCmd, `Comptage ${tableName}`);
  
  if (!countResult || countResult.includes('error')) {
    console.log(`⚠️  Table ${tableName} vide ou inexistante`);
    continue;
  }
  
  // Extraire les données
  const selectCmd = `npx wrangler d1 execute ${OLD_DB_ID} --command "SELECT * FROM ${tableName}" --json`;
  const selectResult = executeCommand(selectCmd, `Lecture ${tableName}`);
  
  if (selectResult) {
    try {
      // Sauvegarder dans un fichier
      fs.writeFileSync(`export-${tableName}.json`, selectResult);
      console.log(`💾 Sauvegardé dans export-${tableName}.json`);
      exportedData[tableName] = selectResult;
    } catch (error) {
      console.error(`Erreur export ${tableName}:`, error.message);
    }
  }
}

console.log('\n✅ Export terminé !');
console.log('\n📝 Fichiers créés:');
Object.keys(exportedData).forEach(table => {
  console.log(`  - export-${table}.json`);
});

console.log('\n📥 ÉTAPE 3 : Import dans gd33v3\n');
console.log('⚠️  ATTENTION : Cela va AJOUTER les données à gd33v3');
console.log('   (les données existantes seront conservées)\n');

console.log('Pour importer, exécutez:');
console.log('  node migration-complete.cjs --import\n');

// Si --import est passé, faire l'import
if (process.argv.includes('--import')) {
  console.log('\n🚀 Début de l\'import...\n');
  
  for (const [tableName, columns] of Object.entries(tables)) {
    const filename = `export-${tableName}.json`;
    
    if (!fs.existsSync(filename)) {
      console.log(`⚠️  ${filename} n'existe pas, passage à la suivante`);
      continue;
    }
    
    console.log(`\n📥 Import de: ${tableName}`);
    
    try {
      const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
      
      if (!data || !data.results || data.results.length === 0) {
        console.log(`⚠️  Aucune donnée dans ${tableName}`);
        continue;
      }
      
      console.log(`  ${data.results.length} enregistrement(s) à importer`);
      
      // Créer les requêtes INSERT
      for (const row of data.results) {
        const columnNames = Object.keys(row).join(', ');
        const values = Object.values(row).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
          return v;
        }).join(', ');
        
        const insertCmd = `npx wrangler d1 execute ${NEW_DB_ID} --command "INSERT OR REPLACE INTO ${tableName} (${columnNames}) VALUES (${values})"`;
        
        executeCommand(insertCmd, `Insert dans ${tableName}`);
      }
      
      console.log(`✅ ${tableName} importé (${data.results.length} lignes)`);
      
    } catch (error) {
      console.error(`❌ Erreur import ${tableName}:`, error.message);
    }
  }
  
  console.log('\n✅ Import terminé !');
}

console.log('\n🎉 Migration terminée !\n');
