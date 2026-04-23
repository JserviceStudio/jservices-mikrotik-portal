# 🛰️ Documentation Technique : Intégration J+SERVICES Cloud

Cette documentation définit comment l'Éditeur de Portail et le Moteur de Rendu (Portal Engine) collaborent au sein de l'infrastructure VPS.

## 1. Modèle de Données (SettingsSchema)
L'éditeur génère un JSON complexe stocké dans `client_store_profiles.store_settings`. Les clés principales sont :
- `branding` : Couleurs, logos, nom de l'ISP.
- `templates` : Choix du moteur (base-1 à base-4).
- `kyc` : Configuration des exigences ARCEP (Collecte de numéro).
- `payment` : Clés API et configuration des passerelles (FedaPay, T-Pay).

## 2. Rendu Dynamique (Portal Engine)
Le serveur Fastify (`jservices-portal-engine`) effectue les opérations suivantes :
1. **Extraction du Slug** : Identifie le client via l'URL `[slug].wifi.jmoai.net`.
2. **Hydratation** : Récupère les `store_settings` depuis Supabase.
3. **Compilation** : Utilise les fonctions `buildBaseXTemplate` pour générer le HTML final.
4. **Injection MikroTik** : Remplace les variables RouterOS `$(mac)`, `$(ip)` au moment du rendu.

## 3. Conformité ARCEP
Toute tentative de connexion avec collecte de numéro de téléphone est historisée.
- Table : `captive_identities`
- Champs : `mac_address`, `phone_number`, `nas_id`, `created_at`.

## 4. Pipeline de Paiement
Les boutons d'achat dans les templates pointent vers :
`https://api.jmoai.net/api/v1/payments/create-session?slug=[SLUG]&plan=[PLAN_ID]`
Le serveur gère la redirection vers la passerelle choisie.
