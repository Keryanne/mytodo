# Application Todo avec MongoDB sur Scalingo

Ce guide explique comment déployer l'application **Todo** en utilisant une base MongoDB sur Scalingo.

## 🛠️ Pré-requis

- Un compte [Scalingo](https://scalingo.com)
- Un compte [GitHub](https://github.com)
- Node.js installé localement

## 🚀 Étapes de Déploiement

### 1. Forker et cloner le projet

Fork ce repository, puis clone ta copie locale :

```bash
git clone https://github.com/<ton-username>/mytodo.git
cd mytodo
```

### 2. Créer une application Scalingo

- Connecte-toi à [Scalingo Dashboard](https://dashboard.scalingo.com)
- Clique sur **New App**
- Donne-lui un nom (ex : `mytodo-app`)

### 3. Ajouter MongoDB

- Va dans **Add-ons** de ton app Scalingo
- Sélectionne **MongoDB** et clique sur **Provisionner**

> Cela ajoute automatiquement une variable d'environnement `SCALINGO_MONGO_URL`

### 4. Configurer le projet

- Vérifie que ton fichier de connexion MongoDB (`db.js`) utilise bien :

```js
const connectionString = process.env.SCALINGO_MONGO_URL;
MongoClient.connect(connectionString, options, (err, mongoDb) => {
  if (err) {
    reject(err);
    console.error("Erreur connexion MongoDB:", err);
  } else {
    db = mongoDb.db().collection('todos');
    resolve();
  }
});
```

### 5. Créer le fichier `Procfile`

Crée à la racine du projet le fichier nommé `Procfile` :

```
web: npm start
```

### 6. Déployer sur Scalingo

Initialise Git pour Scalingo et pousse ton application :

```bash
scalingo git-setup mytodo-app

# Commit et déploiement
git add .
git commit -m "Déploiement Todo app avec MongoDB sur Scalingo"
git push scalingo main
```

### 7. Vérifier le déploiement

Accède à ton application via :

```
https://mytodo-ynov.osc-fr1.scalingo.io/
```

## 🛑 Dépannage fréquent

- **Erreur 500** (Unauthorized) : vérifie que tu utilises bien `mongoDb.db()` sans nom de base explicite.
- **Variable manquante** : Vérifie via Scalingo Dashboard → Environment si `SCALINGO_MONGO_URL` est présente.
