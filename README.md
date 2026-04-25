# J+Services Portal Editor

Frontend autonome pour construire et prévisualiser les portails captifs MikroTik du produit TiketMOMO.

## Résumé

- Application frontend: `React + Vite + TypeScript`
- État: `Zustand`
- Templates: `EJS`
- UI preview: rendu temps réel du portail captif
- Déploiement live: `/var/www/html/portal-editor`
- Base publique du portail: `https://jmoai.net/portal-editor/`

Le backend ne fabrique pas les liens de paiement. Il fournit les données brutes, l’auth et les webhooks.  
Le frontend compose le lien final selon la convention RouterOS attendue.

## Convention des liens de paiement

Le portail éditeur doit conserver les macros RouterOS en clair dans l’URL finale:

```text
https://tpay.mikhmoai.com/buy-ticketmomo?nasid=$(server-name)&amount=150&currency=cfa&profile_name=150F-8H&timelimit=8h&data_limit=1Go&mac=$(mac)&ip=$(ip)&link-status=$(link-status-esc)&pub_key=XXXX
```

Règles:

- `$(server-name)`, `$(mac)`, `$(ip)`, `$(link-status-esc)` restent non encodées dans le code généré.
- Le frontend affiche l’URL finale pour copie ou export.
- Le backend reçoit les callbacks/webhooks de paiement et n’impose pas la forme du lien.

## Arborescence utile

- `src/App.tsx` : bootstrap de l’application
- `src/components/editor` : panneaux d’édition
- `src/components/preview` : rendu live
- `src/core/templates` : templates de portail
- `src/utils` : helpers de génération, export et appels API

## Développement local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

Le build génère `dist/`, qui doit ensuite être synchronisé vers `/var/www/html/portal-editor`.

## Vérification et publication

```bash
npm run verify:payment-links
npm run publish:live
```

- `verify:payment-links` contrôle le bundle généré et bloque les macros encodées `%24%28...%29`
- `publish:live` rebuild, vérifie, puis synchronise `dist/` vers le dossier servi en prod

## Déploiement

Le site live est servi par Nginx sur:

- `https://jmoai.net/portal-editor/`

Le chemin local de publication utilisé en prod:

- `/var/www/html/portal-editor`

Après modification du code:

1. lancer `npm run publish:live`
2. rafraîchir l’éditeur dans le navigateur

## Intégration backend

Le frontend consomme:

- `GET /api/v1/clients/portal-editor/handshake`
- `GET /api/v1/clients/portal-editor/bootstrap`
- `GET /api/v1/clients/portal-editor/config`
- `PUT /api/v1/clients/portal-editor/config`
- `GET /api/v1/clients/portal-editor/deployment-plan`

## Notes

- L’app est indépendante du wrapper Next.js qui l’affiche dans `jservices-platform`.
- Le wrapper ne contient pas la logique métier de génération des templates.
- Toute évolution du format de lien doit rester compatible avec RouterOS/MikroTik.
