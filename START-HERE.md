# ⚡ START HERE - Démarrage en 30 Secondes

## 🎯 Votre panel admin ne marche pas ?

**Raison** : Le worker Cloudflare n'est pas démarré.

**Solution** : 3 commandes

---

## 💨 Quick Start

### Terminal 1
```bash
npm run dev:worker
```

Attendez de voir : `Ready on http://localhost:8787`

### Navigateur
Ouvrir : `http://localhost:8787/api/init`

Vous devez voir : `{"success":true,...}`

### Terminal 2
```bash
npm run dev
```

Ouvrir : `http://localhost:5173/admin/login`

Login : `admin` / `admin123`

---

## ✅ C'est tout !

---

## 📚 Plus d'infos ?

- **Rapide** : `LISEZ-MOI-DABORD.md`
- **Visuel** : `GUIDE-VISUEL.md`  
- **Complet** : `README.md`

---

## 🆘 Problème ?

**Erreur JSON** → Le worker n'est pas démarré → `npm run dev:worker`

**Database error** → DB pas initialisée → Ouvrir `http://localhost:8787/api/init`

---

**Go ! 🚀**
