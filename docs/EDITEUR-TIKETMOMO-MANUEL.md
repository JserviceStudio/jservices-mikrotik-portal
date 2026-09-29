# Manuel Éditeur TiketMOMO

Ce document décrit l'utilisation du panneau "Routeur" intégré à l'Éditeur Portail Captif.

## Mode de Fonctionnement

Le panneau est accessible via l'onglet **Routeur** dans la barre latérale gauche.

### 1. État du Routeur
Le bandeau supérieur affiche en temps réel l'état du routeur tel qu'il est perçu par le système (API bootstrap) :
- **En Ligne** : Le routeur communique avec le système TiketMOMO. Les informations sont en lecture seule et font foi.
- **Hors Ligne / Saisie Manuelle Requise** : Le routeur n'est pas joignable. Le vendeur doit s'assurer que ses informations de configuration (numéro de série, modèles, hotspot...) sont correctes.

### 2. Formulaire de Déclaration (Mode Manuel)
Si le routeur est inaccessible, un formulaire est déverrouillé :
- Les champs sont pré-remplis à partir des dernières données connues.
- **Ajout/Modification de profils** : Vous pouvez modifier ou ajouter des profils (orthographe exacte, limite de temps, format de ticket).
- **Soumission** : Cliquez sur "Envoyer la déclaration NAS" pour forcer la synchronisation avec le backend et rétablir le service de vente.

### 3. Walled Garden
Le Walled Garden permet l'accès gratuit à certaines ressources, notamment les plateformes de paiement mobile.
- Cliquez sur "Vérifier / Générer".
- Le script généré doit être copié et exécuté sur le terminal de votre routeur MikroTik.
- Une commande de vérification est fournie pour s'assurer que le script s'est bien exécuté.
