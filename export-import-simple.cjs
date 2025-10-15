#!/usr/bin/env node

const https = require('https')

const API_URL = 'https://oglegacy-api.calitek-junior.workers.dev'

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============ ETAPE 1 : EXPORT ============
async function exportData() {
  console.log('╔═══════════════════════════════════════════════════════╗')
  console.log('║                                                       ║')
  console.log('║  📤 ÉTAPE 1 : EXPORT depuis GD33V2                   ║')
  console.log('║                                                       ║')
  console.log('╚═══════════════════════════════════════════════════════╝\n')
  
  console.log('⚠️  Vérifiez que wrangler.toml pointe vers GD33V2 !\n')
  
  const data = {}
  
  try {
    console.log('📦 Téléchargement des produits...')
    data.products = await fetchJSON(`${API_URL}/api/products`)
    console.log(`   ✅ ${data.products.length} produit(s)\n`)
    
    console.log('🏷️  Téléchargement des catégories...')
    data.categories = await fetchJSON(`${API_URL}/api/categories`)
    console.log(`   ✅ ${data.categories.length} catégorie(s)\n`)
    
    console.log('🌾 Téléchargement des farms...')
    data.farms = await fetchJSON(`${API_URL}/api/farms`)
    console.log(`   ✅ ${data.farms.length} farm(s)\n`)
    
    console.log('🌐 Téléchargement des réseaux sociaux...')
    data.socials = await fetchJSON(`${API_URL}/api/socials`)
    console.log(`   ✅ ${data.socials.length} réseau(x)\n`)
    
    console.log('⚙️  Téléchargement des paramètres...')
    data.settings = await fetchJSON(`${API_URL}/api/settings`)
    console.log(`   ✅ ${data.settings.length} paramètre(s)\n`)
    
    // Sauvegarder
    const fs = require('fs')
    fs.writeFileSync('export-gd33v2.json', JSON.stringify(data, null, 2))
    
    console.log('💾 Export sauvegardé dans : export-gd33v2.json\n')
    console.log('╔═══════════════════════════════════════════════════════╗')
    console.log('║                                                       ║')
    console.log('║  ✅ EXPORT TERMINÉ !                                 ║')
    console.log('║                                                       ║')
    console.log('╚═══════════════════════════════════════════════════════╝\n')
    
    console.log('📝 MAINTENANT :\n')
    console.log('1. Modifiez wrangler.toml :')
    console.log('   database_name = "gd33v3"')
    console.log('   database_id = "86c41062-615a-43e3-ba18-f7fd4b0ca9aa"\n')
    console.log('2. Déployez : npx wrangler deploy\n')
    console.log('3. Relancez ce script pour importer !\n')
    
    return true
  } catch (error) {
    console.error('❌ Erreur export:', error.message)
    return false
  }
}

// ============ ETAPE 2 : IMPORT ============
async function importData(data) {
  console.log('╔═══════════════════════════════════════════════════════╗')
  console.log('║                                                       ║')
  console.log('║  📥 ÉTAPE 2 : IMPORT vers gd33v3                     ║')
  console.log('║                                                       ║')
  console.log('╚═══════════════════════════════════════════════════════╝\n')
  
  console.log('⚠️  Vérifiez que wrangler.toml pointe vers gd33v3 !\n')
  
  try {
    // Farms (d'abord)
    if (data.farms && data.farms.length > 0) {
      console.log(`🌾 Import de ${data.farms.length} farm(s)...`)
      for (const farm of data.farms) {
        await postJSON(`${API_URL}/api/farms`, farm)
        await sleep(100)
      }
      console.log('   ✅ Farms importées\n')
    }
    
    // Categories
    if (data.categories && data.categories.length > 0) {
      console.log(`🏷️  Import de ${data.categories.length} catégorie(s)...`)
      for (const cat of data.categories) {
        await postJSON(`${API_URL}/api/categories`, cat)
        await sleep(100)
      }
      console.log('   ✅ Catégories importées\n')
    }
    
    // Products
    if (data.products && data.products.length > 0) {
      console.log(`📦 Import de ${data.products.length} produit(s)...`)
      let count = 0
      for (const product of data.products) {
        await postJSON(`${API_URL}/api/products`, product)
        count++
        console.log(`   [${count}/${data.products.length}] ${product.name}`)
        await sleep(200)
      }
      console.log('   ✅ Produits importés\n')
    }
    
    // Socials
    if (data.socials && data.socials.length > 0) {
      console.log(`🌐 Import de ${data.socials.length} réseau(x)...`)
      for (const social of data.socials) {
        await postJSON(`${API_URL}/api/socials`, social)
        await sleep(100)
      }
      console.log('   ✅ Réseaux sociaux importés\n')
    }
    
    // Settings
    if (data.settings && data.settings.length > 0) {
      console.log(`⚙️  Import de ${data.settings.length} paramètre(s)...`)
      for (const setting of data.settings) {
        await postJSON(`${API_URL}/api/settings`, setting)
        await sleep(100)
      }
      console.log('   ✅ Paramètres importés\n')
    }
    
    console.log('╔═══════════════════════════════════════════════════════╗')
    console.log('║                                                       ║')
    console.log('║  🎉 MIGRATION COMPLÈTE !                             ║')
    console.log('║                                                       ║')
    console.log('╚═══════════════════════════════════════════════════════╝\n')
    
    console.log('✅ Base gd33v3 contient maintenant toutes les données !')
    console.log('   Allez sur https://thegd-33-v3.vercel.app\n')
    
    return true
  } catch (error) {
    console.error('❌ Erreur import:', error.message)
    return false
  }
}

// ============ PROGRAMME PRINCIPAL ============
async function main() {
  const fs = require('fs')
  
  // Si export existe, on importe
  if (fs.existsSync('export-gd33v2.json')) {
    const data = JSON.parse(fs.readFileSync('export-gd33v2.json', 'utf-8'))
    await importData(data)
  } else {
    // Sinon on exporte
    await exportData()
  }
}

main()