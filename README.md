# Case Studies Explorance

Propositions de carousel pour la section **Case Studies** de [explorance.com/products/blue](https://explorance.com/products/blue/), qui affiche aujourd'hui 3 cartes fixes.

- **A · Fidèle** — la section actuelle en carousel : 3 cartes, flèches à côté du titre, points de pagination.
- **B · Filtres par secteur** — A + pastilles Higher Education / Business Schools / Healthcare.
- **C · Cartes immersives** — mise en page de A, cartes avec l'image de la case study en plein cadre et le titre en surimpression.
- **D · Une histoire à la fois** — une case study par slide : vidéo, citation, logo de l'institution, nom et fonction de la personne. Aucune case study n'a encore de vidéo : la vidéo du header Blue sert d'exemple.

Sur mobile, les flèches passent sous le carousel, de part et d'autre des points.

## Lancer

Site statique, sans build : ouvrir `index.html`.

## Fichiers

- `index.html` — la page de propositions
- `styles.css` — styles repris du site (couleurs, ombres, tailles Tailwind)
- `carousel.js` — carousel en JS natif sur `scroll-snap` (swipe, trackpad, clavier, glisser à la souris)
- `logos/` — logos SVG des témoignages (variante D), recolorés en #ADADC5
- `data.js` / `case-studies.json` — les 10 case studies Blue (source : explorance.com/case-studies) et les témoignages de la variante D (source : Testimonials de explorance.com/products/blue)

La police du site (Oakes Grotesk) est sous licence commerciale : Inter la remplace ici.
