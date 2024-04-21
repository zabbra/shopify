# API pour Site E-commerce

Cette API est conçue pour gérer les fonctionnalités essentielles d'un site e-commerce, telles que la connexion des utilisateurs, l'inscription, la recherche de produits, la gestion des produits et des catégories, ainsi que la gestion des paniers utilisateurs.


## Technologies Utilisées
Au cour de ce mini projet, j'ai appris à :

1. ReactJS :

 - Justification : ReactJS est une bibliothèque JavaScript très populaire pour la création d'interfaces utilisateur interactives. Son utilisation est justifiée dans ce projet car il permet de créer une interface utilisateur réactive et dynamique pour votre site e-commerce. Grâce à son approche déclarative et à sa gestion efficace de l'état, React simplifie le développement d'applications complexes tout en offrant de bonnes performances.

2. NodeJS :

 - Justification : Node.js est une plateforme basée sur le moteur JavaScript V8 de Chrome, qui permet d'exécuter du code JavaScript côté serveur. Dans ce projet, Node.js est utilisé pour mettre en œuvre le backend de l'application. Son modèle asynchrone et événementiel, ainsi que sa capacité à gérer de grandes quantités de connexions simultanées, en font un choix judicieux pour les applications Web en temps réel comme les sites e-commerce.

3. ExpressJS :

 - Justification : Express.js est un framework web minimaliste et flexible pour Node.js. Il est souvent utilisé pour construire des applications web et des API. Dans ce projet, Express.js est utilisé comme infrastructure web pour gérer les routes, les middleware, et les requêtes HTTP. Son approche légère et non intrusive permet une grande flexibilité dans la conception de l'API, tout en offrant des performances élevées.

4. MySQL :

 - Justification : MySQL est l'un des systèmes de gestion de base de données relationnelles (SGBDR) les plus populaires au monde. Dans le contexte d'un site e-commerce, où les données doivent être stockées de manière structurée et fiable, MySQL offre des fonctionnalités de stockage et de récupération de données robustes. De plus, il est bien documenté, largement utilisé et dispose d'une communauté active, ce qui en fait un choix solide pour ce type d'application.

5. Sequelize :

 - Justification : Sequelize est un ORM (Object-Relational Mapping) pour Node.js, qui prend en charge plusieurs bases de données relationnelles, dont MySQL. Il simplifie l'interaction avec la base de données en permettant d'écrire des requêtes en JavaScript plutôt qu'en SQL brut. Sequelize offre également des fonctionnalités telles que la migration de schéma, les associations entre tables, et la validation des données, ce qui permet un développement plus rapide et plus sûr de l'application



En résumé, l'utilisation de ReactJS pour le frontend permet de créer une interface utilisateur réactive et dynamique, tandis que l'utilisation de Node.js, Express.js, MySQL et Sequelize pour le backend permet de construire une API robuste et performante pour gérer les fonctionnalités d'un site e-commerce, telles que l'authentification, la gestion des produits et des paniers utilisateurs.


## Dépendances Utilisées

Le projet utilise plusieurs dépendances pour gérer différentes fonctionnalités. Voici une explication de chacune de ces dépendances et de leur utilisation :

- **bcrypt** : Cette dépendance est utilisée pour le hachage sécurisé des mots de passe des utilisateurs. Elle permet de stocker les mots de passe de manière sécurisée dans la base de données en les hachant avant l'enregistrement.

- **cors** : Cors (Cross-Origin Resource Sharing) est un middleware Express qui permet de gérer les requêtes HTTP entre différents domaines. Son utilisation est nécessaire pour autoriser les requêtes provenant de sources externes, telles que des applications frontend distinctes.

- **dotenv** : Dotenv est une dépendance utilisée pour charger les variables d'environnement à partir d'un fichier `.env`. Cela permet de stocker de manière sécurisée des informations sensibles, telles que les identifiants de base de données, en dehors du code source.

- **express** : Express est un framework web minimaliste pour Node.js. Il est utilisé dans ce projet pour gérer les routes, les middleware et les requêtes HTTP. Sa simplicité et sa flexibilité en font un choix populaire pour le développement d'applications web et d'API.

- **express-validator** : Express Validator est un ensemble de middleware Express qui permet de valider facilement les données d'une requête HTTP. Il est utilisé dans ce projet pour valider les données d'entrée telles que les champs de formulaire et les paramètres de requête.

- **jsonwebtoken** : JsonWebToken est une méthode standard pour créer des jetons d'authentification JSON sécurisés. Dans ce projet, il est utilisé pour générer des jetons d'authentification pour les utilisateurs lorsqu'ils se connectent, ce qui leur permet d'accéder aux ressources protégées de l'API.

- **multer** : Multer est un middleware pour Express qui permet de gérer les fichiers téléchargés à partir de formulaires HTTP. Il est utilisé dans ce projet pour gérer le téléchargement d'images pour les produits et les catégories.

- **mysql2** : MySQL2 est un pilote MySQL pour Node.js. Il est utilisé dans ce projet pour établir une connexion à la base de données MySQL et exécuter des requêtes SQL.

- **nodemon** : Nodemon est un utilitaire qui surveille les modifications des fichiers dans un projet Node.js et redémarre automatiquement le serveur lorsqu'un changement est détecté. Il est souvent utilisé dans les environnements de développement pour améliorer la productivité des développeurs en évitant de devoir redémarrer manuellement le serveur à chaque modification du code.

- **sequelize** : Sequelize est un ORM (Object-Relational Mapping) pour Node.js, qui prend en charge plusieurs bases de données relationnelles, dont MySQL. Il est utilisé dans ce projet pour faciliter l'interaction avec la base de données en permettant de manipuler les données en utilisant des objets JavaScript plutôt que des requêtes SQL brutes.

- **swagger-jsdoc** et **swagger-ui-express** : Ces dépendances sont utilisées pour générer une documentation interactive de l'API à partir des commentaires du code source. Swagger JSdoc permet de définir les spécifications Swagger dans le code source, tandis que Swagger UI Express permet d'afficher la documentation générée dans une interface utilisateur conviviale.



## Entités Principales

### User

- **Attributs** :
  - id (identifiant unique)
  - username (nom d'utilisateur)
  - email (adresse e-mail)
  - password (mot de passe haché)
  - createdAt (date de création)
  - updatedAt (date de mise à jour)

### Produit

- **Attributs** :
  - id (identifiant unique)
  - title (titre du produit)
  - description (description du produit)
  - price (prix du produit)
  - discountPercentage (pourcentage de réduction)
  - rating (notation du produit)
  - stock (quantité en stock)
  - brand (marque du produit)
  - category (catégorie du produit)
  - thumbnail (URL de l'image miniature)
  - images (tableau d'URL des images)

### Catégorie

- **Attributs** :
  - id (identifiant unique)
  - name (nom de la catégorie)
  - description (description de la catégorie)
  - thumbnail (URL de l'image miniature)

### Cart

- **Attributs** :
  - id (identifiant unique)
  - total (total du panier)
  - discountedTotal (total du panier avec réduction)
  - totalProducts (nombre total de produits dans le panier)
  - totalQuantity (quantité totale de produits dans le panier)

### CartItem

- **Attributs** :
  - id (identifiant unique)
  - quantity (quantité du produit dans le panier)
  - total (total pour ce produit dans le panier)
  - discountPercentage (pourcentage de réduction pour ce produit)
  - discountedPrice (prix réduit pour ce produit)

### Image

- **Attributs** :
  - id (Identifiant unique)  <!-- Identifiant unique -->
  - url (URL de l'image) <!-- URL de l'image -->
  - name (Nom de l'image)<!-- Nom de l'image -->
  - type (Type de l'image) <!-- Type de l'image -->



## Diagramme de classe
![diagramme_de_classe](/uploads/ecom_lass_diagram.png)



## Règles de Gestion / Relations:

- Un utilisateur peut s'inscrire en fournissant son username, son email et son mot de passe.
- Un utilisateur peut se connecter en utilisant son email et son mot de passe.
- un utilisateur peut avoir plusieur role
- Un utilisateur peut avoir plusieurs paniers (relation 1-N entre User et Cart).
- Un panier peut contenir plusieurs éléments de panier (relation 1-N entre Cart et CartItem).
- Un produit peut être présent dans plusieurs paniers (relation 1-N entre Product et CartItem).
- Une catégorie peut avoir plusieurs produits (relation 1-N entre Category et Product).
- Un produit peut avoir plusieurs images associées(relation 1-N entre Product et Image).
- Le total du panier est calculé en fonction des prix des produits et de la quantité.
- Les réductions sont appliquées sur le total du panier
- Les produits peuvent avoir un prix réduit et une évaluation.
- Les images des produits et des catégories doivent être stockées et gérées correctement.
- Les opérations CRUD (Create, Read, Update, Delete) doivent être sécurisées avec des autorisations appropriées.
- Pagination pour les listes de produits et de catégories.
- Un produit doit appartenir à une catégorie.


## Instructions pour lancer le projet :

1.	Cloner le référentiel depuis GitHub.
2.	Installer les dépendances avec npm install.
3.	Configurer la base de données en fonction des paramètres de votre environnement.
4.	Exécuter le serveur avec  
  > ```npm install dev```.
5.	Tester les différentes routes de l'API à l'aide d'un outil comme Postman ou curl ou encore 
la documentation swagger fournir avec l'API




Ouvrez [http://localhost:8081](http://localhost:8081) pour l'afficher dans le navigateur.
Ouvrez [http://localhost:8089/api-docs/](http://localhost:8089/api-docs/) pour l'afficher dans le navigateur.

La page se rechargera si vous apportez des modifications.


