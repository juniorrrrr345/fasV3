# 🎨 Guide Visuel - Démarrage du Panel Admin

## 📍 Vous êtes ici

```
❌ Panel Admin → Erreurs JSON
          ↓
     [PROBLÈME]
          ↓
   Worker pas démarré
```

## 🎯 Objectif

```
✅ Panel Admin → Fonctionne
          ↓
      [SOLUTION]
          ↓
    Démarrer le worker
```

---

## 🛠️ Solution en Images (Étapes)

### 1️⃣ Terminal 1 - Démarrer le Worker

```bash
$ npm run dev:worker
```

**Attendez de voir** :
```
 ⛅️ wrangler 4.43.0
────────────────────
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

✅ **Status** : Worker démarré ✓

---

### 2️⃣ Navigateur - Initialiser la Base de Données

**Ouvrir** : `http://localhost:8787/api/init`

**Vous devriez voir** :
```json
{
  "success": true,
  "message": "Database initialized"
}
```

✅ **Status** : Base de données créée ✓

---

### 3️⃣ Terminal 2 - Démarrer le Frontend

```bash
$ npm run dev
```

**Attendez de voir** :
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Status** : Frontend démarré ✓

---

### 4️⃣ Navigateur - Se Connecter au Panel Admin

**Ouvrir** : `http://localhost:5173/admin/login`

**Remplir le formulaire** :
```
┌─────────────────────────────┐
│  Panel Admin - Connexion    │
├─────────────────────────────┤
│ Username: [admin         ]  │
│ Password: [admin123      ]  │
│                             │
│      [Se connecter]         │
└─────────────────────────────┘
```

✅ **Status** : Connecté au panel admin ✓

---

## 🎉 Résultat Final

```
✅ Worker API        → http://localhost:8787
✅ Frontend          → http://localhost:5173
✅ Panel Admin       → http://localhost:5173/admin
✅ Base de données   → Initialisée
```

---

## 🔄 Schéma du Flux

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │   API   │    Worker    │  Query  │  Database    │
│              │ ──────→ │              │ ──────→ │              │
│ localhost:   │         │ localhost:   │         │  Cloudflare  │
│   5173       │ ←────── │   8787       │ ←────── │     D1       │
└──────────────┘  JSON   └──────────────┘  Data   └──────────────┘
      ↑                         ↑
      │                         │
   Utilisateur            Cloudflare Worker
  (Navigateur)            (API Backend)
```

---

## 📊 Checklist de Démarrage

- [ ] Terminal 1 : `npm run dev:worker` démarré
- [ ] Navigateur : `http://localhost:8787/api/init` → succès
- [ ] Terminal 2 : `npm run dev` démarré
- [ ] Navigateur : `http://localhost:5173/admin/login` → page de login visible
- [ ] Login avec `admin` / `admin123` → succès
- [ ] Panel admin accessible et fonctionnel

---

## 🆘 En Cas de Problème

### Erreur : "Port 8787 already in use"
```bash
# Tuer le processus qui utilise le port
lsof -ti:8787 | xargs kill -9
# Puis redémarrer
npm run dev:worker
```

### Erreur : "Database not found"
```bash
# Réinitialiser la base de données
# Ouvrir dans le navigateur :
http://localhost:8787/api/init
```

### Erreur : "Unexpected token '<', "<!DOCTYPE""
```bash
# Le worker n'est pas démarré
# Vérifier le Terminal 1 :
npm run dev:worker
```

---

## 🎓 Pour Aller Plus Loin

Consultez :
- `LISEZ-MOI-DABORD.md` - Guide rapide
- `COMMANDES.md` - Toutes les commandes
- `INDEX-DOCUMENTATION.md` - Index complet
