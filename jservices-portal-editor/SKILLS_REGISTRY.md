# 📖 Registre des Compétences & Règles du Projet

Ce document répertorie les prérequis techniques et les choix d'architecture pour le projet **J+Services Portal Editor**.

## 🚀 Stack Technique
- **Framework** : Vite + React (TypeScript)
- **State Management** : [Zustand](https://github.com/pmndrs/zustand) (Simple, performant, persistance facile)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta) (Utilisant les nouvelles fonctionnalités CSS-first)
- **Moteur de Template** : [EJS](https://ejs.co/) (Utilisé pour générer dynamiquement le code HTML compatible RouterOS MikroTik)
- **Utilitaires** :
    - [Lucide React](https://lucide.dev/) (Icônes)
    - [JSZip](https://stuk.github.io/jszip/) (Exportation des templates)
    - [File-Saver](https://github.com/eligrey/FileSaver.js/) (Téléchargement client-side)

## 🏗️ Architecture
- `src/core` : Contient les templates EJS de base et la logique de compilation.
- `src/store` : État global de l'éditeur (Branding, Forfaits, Paiement).
- `src/components/editor` : Formulaires et contrôles de personnalisation.
- `src/components/preview` : Simulateur mobile avec rendu temps réel.
- `src/utils` : Services transversaux (Export ZIP).

## 🛡️ Règles de Développement
1. **Souveraineté des Données** : Toutes les modifications doivent être reflétées instantanément dans le store Zustand.
2. **Compatibilité MikroTik** : Le code généré ne doit pas utiliser de scripts externes bloqués par les hotspots sans walled-garden (Privilégier le CSS/JS inline).
3. **Design Premium** : Suivre les directives de design "Wow" (Gradients, micro-animations, ombres portées).
4. **Anti-Régression** : Sauvegarder les fichiers dans `.CloneBeforeUpdate` avant toute modification majeure.

## 🧠 Compétences Requises (Skills)
- `Skill: UI Design (Tailwind CSS v4)`
- `Skill: MikroTik Hotspot Templating (EJS/RouterOS)`
- `Skill: State Management (Zustand)`
- `Skill: Frontend Architect (React/Vite)`
