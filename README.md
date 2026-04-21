# Portfolio Mattéo CHANTE BIYIKLI, BTS SIO option SLAM

Site personnel statique qui accompagne la candidature à l'épreuve E4 du BTS SIO option SLAM, session 2026. Il présente le candidat, les sept réalisations, la veille technologique et les coordonnées.

## Stack

HTML, CSS, JavaScript, sans framework et sans étape de build. Polices via Google Fonts (Fraunces, Inter). Icônes en SVG inline.

## Structure du dépôt

```
portfolio/
    index.html
    styles.css
    README.md
    CLAUDE.md
    data/
        projets.json
    js/
        main.js
    medias/
        stockageManager/manifeste.json
        siteEditorial/manifeste.json
        reseauIncubateur/manifeste.json
        serveurGlpi/manifeste.json
        chronometreJava/manifeste.json
        outilVps/manifeste.json
        siteTouristique/manifeste.json
```

## Lancer le site en local

Le site charge `data/projets.json` et les manifestes d'images via `fetch`. Les navigateurs bloquent `fetch` sur le protocole `file`. Il faut donc servir le dossier via un petit serveur statique.

Exemple recommandé, avec Node installé :

```
npx serve .
```

Puis ouvrir l'adresse affichée dans le terminal (en général `http://localhost:3000`). N'importe quel serveur statique fonctionne (Apache, Nginx, module http.server de Python, etc.).

## Source de vérité, data/projets.json

Le fichier `data/projets.json` contient toutes les données affichées (candidat, parcours, sept projets, veille). Toute mise à jour passe par ce fichier. Le site en lit le contenu au chargement.

Schéma résumé :

* `candidat` : nom, intitulé, phrase d'accueil, email, liens GitHub et LinkedIn.
* `parcours` : liste d'étapes (année, intitulé, contexte).
* `projets` : liste de sept projets, chacun avec identifiant, titre, descriptions, période, contexte, environnement, compétences, sous compétences, dossier d'images, boutons, documents.
* `veille` : méthode, sources, sujets, billets.

Règle d'affichage des boutons : si `boutons.github` est une chaîne non vide, le bouton GitHub apparaît. Si `boutons.telechargement` est une chaîne non vide, le bouton de téléchargement apparaît. Les deux peuvent coexister. Si les deux sont vides, aucun bouton d'action n'est rendu.

## Images des projets

Chaque dossier `medias/<idProjet>` contient un fichier `manifeste.json` qui liste les noms de fichiers d'images à afficher, dans l'ordre voulu. Exemple :

```
{
  "images": [
    "01_ecranAccueil.png",
    "02_ecranListe.png",
    "03_ecranDetail.png"
  ]
}
```

Formats acceptés : png, jpg, jpeg, webp, avif. La première image sert de vignette sur la carte. Les images suivantes apparaissent dans la galerie du détail projet.

Le manifeste est généré à la main ou via un petit script local. Il n'est pas nécessaire d'éditer le site pour ajouter une image, il suffit de déposer le fichier dans le dossier et de mettre à jour `manifeste.json`.

## Règles de style appliquées au code

Le fichier `CLAUDE.md` fixe les règles strictes du projet. En pratique :

* Aucun tiret dans le contenu rédigé (textes visibles, identifiants choisis, noms de fichiers, noms de classes CSS, noms de dossiers, chaînes JSON). Les tirets présents appartiennent à la syntaxe obligatoire du langage (noms d'attributs HTML comme `aria-label` et `data-...`, propriétés CSS comme `font-family`, pseudo classes comme `:focus-visible`, valeurs spécifiées par la norme comme `device-width` ou `UTF-8`).
* Aucun emoji. Les pictogrammes sont des SVG inline monochromes.
* Aucun commentaire dans le code. La documentation vit dans ce README.
* Ton sobre et humain dans les textes du site.

## Accessibilité

* Balises sémantiques (header, main, section, article, nav, footer).
* Navigation clavier complète avec focus visible.
* Textes alternatifs sur les images de projets.
* Contraste respectant WCAG AA sur les blocs principaux.
* Respect de la préférence système de réduction des animations.

## Déploiement

Le site étant strictement statique, il se déploie sur n'importe quel hébergeur qui sert des fichiers HTML (Netlify, Vercel, OVH, un simple Apache ou Nginx). Aucune configuration particulière côté serveur.

## Licence

Projet personnel à usage pédagogique, présenté devant le jury BTS SIO session 2026.
