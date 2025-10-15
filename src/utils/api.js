/**
 * API Client pour communiquer avec Cloudflare Worker
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://fasv3.calitek-junior.workers.dev'


// ============ PRODUCTS ============
export const getAll = async (type) => {
  if (type === 'products') {
    const response = await fetch(`${API_URL}/api/products`)
    return await response.json()
  }
  
  if (type === 'categories') {
    const response = await fetch(`${API_URL}/api/categories`)
    return await response.json()
  }
  
  if (type === 'socials') {
    const response = await fetch(`${API_URL}/api/socials`)
    return await response.json()
  }
  
  if (type === 'settings') {
    const response = await fetch(`${API_URL}/api/settings`)
    return await response.json()
  }
  
  if (type === 'farms') {
    const response = await fetch(`${API_URL}/api/farms`)
    return await response.json()
  }
  
  return []
}

export const getById = async (type, id) => {
  if (type === 'products') {
    const response = await fetch(`${API_URL}/api/products/${id}`)
    return await response.json()
  }
  
  if (type === 'settings') {
    const response = await fetch(`${API_URL}/api/settings/${id}`)
    return await response.json()
  }
  
  return null
}

export const save = async (type, data) => {
  if (type === 'products') {
    const method = data.id ? 'PUT' : 'POST'
    const url = data.id ? `${API_URL}/api/products/${data.id}` : `${API_URL}/api/products`
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
  
  if (type === 'categories') {
    const method = data.id && data.id !== 'new' ? 'PUT' : 'POST'
    const url = data.id && data.id !== 'new' ? `${API_URL}/api/categories/${data.id}` : `${API_URL}/api/categories`
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
  
  if (type === 'socials') {
    const method = data.id && data.id !== 'new' ? 'PUT' : 'POST'
    const url = data.id && data.id !== 'new' ? `${API_URL}/api/socials/${data.id}` : `${API_URL}/api/socials`
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
  
  if (type === 'settings') {
    const url = data.key ? `${API_URL}/api/settings/${data.key}` : `${API_URL}/api/settings`
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
  
  if (type === 'farms') {
    const method = data.id && data.id !== 'new' ? 'PUT' : 'POST'
    const url = data.id && data.id !== 'new' ? `${API_URL}/api/farms/${data.id}` : `${API_URL}/api/farms`
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
}

export const remove = async (type, id) => {
  if (type === 'products') {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  }
  
  if (type === 'categories') {
    const response = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  }
  
  if (type === 'socials') {
    const response = await fetch(`${API_URL}/api/socials/${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  }
  
  if (type === 'farms') {
    const response = await fetch(`${API_URL}/api/farms/${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  }
}

// ============ R2 UPLOAD ============
export const uploadToR2 = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData
  })
  
  return await response.json()
}

// ============ INIT DATABASE ============
export const initDatabase = async () => {
  const response = await fetch(`${API_URL}/api/init`)
  return await response.json()
}
