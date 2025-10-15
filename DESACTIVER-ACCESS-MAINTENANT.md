# 🔓 DÉSACTIVER CLOUDFLARE ACCESS - Guide Visuel

## 🎯 Vous avez le bon compte !

Votre worker `thegd33.calitek-junior.workers.dev` est bien sur votre compte.

Il faut juste **désactiver la protection Cloudflare Access**.

---

## 📍 OÙ CHERCHER

### Méthode 1 : Via Zero Trust

1. **Dans le menu de gauche de Cloudflare Dashboard**, cherchez :
   ```
   Zero Trust
   ```

2. **Cliquez dessus**, puis :
   ```
   Access → Applications
   ```

3. **Cherchez** dans la liste :
   - `thegd33.calitek-junior.workers.dev`
   - ou `*.workers.dev`
   - ou `*.calitek-junior.workers.dev`

4. **Si vous le trouvez** :
   - Cliquez sur les **3 points** ⋮
   - Choisissez **"Delete"** ou **"Disable"**
   - Confirmez

---

### Méthode 2 : Via le Worker lui-même

1. **Restez sur la page du Worker** (Workers et Pages → thegd33)

2. **Dans le menu du haut**, cherchez un onglet qui pourrait s'appeler :
   - **"Access"**
   - **"Security"**
   - **"Firewall"**

3. **Si vous le trouvez**, désactivez toute protection

---

### Méthode 3 : Via le domaine workers.dev

1. **Menu gauche** → **Websites**

2. **Cherchez** `calitek-junior.workers.dev` dans la liste

3. **Cliquez dessus**

4. **Security** → **Access**

5. **Désactivez** ou **supprimez** les règles

---

### Méthode 4 : Vérifier les Règles WAF/Firewall

1. **Menu gauche** → **Websites**

2. **Sélectionnez** votre domaine principal (si vous en avez un)

3. **Security** → **WAF**

4. **Vérifiez** qu'il n'y a pas de règle qui bloque `*.workers.dev`

---

## 🔍 DIAGNOSTIC

Si vous ne trouvez rien dans Zero Trust, c'est peut-être :

1. **Une règle de pare-feu globale**
2. **Une configuration au niveau du compte**
3. **Une protection activée sur le domaine parent**

---

## 🎯 ALTERNATIVE : Créer une Règle Bypass

Si vous ne pouvez pas désactiver complètement Access :

1. **Zero Trust** → **Access** → **Applications**

2. **Trouvez votre application**

3. **Cliquez sur "Edit"**

4. **Allez dans "Policies"**

5. **Ajoutez une nouvelle Policy** :
   - **Action** : `Bypass`
   - **Policy name** : `Public API Access`

6. **Dans "Configure rules"** :
   - **Include** → **Everyone**

7. **Sous "Require"**, ajoutez :
   - **Path** : `/api/*`

8. **Save**

Cela permettra l'accès public à tous les endpoints `/api/*` tout en gardant la protection sur le reste.

---

## 🧪 TEST APRÈS DÉSACTIVATION

Une fois que vous pensez avoir désactivé Access, testez :

```
https://thegd33.calitek-junior.workers.dev/api/settings
```

**Dans votre navigateur** :
- ✅ Si vous voyez du **JSON** → C'est bon !
- ❌ Si vous voyez une **page de login** → Access est toujours actif

---

## 📱 CAPTURES D'ÉCRAN UTILES

Quand vous êtes dans Cloudflare Dashboard, cherchez ces éléments :

**Menu de gauche** :
```
☁️ Cloudflare Dashboard
├─ 🏠 Home
├─ 🌐 Websites
├─ 👥 Account
├─ 🔐 Zero Trust  ← CHERCHEZ ICI EN PREMIER
│   ├─ Access
│   │   ├─ Applications  ← ET ICI
│   │   ├─ Policies
│   │   └─ Service Auth
│   └─ Gateway
└─ ⚙️ Workers & Pages
```

---

## ⚠️ IMPORTANT

Une fois désactivé, **votre API sera publique**.

**C'est NORMAL** pour une boutique e-commerce :
- Les endpoints GET (lecture) doivent être publics
- Seul le panel admin nécessite une authentification (déjà dans le code)
- L'API en lecture seule est sécurisée

---

## 🆘 SI VOUS NE TROUVEZ PAS

Faites des captures d'écran de :
1. Le menu de gauche de Cloudflare Dashboard
2. Les onglets disponibles dans la page du Worker
3. Ce que vous voyez dans "Zero Trust" (s'il existe)

Et on cherchera ensemble !

---

**Commencez par chercher "Zero Trust" dans le menu de gauche ! 🔍**
