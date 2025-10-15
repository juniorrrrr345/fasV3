#!/usr/bin/env node

const API_URL = 'https://oglegacy-api.calitek-junior.workers.dev'

async function migrateViaAPI() {
  console.log('╔═══════════════════════════════════════════════════════╗')
  console.log('║                                                       ║')
  console.log('║  🔄 MIGRATION GD33V2 → gd33v3 via API                ║')
  console.log('║                                                       ║')
  console.log('╚═══════════════════════════════════════════════════════╝\n')
  
  console.log('⚠️  IMPORTANT : Vous devez d\'abord changer wrangler.toml')
  console.log('    pour pointer vers GD33V2, déployer, exporter, puis')
  console.log('    repointer vers gd33v3 et réimporter.\n')
  console.log('❌ Cette méthode est trop compliquée.\n')
  console.log('───────────────────────────────────────────────────────\n')
  console.log('💡 SOLUTION PLUS SIMPLE :\n')
  console.log('1. Utilisez le panel admin de la boutique 1')
  console.log('2. Copiez manuellement les 34 produits un par un')
  console.log('   OU')
  console.log('3. Je crée un script qui passe par l\'API actuelle\n')
  
  console.log('❓ Préférez-vous que je crée un export/import JSON simple ?')
}

migrateViaAPI()