#!/usr/bin/env node

const https = require('https')
const { execSync } = require('child_process')
const fs = require('fs')

const API_URL = 'https://thegd33.calitek-junior.workers.dev'
const OLD_DB_NAME = 'GD33V2'
const NEW_DB_NAME = 'gd33v3'

// ============ HELPERS ============
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

function postJSON(url, payload) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const data = JSON.stringify(payload)
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
    
    const req = https.request(options, (res) => {
      let responseData = ''
      res.on('data', chunk => responseData += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData))
        } catch (e) {
          resolve(responseData)
        }
      })
    })
    
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function updateWranglerToml(dbName, dbId) {
  const content = `name = "thegd33"
main = "worker/index.js"
compatibility_date = "2024-01-01"

# Cloudflare D1 Database
[[d1_databases]]
binding = "DB"
database_name = "${dbName}"
database_id = "${dbId}"

# Cloudflare R2 Storage
[[r2_buckets]]
binding = "R2"
bucket_name = "boutiqueop"
`
  fs.writeFileSync('wrangler.toml', content)
  console.log(`   ✅ wrangler.toml → ${dbName}\n`)
}

function deployWorker() {
  console.log('   🚀 Déploiement du worker...')
  try {
    execSync('npx wrangler deploy', { encoding: 'utf-8', stdio: 'inherit' })
    console.log('   ✅ Worker déployé\n')
    return true
  } catch (error) {
    console.error('   ❌ Erreur déploiement')
    return false
  }
}

// ============ ADAPTATION DES DONNÉES ============
function adaptProduct(oldProduct) {
  return {
    id: oldProduct.id?.toString() || Date.now().toString(),
    name: oldProduct.name || 'Produit sans nom',
    description: oldProduct.description || '',
    category: oldProduct.category_id?.toString() || '',
    farm: oldProduct.farm_id?.toString() || '',
    photo: oldProduct.image_url || '',
    video: oldProduct.video_url || '',
    medias: oldProduct.image_url ? JSON.stringify([{ type: 'image', url: oldProduct.image_url }]) : '[]',
    variants: oldProduct.prices || '{}',
    price: oldProduct.price?.toString() || '0',
    createdAt: oldProduct.created_at || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

function adaptCategory(oldCat) {
  return {
    id: oldCat.id?.toString() || Date.now().toString(),
    name: oldCat.name || 'Catégorie',
    icon: oldCat.icon || '📦',
    description: oldCat.description || ''
  }
}

function adaptFarm(oldFarm) {
  return {
    id: oldFarm.id?.toString() || Date.now().toString(),
    name: oldFarm.name || 'Farm',
    image: oldFarm.logo || oldFarm.image || '',
    description: oldFarm.description || ''
  }
}

function adaptSocial(oldSocial) {
  return {
    id: oldSocial.id?.toString() || Date.now().toString(),
    name: oldSocial.name || 'Réseau',
    icon: oldSocial.icon || '🌐',
    description: oldSocial.description || '',
    url: oldSocial.url || ''
  }
}

// ============ ETAPE 1 : EXPORT ============
async function exportFromGD33V2() {
  console.log('╔═══════════════════════════════════════════════════════╗')
  console.log('║                                                       ║')
  console.log('║  📤 ÉTAPE 1/2 : EXPORT depuis GD33V2                 ║')
  console.log('║                                                       ║')
  console.log('╚═══════════════════════════════════════════════════════╝\n')
  
  console.log('📝 Configuration pour GD33V2...\n')
  updateWranglerToml('GD33V2', 'b38148fa-7325-4c06-99a3-ebeed3c8ea6f')
  
  if (!deployWorker()) {
    console.error('❌ Déploiement échoué')
    return false
  }
  
  console.log('⏳ Attente 5 secondes pour propagation...\n')
  await sleep(5000)
  
  console.log('🔄 Téléchargement des données...\n')
  
  const data = {}
  
  try {
    console.log('📦 Produits...')
    data.products = await fetchJSON(`${API_URL}/api/products`)
    console.log(`   ✅ ${data.products.length} produit(s)\n`)
    
    console.log('🏷️  Catégories...')
    data.categories = await fetchJSON(`${API_URL}/api/categories`)
    console.log(`   ✅ ${data.categories.length} catégorie(s)\n`)
    
    console.log('🌾 Farms...')
    data.farms = await fetchJSON(`${API_URL}/api/farms`)
    console.log(`   ✅ ${data.farms.length} farm(s)\n`)
    
    console.log('🌐 Réseaux sociaux...')
    data.socials = await fetchJSON(`${API_URL}/api/socials`)
    console.log(`   ✅ ${data.socials.length} réseau(x)\n`)
    
    console.log('⚙️  Paramètres...')
    data.settings = await fetchJSON(`${API_URL}/api/settings`)
    console.log(`   ✅ ${data.settings.length} paramètre(s)\n`)
    
    // Sauvegarder
    fs.writeFileSync('export-gd33v2.json', JSON.stringify(data, null, 2))
    
    console.log('💾 Export sauvegardé : export-gd33v2.json\n')
    
    return true
  } catch (error) {
    console.error('❌ Erreur export:', error.message)
    return false
  }
}

// ============ ETAPE 2 : IMPORT ============
async function importToGD33V3() {
  console.log('╔═══════════════════════════════════════════════════════╗')
  console.log('║                                                       ║')
  console.log('║  📥 ÉTAPE 2/2 : IMPORT vers gd33v3                   ║')
  console.log('║                                                       ║')
  console.log('╚═══════════════════════════════════════════════════════╝\n')
  
  if (!fs.existsSync('export-gd33v2.json')) {
    console.error('❌ Fichier export-gd33v2.json non trouvé !')
    console.log('   Relancez le script pour faire l\'export d\'abord.\n')
    return false
  }
  
  const data = JSON.parse(fs.readFileSync('export-gd33v2.json', 'utf-8'))
  
  console.log('📝 Configuration pour gd33v3...\n')
  updateWranglerToml('gd33v3', '86c41062-615a-43e3-ba18-f7fd4b0ca9aa')
  
  if (!deployWorker()) {
    console.error('❌ Déploiement échoué')
    return false
  }
  
  console.log('⏳ Attente 5 secondes pour propagation...\n')
  await sleep(5000)
  
  console.log('🔄 Import des données adaptées...\n')
  
  try {
    // Farms
    if (data.farms && data.farms.length > 0) {
      console.log(`🌾 Import ${data.farms.length} farm(s)...`)
      for (const farm of data.farms) {
        const adapted = adaptFarm(farm)
        await postJSON(`${API_URL}/api/farms`, adapted)
        await sleep(200)
      }
      console.log('   ✅ Farms importées\n')
    }
    
    // Categories
    if (data.categories && data.categories.length > 0) {
      console.log(`🏷️  Import ${data.categories.length} catégorie(s)...`)
      for (const cat of data.categories) {
        const adapted = adaptCategory(cat)
        await postJSON(`${API_URL}/api/categories`, adapted)
        await sleep(200)
      }
      console.log('   ✅ Catégories importées\n')
    }
    
    // Products
    if (data.products && data.products.length > 0) {
      console.log(`📦 Import ${data.products.length} produit(s)...`)
      let count = 0
      for (const product of data.products) {
        const adapted = adaptProduct(product)
        await postJSON(`${API_URL}/api/products`, adapted)
        count++
        console.log(`   [${count}/${data.products.length}] ${adapted.name}`)
        await sleep(300)
      }
      console.log('   ✅ Produits importés\n')
    }
    
    // Socials
    if (data.socials && data.socials.length > 0) {
      console.log(`🌐 Import ${data.socials.length} réseau(x)...`)
      for (const social of data.socials) {
        const adapted = adaptSocial(social)
        await postJSON(`${API_URL}/api/socials`, adapted)
        await sleep(200)
      }
      console.log('   ✅ Réseaux sociaux importés\n')
    }
    
    // Settings
    if (data.settings && data.settings.length > 0) {
      console.log(`⚙️  Import ${data.settings.length} paramètre(s)...`)
      for (const setting of data.settings) {
        await postJSON(`${API_URL}/api/settings`, setting)
        await sleep(200)
      }
      console.log('   ✅ Paramètres importés\n')
    }
    
    console.log('╔═══════════════════════════════════════════════════════╗')
    console.log('║                                                       ║')
    console.log('║  🎉 MIGRATION COMPLÈTE !                             ║')
    console.log('║                                                       ║')
    console.log('╚═══════════════════════════════════════════════════════╝\n')
    
    console.log('✅ Tous vos produits de GD33V2 sont maintenant dans gd33v3 !')
    console.log('   Allez sur https://thegd-33-v3.vercel.app\n')
    
    return true
  } catch (error) {
    console.error('❌ Erreur import:', error.message)
    return false
  }
}

// ============ PROGRAMME PRINCIPAL ============
async function main() {
  console.log('\n🎯 MIGRATION AUTOMATIQUE EN 2 ÉTAPES\n')
  console.log('Cette migration va :')
  console.log('1. Exporter depuis GD33V2 (via API)')
  console.log('2. Importer vers gd33v3 (via API)\n')
  console.log('Le script change automatiquement wrangler.toml et déploie.\n')
  console.log('───────────────────────────────────────────────────────\n')
  
  // ÉTAPE 1 : Export
  console.log('▶️  Étape 1 : Export depuis GD33V2...\n')
  const exportOk = await exportFromGD33V2()
  
  if (!exportOk) {
    console.error('❌ Export échoué. Arrêt.')
    process.exit(1)
  }
  
  console.log('⏸️  Appuyez sur ENTRÉE pour continuer avec l\'import...')
  console.log('   (Ou Ctrl+C pour annuler)\n')
  
  // Attendre l'utilisateur
  await new Promise(resolve => {
    process.stdin.once('data', resolve)
  })
  
  // ÉTAPE 2 : Import
  console.log('\n▶️  Étape 2 : Import vers gd33v3...\n')
  const importOk = await importToGD33V3()
  
  if (!importOk) {
    console.error('❌ Import échoué.')
    process.exit(1)
  }
  
  console.log('🎊 TOUT EST FAIT ! Votre boutique THEGD33 est prête ! 🎊\n')
}

main().catch(error => {
  console.error('\n❌ Erreur fatale:', error.message)
  process.exit(1)
})