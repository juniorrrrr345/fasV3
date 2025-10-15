/**
 * Cloudflare Worker API Avec Amour v2
 * Gère : Produits, Catégories, Réseaux Sociaux, Settings, Upload R2
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      // Routes API
      if (path === '/api/init') {
        return handleInit(env, corsHeaders)
      }
      
      // Produits
      if (path === '/api/products') {
        if (request.method === 'GET') return getProducts(env, corsHeaders)
        if (request.method === 'POST') return createProduct(request, env, corsHeaders)
      }
      if (path.startsWith('/api/products/')) {
        const id = path.split('/')[3]
        if (request.method === 'GET') return getProduct(id, env, corsHeaders)
        if (request.method === 'PUT') return updateProduct(id, request, env, corsHeaders)
        if (request.method === 'DELETE') return deleteProduct(id, env, corsHeaders)
      }

      // Catégories
      if (path === '/api/categories') {
        if (request.method === 'GET') return getCategories(env, corsHeaders)
        if (request.method === 'POST') return createCategory(request, env, corsHeaders)
      }
      if (path.startsWith('/api/categories/')) {
        const id = path.split('/')[3]
        if (request.method === 'PUT') return updateCategory(id, request, env, corsHeaders)
        if (request.method === 'DELETE') return deleteCategory(id, env, corsHeaders)
      }

      // Réseaux sociaux
      if (path === '/api/socials') {
        if (request.method === 'GET') return getSocials(env, corsHeaders)
        if (request.method === 'POST') return createSocial(request, env, corsHeaders)
      }
      if (path.startsWith('/api/socials/')) {
        const id = path.split('/')[3]
        if (request.method === 'PUT') return updateSocial(id, request, env, corsHeaders)
        if (request.method === 'DELETE') return deleteSocial(id, env, corsHeaders)
      }

      // Farms
      if (path === '/api/farms') {
        if (request.method === 'GET') return getFarms(env, corsHeaders)
        if (request.method === 'POST') return createFarm(request, env, corsHeaders)
      }
      if (path.startsWith('/api/farms/')) {
        const id = path.split('/')[3]
        if (request.method === 'PUT') return updateFarm(id, request, env, corsHeaders)
        if (request.method === 'DELETE') return deleteFarm(id, env, corsHeaders)
      }

      // Settings
      if (path === '/api/settings') {
        if (request.method === 'GET') return getSettings(env, corsHeaders)
        if (request.method === 'POST') return createOrUpdateSetting(request, env, corsHeaders)
      }
      if (path.startsWith('/api/settings/')) {
        const key = path.split('/')[3]
        if (request.method === 'GET') return getSetting(key, env, corsHeaders)
        if (request.method === 'PUT') return createOrUpdateSetting(request, env, corsHeaders)
      }

      // Upload R2
      if (path === '/api/upload' && request.method === 'POST') {
        return uploadToR2(request, env, corsHeaders)
      }

      // Auth
      if (path === '/api/auth/login' && request.method === 'POST') {
        return loginAdmin(request, env, corsHeaders)
      }

      // Admin Users
      if (path === '/api/admin-users') {
        if (request.method === 'GET') return getAdminUsers(env, corsHeaders)
        if (request.method === 'POST') return createAdminUser(request, env, corsHeaders)
      }
      if (path.startsWith('/api/admin-users/')) {
        const id = path.split('/')[3]
        if (request.method === 'PUT') return updateAdminUser(id, request, env, corsHeaders)
        if (request.method === 'DELETE') return deleteAdminUser(id, env, corsHeaders)
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
}

// ============ INIT DATABASE ============
async function handleInit(env, corsHeaders) {
  try {
    // Créer les tables une par une
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        farm TEXT,
        photo TEXT,
        video TEXT,
        medias TEXT,
        variants TEXT,
        price TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `).run()

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT
      )
    `).run()

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS socials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        url TEXT
      )
    `).run()

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run()

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS farms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        description TEXT
      )
    `).run()

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT,
        updated_at TEXT
      )
    `).run()

    // Créer un utilisateur admin par défaut s'il n'existe pas (depuis variables d'environnement)
    const defaultUsername = env.DEFAULT_ADMIN_USERNAME || 'admin'
    const defaultPassword = env.DEFAULT_ADMIN_PASSWORD || 'admin123'
    
    const existingAdmin = await env.DB.prepare('SELECT * FROM admin_users WHERE username = ?').bind(defaultUsername).first()
    if (!existingAdmin) {
      const defaultAdminId = crypto.randomUUID()
      const now = new Date().toISOString()
      await env.DB.prepare(`
        INSERT INTO admin_users (id, username, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).bind(defaultAdminId, defaultUsername, defaultPassword, now, now).run()
    }

    return new Response(JSON.stringify({ success: true, message: 'Database initialized' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// ============ PRODUCTS ============
// Helper pour parser JSON en toute sécurité
function safeJSONParse(str, defaultValue = []) {
  if (!str) return defaultValue;
  
  try {
    const parsed = JSON.parse(str);
    
    // Si après le parse on a encore une string, parser à nouveau (double encoding)
    if (typeof parsed === 'string') {
      return safeJSONParse(parsed, defaultValue);
    }
    
    return parsed;
  } catch (e) {
    // Essayer de réparer le JSON cassé (format {5g:80} ou "{"5g":80,10g":160}")
    if (typeof str === 'string' && str.includes(':')) {
      try {
        // Enlever les guillemets extérieurs en trop
        let cleaned = str.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
        }
        
        // Ajouter des guillemets autour de TOUTES les clés sans guillemets
        // {5g:80,10g:160} → {"5g":80,"10g":160}
        const fixed = cleaned.replace(/([{,]\s*)([^":\s]+)(\s*):/g, '$1"$2"$3:');
        
        const result = JSON.parse(fixed);
        return result;
      } catch (e2) {
        console.error('JSON parse error even after fix:', str, e2);
        return defaultValue;
      }
    }
    console.error('JSON parse error:', str);
    return defaultValue;
  }
}

// Convertir prices (objet) en variants (tableau)
function convertPricesToVariants(prices) {
  if (!prices) return [];
  
  const pricesObj = typeof prices === 'string' ? safeJSONParse(prices, {}) : prices;
  if (!pricesObj || typeof pricesObj !== 'object') return [];
  
  return Object.entries(pricesObj).map(([name, price]) => ({
    name,
    price: typeof price === 'number' ? `${price}€` : price.toString()
  }));
}

// Transformer un produit pour qu'il ait toujours des variants
function transformProduct(p) {
  let variants = safeJSONParse(p.variants, null);
  
  // Si variants est un OBJET (format {name: price}), le convertir en tableau
  if (variants && typeof variants === 'object' && !Array.isArray(variants)) {
    // C'est un objet de prix, convertir en tableau
    variants = Object.entries(variants).map(([name, price]) => ({
      name,
      price: typeof price === 'number' ? `${price}€` : String(price)
    }));
  } else if (!Array.isArray(variants) || variants.length === 0) {
    // Sinon si variants est vide, essayer prices
    const pricesData = typeof p.prices === 'string' ? safeJSONParse(p.prices, null) : p.prices;
    if (pricesData) {
      variants = convertPricesToVariants(pricesData);
    }
  }
  
  // Si toujours pas de variants et qu'on a un price, créer un variant par défaut
  if (!variants || variants.length === 0) {
    if (p.price && p.price !== 0 && p.price !== '0') {
      variants = [{ name: 'Standard', price: `${p.price}€` }];
    } else {
      variants = [];
    }
  }
  
  // Normaliser les noms de colonnes (supporter ancienne et nouvelle structure)
  return {
    ...p,
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category || p.category_id,
    farm: p.farm || p.farm_id,
    photo: p.photo || p.image_url,
    video: p.video || p.video_url,
    variants,
    medias: safeJSONParse(p.medias, []),
    price: variants.length > 0 ? variants[0].price : (p.price || 'N/A'),
    prices: typeof p.prices === 'string' ? safeJSONParse(p.prices, null) : p.prices
  };
}

async function getProducts(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
  
  // Transformer les produits pour avoir toujours des variants
  const products = results.map(transformProduct)

  return new Response(JSON.stringify(products), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getProduct(id, env, corsHeaders) {
  const product = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
  
  if (!product) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(transformProduct(product)), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function createProduct(request, env, corsHeaders) {
  const data = await request.json()
  const id = data.id || Date.now().toString()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO products (id, name, description, category, farm, photo, video, medias, variants, price, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    data.name,
    data.description,
    data.category,
    data.farm,
    data.photo,
    data.video,
    JSON.stringify(data.medias || []),
    JSON.stringify(data.variants || []),
    data.price,
    data.created_at || new Date().toISOString(),
    new Date().toISOString()
  ).run()

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateProduct(id, request, env, corsHeaders) {
  const data = await request.json()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO products (id, name, description, category, farm, photo, video, medias, variants, price, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    data.name,
    data.description,
    data.category,
    data.farm,
    data.photo,
    data.video,
    JSON.stringify(data.medias || []),
    JSON.stringify(data.variants || []),
    data.price,
    data.created_at || new Date().toISOString(),
    new Date().toISOString()
  ).run()

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function deleteProduct(id, env, corsHeaders) {
  try {
    // Récupérer le produit avant de le supprimer pour avoir les URLs des fichiers
    const product = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first()
    
    if (product) {
      // Supprimer les fichiers R2 (photo et video)
      const filesToDelete = []
      
      if (product.photo && product.photo.includes('r2.dev')) {
        const filename = product.photo.split('/').pop()
        filesToDelete.push(filename)
      }
      
      if (product.video && product.video.includes('r2.dev')) {
        const filename = product.video.split('/').pop()
        filesToDelete.push(filename)
      }
      
      // Supprimer les fichiers du bucket R2
      for (const filename of filesToDelete) {
        try {
          await env.R2.delete(filename)
          console.log(`Deleted R2 file: ${filename}`)
        } catch (error) {
          console.error(`Error deleting R2 file ${filename}:`, error)
        }
      }
    }
    
    // Supprimer le produit de la base de données
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// ============ CATEGORIES ============
async function getCategories(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM categories').all()
  
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function createCategory(request, env, corsHeaders) {
  const data = await request.json()
  const id = data.id || Date.now().toString()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO categories (id, name, icon, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description).run()

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateCategory(id, request, env, corsHeaders) {
  const data = await request.json()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO categories (id, name, icon, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description).run()

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function deleteCategory(id, env, corsHeaders) {
  await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// ============ SOCIALS ============
async function getSocials(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM socials').all()
  
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function createSocial(request, env, corsHeaders) {
  const data = await request.json()
  const id = data.id || Date.now().toString()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO socials (id, name, icon, description, url)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description, data.url).run()

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateSocial(id, request, env, corsHeaders) {
  const data = await request.json()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO socials (id, name, icon, description, url)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description, data.url).run()

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function deleteSocial(id, env, corsHeaders) {
  await env.DB.prepare('DELETE FROM socials WHERE id = ?').bind(id).run()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// ============ SETTINGS ============
async function getSettings(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM settings').all()
  
  const settings = {}
  results.forEach(row => {
    try {
      settings[row.key] = JSON.parse(row.value)
    } catch (e) {
      settings[row.key] = row.value
    }
  })

  return new Response(JSON.stringify(settings), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getSetting(key, env, corsHeaders) {
  const result = await env.DB.prepare('SELECT * FROM settings WHERE key = ?').bind(key).first()
  
  if (!result) {
    return new Response(JSON.stringify(null), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // On retourne l'objet complet parsé (avec key, shopName, backgroundImage, etc.)
    const parsedValue = JSON.parse(result.value)
    return new Response(JSON.stringify(parsedValue), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    // Si ce n'est pas du JSON, on retourne quand même un objet avec key et value
    return new Response(JSON.stringify({ key: result.key, value: result.value }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function createOrUpdateSetting(request, env, corsHeaders) {
  const data = await request.json()
  
  // Si data.key existe, on sauvegarde un seul setting
  if (data.key) {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO settings (key, value)
      VALUES (?, ?)
    `).bind(data.key, JSON.stringify(data)).run()

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
  
  // Sinon, on sauvegarde plusieurs settings
  for (const [key, value] of Object.entries(data)) {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO settings (key, value)
      VALUES (?, ?)
    `).bind(key, JSON.stringify(value)).run()
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// ============ FARMS ============
async function getFarms(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT * FROM farms').all()
  
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function createFarm(request, env, corsHeaders) {
  const data = await request.json()
  const id = data.id || Date.now().toString()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO farms (id, name, image, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.image || null, data.description || null).run()

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function updateFarm(id, request, env, corsHeaders) {
  const data = await request.json()
  
  await env.DB.prepare(`
    INSERT OR REPLACE INTO farms (id, name, image, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.image || null, data.description || null).run()

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function deleteFarm(id, env, corsHeaders) {
  await env.DB.prepare('DELETE FROM farms WHERE id = ?').bind(id).run()
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// ============ AUTH ============
async function loginAdmin(request, env, corsHeaders) {
  try {
    const { username, password } = await request.json()
    
    const user = await env.DB.prepare(
      'SELECT * FROM admin_users WHERE username = ? AND password = ?'
    ).bind(username, password).first()
    
    if (user) {
      // Créer un token simple (dans une vraie app, utiliser JWT)
      const token = btoa(`${user.id}:${Date.now()}`)
      return new Response(JSON.stringify({ 
        success: true, 
        token,
        user: { id: user.id, username: user.username }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Identifiants invalides' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// ============ ADMIN USERS ============
async function getAdminUsers(env, corsHeaders) {
  const { results } = await env.DB.prepare('SELECT id, username, created_at, updated_at FROM admin_users ORDER BY created_at DESC').all()
  
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function createAdminUser(request, env, corsHeaders) {
  try {
    const data = await request.json()
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    // Vérifier si le username existe déjà
    const existing = await env.DB.prepare('SELECT * FROM admin_users WHERE username = ?').bind(data.username).first()
    if (existing) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Ce nom d\'utilisateur existe déjà' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    await env.DB.prepare(`
      INSERT INTO admin_users (id, username, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, data.username, data.password, now, now).run()

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function updateAdminUser(id, request, env, corsHeaders) {
  try {
    const data = await request.json()
    const now = new Date().toISOString()
    
    // Si on change le username, vérifier qu'il n'existe pas
    if (data.username) {
      const existing = await env.DB.prepare('SELECT * FROM admin_users WHERE username = ? AND id != ?').bind(data.username, id).first()
      if (existing) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Ce nom d\'utilisateur existe déjà' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }
    
    // Récupérer l'utilisateur actuel
    const currentUser = await env.DB.prepare('SELECT * FROM admin_users WHERE id = ?').bind(id).first()
    
    if (!currentUser) {
      return new Response(JSON.stringify({ error: 'Utilisateur non trouvé' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Mettre à jour
    await env.DB.prepare(`
      UPDATE admin_users 
      SET username = ?, password = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      data.username || currentUser.username,
      data.password || currentUser.password,
      now,
      id
    ).run()

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function deleteAdminUser(id, env, corsHeaders) {
  try {
    // Vérifier qu'il reste au moins un admin
    const { results } = await env.DB.prepare('SELECT COUNT(*) as count FROM admin_users').all()
    if (results[0].count <= 1) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Impossible de supprimer le dernier administrateur' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    await env.DB.prepare('DELETE FROM admin_users WHERE id = ?').bind(id).run()
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// ============ R2 UPLOAD ============
async function uploadToR2(request, env, corsHeaders) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const filename = `${Date.now()}-${file.name}`
    const buffer = await file.arrayBuffer()
    
    // Upload vers R2
    await env.R2.put(filename, buffer, {
      httpMetadata: {
        contentType: file.type
      }
    })

    const url = `https://pub-f470c04188bb475099ee04701b1a42db.r2.dev/${filename}`

    return new Response(JSON.stringify({ url, filename }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}