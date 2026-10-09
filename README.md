# Case Studies Explorance

Propositions de carousel pour la section **Case Studies** de [explorance.com/products/blue](https://explorance.com/products/blue/), qui affiche aujourd'hui 3 cartes fixes.

- **A · Fidèle** — la section actuelle en carousel : 3 cartes, flèches à côté du titre, points de pagination.
- **B · Filtres par secteur** — A + pastilles Higher Education / Business Schools / Healthcare.
- **C · Cartes immersives** — mise en page de A, cartes avec l'image de la case study en plein cadre et le titre en surimpression. Avec les filtres par secteur de B.
- **D · Une histoire à la fois** — d'après la maquette Figma « Video Case Studies » (Website 2024, node 10378:45444) : une case study par slide. Image de la case study avec catégorie, titre et bouton lecture ; citation tirée de la case study, initiales, nom, fonction et nom de l'institution à la place du logo. 7 case studies (UNLV et OpusVi n'ont pas de citation nommée). Aucune n'a encore de vidéo : la vidéo du header Blue sert d'exemple.
- **D · Version Image** — même carte que D sans vidéo, d'après la maquette Figma « Multiple Images » (node 10435:5952) : la moitié gauche mène à la case study (catégorie, titre, temps de lecture, bouton flèche, bande de couleur de la marque en bas). 6 case studies récentes de explorance.com/case-studies (Blue et MLY) : USI, University of Law, University of West London, University of Newcastle, Heriot-Watt, Indiana University Bloomington.

Sur mobile, les flèches passent sous le carousel, de part et d'autre des points.

## Lancer

Site statique, sans build : ouvrir `index.html`.

## Fichiers

- `index.html` — la page de propositions
- `styles.css` — styles repris du site (couleurs, ombres, tailles Tailwind)
- `carousel.js` — carousel en JS natif sur `scroll-snap` (swipe, trackpad, clavier, glisser à la souris)
- `assets/` — icônes et blob de la maquette Figma (variante D)
- `logos/` — anciens logos SVG des témoignages, recolorés en #ADADC5 (plus utilisés par D)
- `data.js` / `case-studies.json` — les 10 case studies Blue (source : explorance.com/case-studies) et, pour la variante D, la catégorie, la citation, le nom et la fonction repris de chaque page de case study

La police du site (Oakes Grotesk) est sous licence commerciale : Inter la remplace ici.
