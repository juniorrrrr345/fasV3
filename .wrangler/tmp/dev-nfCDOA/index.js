var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-qiuv04/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-qiuv04/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// worker/index.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      if (path === "/api/init") {
        return handleInit(env, corsHeaders);
      }
      if (path === "/api/products") {
        if (request.method === "GET")
          return getProducts(env, corsHeaders);
        if (request.method === "POST")
          return createProduct(request, env, corsHeaders);
      }
      if (path.startsWith("/api/products/")) {
        const id = path.split("/")[3];
        if (request.method === "GET")
          return getProduct(id, env, corsHeaders);
        if (request.method === "PUT")
          return updateProduct(id, request, env, corsHeaders);
        if (request.method === "DELETE")
          return deleteProduct(id, env, corsHeaders);
      }
      if (path === "/api/categories") {
        if (request.method === "GET")
          return getCategories(env, corsHeaders);
        if (request.method === "POST")
          return createCategory(request, env, corsHeaders);
      }
      if (path.startsWith("/api/categories/")) {
        const id = path.split("/")[3];
        if (request.method === "PUT")
          return updateCategory(id, request, env, corsHeaders);
        if (request.method === "DELETE")
          return deleteCategory(id, env, corsHeaders);
      }
      if (path === "/api/socials") {
        if (request.method === "GET")
          return getSocials(env, corsHeaders);
        if (request.method === "POST")
          return createSocial(request, env, corsHeaders);
      }
      if (path.startsWith("/api/socials/")) {
        const id = path.split("/")[3];
        if (request.method === "PUT")
          return updateSocial(id, request, env, corsHeaders);
        if (request.method === "DELETE")
          return deleteSocial(id, env, corsHeaders);
      }
      if (path === "/api/farms") {
        if (request.method === "GET")
          return getFarms(env, corsHeaders);
        if (request.method === "POST")
          return createFarm(request, env, corsHeaders);
      }
      if (path.startsWith("/api/farms/")) {
        const id = path.split("/")[3];
        if (request.method === "PUT")
          return updateFarm(id, request, env, corsHeaders);
        if (request.method === "DELETE")
          return deleteFarm(id, env, corsHeaders);
      }
      if (path === "/api/settings") {
        if (request.method === "GET")
          return getSettings(env, corsHeaders);
        if (request.method === "POST")
          return createOrUpdateSetting(request, env, corsHeaders);
      }
      if (path.startsWith("/api/settings/")) {
        const key = path.split("/")[3];
        if (request.method === "GET")
          return getSetting(key, env, corsHeaders);
        if (request.method === "PUT")
          return createOrUpdateSetting(request, env, corsHeaders);
      }
      if (path === "/api/upload" && request.method === "POST") {
        return uploadToR2(request, env, corsHeaders);
      }
      if (path === "/api/auth/login" && request.method === "POST") {
        return loginAdmin(request, env, corsHeaders);
      }
      if (path === "/api/admin-users") {
        if (request.method === "GET")
          return getAdminUsers(env, corsHeaders);
        if (request.method === "POST")
          return createAdminUser(request, env, corsHeaders);
      }
      if (path.startsWith("/api/admin-users/")) {
        const id = path.split("/")[3];
        if (request.method === "PUT")
          return updateAdminUser(id, request, env, corsHeaders);
        if (request.method === "DELETE")
          return deleteAdminUser(id, env, corsHeaders);
      }
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
async function handleInit(env, corsHeaders) {
  try {
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
    `).run();
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT
      )
    `).run();
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS socials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT,
        url TEXT
      )
    `).run();
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run();
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS farms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        description TEXT
      )
    `).run();
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TEXT,
        updated_at TEXT
      )
    `).run();
    const defaultUsername = env.DEFAULT_ADMIN_USERNAME || "admin";
    const defaultPassword = env.DEFAULT_ADMIN_PASSWORD || "admin123";
    const existingAdmin = await env.DB.prepare("SELECT * FROM admin_users WHERE username = ?").bind(defaultUsername).first();
    if (!existingAdmin) {
      const defaultAdminId = crypto.randomUUID();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await env.DB.prepare(`
        INSERT INTO admin_users (id, username, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).bind(defaultAdminId, defaultUsername, defaultPassword, now, now).run();
    }
    return new Response(JSON.stringify({ success: true, message: "Database initialized" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(handleInit, "handleInit");
function safeJSONParse(str, defaultValue = []) {
  if (!str)
    return defaultValue;
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === "string") {
      return safeJSONParse(parsed, defaultValue);
    }
    return parsed;
  } catch (e) {
    if (typeof str === "string" && str.includes(":")) {
      try {
        let cleaned = str.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
        }
        const fixed = cleaned.replace(/([{,]\s*)([^":\s]+)(\s*):/g, '$1"$2"$3:');
        const result = JSON.parse(fixed);
        return result;
      } catch (e2) {
        console.error("JSON parse error even after fix:", str, e2);
        return defaultValue;
      }
    }
    console.error("JSON parse error:", str);
    return defaultValue;
  }
}
__name(safeJSONParse, "safeJSONParse");
function convertPricesToVariants(prices) {
  if (!prices)
    return [];
  const pricesObj = typeof prices === "string" ? safeJSONParse(prices, {}) : prices;
  if (!pricesObj || typeof pricesObj !== "object")
    return [];
  return Object.entries(pricesObj).map(([name, price]) => ({
    name,
    price: typeof price === "number" ? `${price}\u20AC` : price.toString()
  }));
}
__name(convertPricesToVariants, "convertPricesToVariants");
function transformProduct(p) {
  let variants = safeJSONParse(p.variants, null);
  if (variants && typeof variants === "object" && !Array.isArray(variants)) {
    variants = Object.entries(variants).map(([name, price]) => ({
      name,
      price: typeof price === "number" ? `${price}\u20AC` : String(price)
    }));
  } else if (!Array.isArray(variants) || variants.length === 0) {
    const pricesData = typeof p.prices === "string" ? safeJSONParse(p.prices, null) : p.prices;
    if (pricesData) {
      variants = convertPricesToVariants(pricesData);
    }
  }
  if (!variants || variants.length === 0) {
    if (p.price && p.price !== 0 && p.price !== "0") {
      variants = [{ name: "Standard", price: `${p.price}\u20AC` }];
    } else {
      variants = [];
    }
  }
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
    price: variants.length > 0 ? variants[0].price : p.price || "N/A",
    prices: typeof p.prices === "string" ? safeJSONParse(p.prices, null) : p.prices
  };
}
__name(transformProduct, "transformProduct");
async function getProducts(env, corsHeaders) {
  const { results } = await env.DB.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
  const products = results.map(transformProduct);
  return new Response(JSON.stringify(products), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(getProducts, "getProducts");
async function getProduct(id, env, corsHeaders) {
  const product = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify(transformProduct(product)), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(getProduct, "getProduct");
async function createProduct(request, env, corsHeaders) {
  const data = await request.json();
  const id = data.id || Date.now().toString();
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
    data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
    (/* @__PURE__ */ new Date()).toISOString()
  ).run();
  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(createProduct, "createProduct");
async function updateProduct(id, request, env, corsHeaders) {
  const data = await request.json();
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
    data.created_at || (/* @__PURE__ */ new Date()).toISOString(),
    (/* @__PURE__ */ new Date()).toISOString()
  ).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(updateProduct, "updateProduct");
async function deleteProduct(id, env, corsHeaders) {
  try {
    const product = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (product) {
      const filesToDelete = [];
      if (product.photo && product.photo.includes("r2.dev")) {
        const filename = product.photo.split("/").pop();
        filesToDelete.push(filename);
      }
      if (product.video && product.video.includes("r2.dev")) {
        const filename = product.video.split("/").pop();
        filesToDelete.push(filename);
      }
      for (const filename of filesToDelete) {
        try {
          await env.R2.delete(filename);
          console.log(`Deleted R2 file: ${filename}`);
        } catch (error) {
          console.error(`Error deleting R2 file ${filename}:`, error);
        }
      }
    }
    await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(deleteProduct, "deleteProduct");
async function getCategories(env, corsHeaders) {
  const { results } = await env.DB.prepare("SELECT * FROM categories").all();
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(getCategories, "getCategories");
async function createCategory(request, env, corsHeaders) {
  const data = await request.json();
  const id = data.id || Date.now().toString();
  await env.DB.prepare(`
    INSERT OR REPLACE INTO categories (id, name, icon, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description).run();
  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(createCategory, "createCategory");
async function updateCategory(id, request, env, corsHeaders) {
  const data = await request.json();
  await env.DB.prepare(`
    INSERT OR REPLACE INTO categories (id, name, icon, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(updateCategory, "updateCategory");
async function deleteCategory(id, env, corsHeaders) {
  await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(deleteCategory, "deleteCategory");
async function getSocials(env, corsHeaders) {
  const { results } = await env.DB.prepare("SELECT * FROM socials").all();
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(getSocials, "getSocials");
async function createSocial(request, env, corsHeaders) {
  const data = await request.json();
  const id = data.id || Date.now().toString();
  await env.DB.prepare(`
    INSERT OR REPLACE INTO socials (id, name, icon, description, url)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description, data.url).run();
  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(createSocial, "createSocial");
async function updateSocial(id, request, env, corsHeaders) {
  const data = await request.json();
  await env.DB.prepare(`
    INSERT OR REPLACE INTO socials (id, name, icon, description, url)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, data.name, data.icon, data.description, data.url).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(updateSocial, "updateSocial");
async function deleteSocial(id, env, corsHeaders) {
  await env.DB.prepare("DELETE FROM socials WHERE id = ?").bind(id).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(deleteSocial, "deleteSocial");
async function getSettings(env, corsHeaders) {
  const { results } = await env.DB.prepare("SELECT * FROM settings").all();
  const settings = {};
  results.forEach((row) => {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch (e) {
      settings[row.key] = row.value;
    }
  });
  return new Response(JSON.stringify(settings), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(getSettings, "getSettings");
async function getSetting(key, env, corsHeaders) {
  const result = await env.DB.prepare("SELECT * FROM settings WHERE key = ?").bind(key).first();
  if (!result) {
    return new Response(JSON.stringify(null), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  try {
    const parsedValue = JSON.parse(result.value);
    return new Response(JSON.stringify(parsedValue), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ key: result.key, value: result.value }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(getSetting, "getSetting");
async function createOrUpdateSetting(request, env, corsHeaders) {
  const data = await request.json();
  if (data.key) {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO settings (key, value)
      VALUES (?, ?)
    `).bind(data.key, JSON.stringify(data)).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  for (const [key, value] of Object.entries(data)) {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO settings (key, value)
      VALUES (?, ?)
    `).bind(key, JSON.stringify(value)).run();
  }
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(createOrUpdateSetting, "createOrUpdateSetting");
async function getFarms(env, corsHeaders) {
  const { results } = await env.DB.prepare("SELECT * FROM farms").all();
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(getFarms, "getFarms");
async function createFarm(request, env, corsHeaders) {
  const data = await request.json();
  const id = data.id || Date.now().toString();
  await env.DB.prepare(`
    INSERT OR REPLACE INTO farms (id, name, image, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.image || null, data.description || null).run();
  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(createFarm, "createFarm");
async function updateFarm(id, request, env, corsHeaders) {
  const data = await request.json();
  await env.DB.prepare(`
    INSERT OR REPLACE INTO farms (id, name, image, description)
    VALUES (?, ?, ?, ?)
  `).bind(id, data.name, data.image || null, data.description || null).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(updateFarm, "updateFarm");
async function deleteFarm(id, env, corsHeaders) {
  await env.DB.prepare("DELETE FROM farms WHERE id = ?").bind(id).run();
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(deleteFarm, "deleteFarm");
async function loginAdmin(request, env, corsHeaders) {
  try {
    const { username, password } = await request.json();
    const user = await env.DB.prepare(
      "SELECT * FROM admin_users WHERE username = ? AND password = ?"
    ).bind(username, password).first();
    if (user) {
      const token = btoa(`${user.id}:${Date.now()}`);
      return new Response(JSON.stringify({
        success: true,
        token,
        user: { id: user.id, username: user.username }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: "Identifiants invalides"
      }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(loginAdmin, "loginAdmin");
async function getAdminUsers(env, corsHeaders) {
  const { results } = await env.DB.prepare("SELECT id, username, created_at, updated_at FROM admin_users ORDER BY created_at DESC").all();
  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(getAdminUsers, "getAdminUsers");
async function createAdminUser(request, env, corsHeaders) {
  try {
    const data = await request.json();
    const id = crypto.randomUUID();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = await env.DB.prepare("SELECT * FROM admin_users WHERE username = ?").bind(data.username).first();
    if (existing) {
      return new Response(JSON.stringify({
        success: false,
        error: "Ce nom d'utilisateur existe d\xE9j\xE0"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(`
      INSERT INTO admin_users (id, username, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, data.username, data.password, now, now).run();
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(createAdminUser, "createAdminUser");
async function updateAdminUser(id, request, env, corsHeaders) {
  try {
    const data = await request.json();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (data.username) {
      const existing = await env.DB.prepare("SELECT * FROM admin_users WHERE username = ? AND id != ?").bind(data.username, id).first();
      if (existing) {
        return new Response(JSON.stringify({
          success: false,
          error: "Ce nom d'utilisateur existe d\xE9j\xE0"
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    const currentUser = await env.DB.prepare("SELECT * FROM admin_users WHERE id = ?").bind(id).first();
    if (!currentUser) {
      return new Response(JSON.stringify({ error: "Utilisateur non trouv\xE9" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare(`
      UPDATE admin_users 
      SET username = ?, password = ?, updated_at = ?
      WHERE id = ?
    `).bind(
      data.username || currentUser.username,
      data.password || currentUser.password,
      now,
      id
    ).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(updateAdminUser, "updateAdminUser");
async function deleteAdminUser(id, env, corsHeaders) {
  try {
    const { results } = await env.DB.prepare("SELECT COUNT(*) as count FROM admin_users").all();
    if (results[0].count <= 1) {
      return new Response(JSON.stringify({
        success: false,
        error: "Impossible de supprimer le dernier administrateur"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare("DELETE FROM admin_users WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(deleteAdminUser, "deleteAdminUser");
async function uploadToR2(request, env, corsHeaders) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const filename = `${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();
    await env.R2.put(filename, buffer, {
      httpMetadata: {
        contentType: file.type
      }
    });
    const url = `https://pub-f470c04188bb475099ee04701b1a42db.r2.dev/${filename}`;
    return new Response(JSON.stringify({ url, filename }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(uploadToR2, "uploadToR2");

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-qiuv04/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-qiuv04/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
