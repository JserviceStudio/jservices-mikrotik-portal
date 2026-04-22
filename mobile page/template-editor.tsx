import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Alert, ActivityIndicator, Switch, Platform,
    KeyboardAvoidingView
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Palette, Phone, Download, Send, Eye,
    ChevronUp, ChevronDown, Link, CheckCircle2, Circle,
    Sparkles, Globe, RefreshCw, Layers, DollarSign, CreditCard
} from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import {
    useHotspotTemplateStore, BadgeType, BADGE_CONFIG, parseProfileLabel, PortalPlan
} from '@/store/hotspotTemplateStore';
import { HotspotGenerator } from '@/services/hotspot/HotspotGenerator';
import { HotspotUploader } from '@/services/hotspot/HotspotUploader';
import { HotspotServer } from '@/services/hotspot/HotspotServer';
import { useSessionStore } from '@/store/sessionStore';
import { ProfileMetadata, useHotspotStore } from '@/store/hotspotStore';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { HotspotApiService } from '@/services/hotspot/HotspotApiService';
import SimpleHeader from '@/components/ui/SimpleHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { HotspotProfile } from '@/constants/types';
import { useWebStore } from '@/hooks/useWebStore';

// ─────────────────────────────────────────────
// BADGE SELECTOR (pills)
// ─────────────────────────────────────────────
const BadgeSelector = ({
    selected,
    onSelect,
}: {
    selected: BadgeType;
    onSelect: (b: BadgeType) => void;
}) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
        {(Object.entries(BADGE_CONFIG) as [BadgeType, typeof BADGE_CONFIG[BadgeType]][]).map(([key, cfg]) => {
            const active = selected === key;
            return (
                <TouchableOpacity
                    key={key}
                    onPress={() => onSelect(key)}
                    style={{
                        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
                        borderWidth: 1.5,
                        borderColor: active ? cfg.color : 'rgba(255,255,255,0.12)',
                        backgroundColor: active ? cfg.color + '20' : 'transparent',
                    }}
                >
                    <Text style={{ color: active ? cfg.color : '#888', fontSize: 12, fontWeight: '600' }}>
                        {cfg.emoji ? `${cfg.emoji} ` : ''}{cfg.label}
                    </Text>
                </TouchableOpacity>
            );
        })}
    </View>
);

// ─────────────────────────────────────────────
// CARTE PROFIL DISPONIBLE (non sélectionné)
// ─────────────────────────────────────────────
const ProfileAvailableCard = React.memo(({
    profile,
    profileMeta,
    isSelected,
    onToggle,
    primaryColor,
    isDarkMode,
    colors,
}: {
    profile: HotspotProfile;
    profileMeta?: ProfileMetadata;
    isSelected: boolean;
    onToggle: () => void;
    primaryColor: string;
    isDarkMode: boolean;
    colors: any;
}) => {
    const { price, duration } = parseProfileLabel(profile.name);
    const rateLimit = profile['rate-limit'] || '';
    const sessionTimeout = profileMeta?.limitUptime || '';

    return (
        <TouchableOpacity
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onToggle();
            }}
            activeOpacity={0.75}
            style={[
                s.profileCard,
                {
                    backgroundColor: isSelected
                        ? primaryColor + (isDarkMode ? '18' : '10')
                        : (isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                    borderColor: isSelected ? primaryColor : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                }
            ]}
        >
            {/* Icône check */}
            <View style={{ marginRight: 12 }}>
                {isSelected
                    ? <CheckCircle2 size={24} color={primaryColor} fill={primaryColor + '25'} />
                    : <Circle size={24} color="#555" />}
            </View>

            {/* Info principale */}
            <View style={{ flex: 1 }}>
                <Text style={[s.profileName, { color: colors.text }]}>{profile.name}</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 3 }}>
                    {price !== profile.name && (
                        <View style={[s.infoChip, { backgroundColor: primaryColor + '20' }]}>
                            <Text style={[s.infoChipText, { color: primaryColor }]}>{price}</Text>
                        </View>
                    )}
                    {duration ? (
                        <View style={[s.infoChip, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                            <Text style={[s.infoChipText, { color: colors.textSecondary }]}>{duration}</Text>
                        </View>
                    ) : sessionTimeout ? (
                        <View style={[s.infoChip, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                            <Text style={[s.infoChipText, { color: colors.textSecondary }]}>{sessionTimeout}</Text>
                        </View>
                    ) : null}
                    {rateLimit ? (
                        <View style={[s.infoChip, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                            <Text style={[s.infoChipText, { color: '#94a3b8' }]}>{rateLimit}</Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {/* Sélectionné = encart "Sélectionné" */}
            {isSelected && (
                <View style={[s.selectedBadge, { backgroundColor: primaryColor }]}>
                    <Text style={s.selectedBadgeText}>✓ Actif</Text>
                </View>
            )}
        </TouchableOpacity>
    );
});

// ─────────────────────────────────────────────
// CARTE PROFIL SÉLECTIONNÉ (options avancées)
// ─────────────────────────────────────────────
const SelectedPlanRow = ({
    plan,
    profile,
    profileMeta,
    index,
    total,
    onBadge,
    onPaymentUrl,
    onReorder,
    onRemove,
    primaryColor,
    colors,
    isDarkMode,
}: {
    plan: PortalPlan;
    profile?: HotspotProfile;
    profileMeta?: ProfileMetadata;
    index: number;
    total: number;
    onBadge: (b: BadgeType) => void;
    onPaymentUrl: (url: string) => void;
    onReorder: (dir: 'up' | 'down') => void;
    onRemove: () => void;
    primaryColor: string;
    colors: any;
    isDarkMode: boolean;
}) => {
    const [showOptions, setShowOptions] = useState(false);
    const badgeCfg = BADGE_CONFIG[plan.badge] || BADGE_CONFIG.none;
    const { price, duration } = parseProfileLabel(plan.profileName);
    const sessionTimeout = profileMeta?.limitUptime || '';
    const rateLimit = profile?.['rate-limit'] || '';
    const dataLimit = profileMeta?.dataLimit || '';
    const displayDuration = duration || sessionTimeout;

    return (
        <Animated.View
            entering={FadeInRight.duration(300).delay(index * 50)}
            style={[
                s.selectedRow,
                {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    borderColor: primaryColor + '35',
                }
            ]}
        >
            {/* Handle + ordre */}
            <View style={s.selectedRowLeft}>
                <View style={{ alignItems: 'center', gap: 2 }}>
                    <TouchableOpacity onPress={() => onReorder('up')} disabled={index === 0} style={{ opacity: index === 0 ? 0.25 : 1 }}>
                        <ChevronUp size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={[s.orderNum, { color: primaryColor }]}>{index + 1}</Text>
                    <TouchableOpacity onPress={() => onReorder('down')} disabled={index === total - 1} style={{ opacity: index === total - 1 ? 0.25 : 1 }}>
                        <ChevronDown size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[s.selectedName, { color: colors.text }]} numberOfLines={1}>{plan.profileName}</Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 3 }}>
                        {price !== plan.profileName && (
                            <Text style={[s.selectedMeta, { color: primaryColor }]}>{price}</Text>
                        )}
                        {displayDuration && <Text style={[s.selectedMeta, { color: '#64748b' }]}>• {displayDuration}</Text>}
                        {dataLimit && <Text style={[s.selectedMeta, { color: '#64748b' }]}>• {dataLimit}</Text>}
                        {rateLimit && <Text style={[s.selectedMeta, { color: '#64748b' }]}>• {rateLimit}</Text>}
                    </View>
                </View>

                {/* Badge pill + toggle options */}
                <TouchableOpacity onPress={() => setShowOptions(o => !o)} style={s.badgePill}>
                    <View style={[s.badgeDot, { backgroundColor: badgeCfg.color + (plan.badge === 'none' ? '40' : 'FF') }]} />
                    <Text style={[s.badgePillText, { color: plan.badge === 'none' ? '#666' : badgeCfg.color }]}>
                        {plan.badge === 'none' ? 'Badge' : badgeCfg.label}
                    </Text>
                    {showOptions
                        ? <ChevronUp size={13} color="#666" />
                        : <ChevronDown size={13} color="#666" />}
                </TouchableOpacity>
            </View>

            {/* Options dépliables */}
            {showOptions && (
                <View style={s.selectedOptions}>
                    {/* Sélecteur badge */}
                    <Text style={[s.optLabel, { color: colors.textSecondary }]}>Badge affiché sur le portail</Text>
                    <BadgeSelector selected={plan.badge} onSelect={onBadge} />

                    {/* Lien de paiement */}
                    <Text style={[s.optLabel, { color: colors.textSecondary, marginTop: 12 }]}>Lien de paiement (optionnel)</Text>
                    <View style={[s.urlInput, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                        <Link size={14} color="#64748b" />
                        <TextInput
                            style={{ flex: 1, color: colors.text, fontSize: 13, marginLeft: 8 }}
                            value={plan.paymentUrl || ''}
                            onChangeText={onPaymentUrl}
                            placeholder="https://pay.example.com/..."
                            placeholderTextColor="#55555580"
                            autoCapitalize="none"
                            keyboardType="url"
                            autoCorrect={false}
                            spellCheck={false}
                        />
                    </View>

                    {/* Retirer */}
                    <TouchableOpacity
                        style={s.removeBtn}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onRemove();
                        }}
                    >
                        <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '600' }}>✕ Retirer du portail</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
};

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export default function HotspotTemplateEditor() {
    const { theme, colors, getGlassStyle, isDarkMode } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const {
        isGenerating,
        setIsGenerating,
        config,
        updateConfig,
        updateBranding,
        toggleProfile,
        isProfileSelected,
        updateProfileBadge,
        updateProfilePaymentUrl,
        reorderProfile,
        removeProfile,
        autoAssignBadges,
    } = useHotspotTemplateStore();

    // --- INTEGRATION MOAILTE STORE ---
    const { isNativeActive, nativeStoreData, isLicensed } = useWebStore();

    useEffect(() => {
        if (isNativeActive && isLicensed && nativeStoreData) {
            // 1. S'assurer que le clientId est à jour dans la config
            if (config.payment.clientId !== nativeStoreData.client_id) {
                updateConfig({
                    payment: {
                        ...config.payment,
                        clientId: nativeStoreData.client_id,
                        // Si aucun agrégateur n'est choisi, on met MoailteStore par default
                        aggregator: (config.payment.aggregator === 'none' || !config.payment.aggregator) ? 'MoailteStore' : config.payment.aggregator
                    }
                });
            }

            // 2. Pré-remplir les liens de paiement vides pour les profils sélectionnés
            let hasChanges = false;
            const updatedProfiles = config.selectedProfiles.map(p => {
                if (!p.paymentUrl) {
                    const { price, duration } = parseProfileLabel(p.profileName);
                    const amount = parseInt(price.replace(/\D/g, '')) || 0;
                    // Construction de l'URL pre-remplie (Direct Provisioning via JServices Hub)
                    const url = `https://api.jservices.com/api/v1/store/hotspot-purchase?client_id=${nativeStoreData.client_id}&nasid=$(server-name)&amount=${amount}&currency=XOF&profile_name=${encodeURIComponent(p.profileName)}&timelimit=${encodeURIComponent(duration)}&mac=$(mac)&ip=$(ip)&pub_key=${config.payment.apiKey || ''}`;
                    hasChanges = true;
                    return { ...p, paymentUrl: url };
                }
                return p;
            });

            if (hasChanges) {
                updateConfig({ selectedProfiles: updatedProfiles });
            }
        }
    }, [isNativeActive, isLicensed, nativeStoreData, config.selectedProfiles.length]);


    const [serverProfiles, setServerProfiles] = useState<any[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
    const [profilesMap, setProfilesMap] = useState<Record<string, HotspotProfile>>({});

    // Profils Hotspot déjà en store (depuis la dernière synchro)
    const storedProfiles = useHotspotStore(s => s.profiles);
    const profileMetadata = useHotspotStore(s => s.profileMetadata);

    const activeSession = useSessionStore((state) =>
        state.sessions.find(s => s.id === state.currentSessionId)
    );

    useEffect(() => {
        if (activeSession) fetchServerProfiles();
        return () => { HotspotServer.stop(); };
    }, [activeSession?.id]);

    // Construire le map profileName → HotspotProfile
    useEffect(() => {
        const map: Record<string, HotspotProfile> = {};
        storedProfiles.forEach(p => { map[p.name] = p; });
        setProfilesMap(map);
    }, [storedProfiles]);

    const fetchServerProfiles = async () => {
        if (!activeSession) return;
        setIsLoadingProfiles(true);
        try {
            const res = await HotspotApiService.getHotspotServerProfiles(activeSession);
            if (res.success && res.data) {
                setServerProfiles(res.data);
                const best = res.data.find((p: any) => p['dns-name'] === activeSession.dnsName)
                    || res.data.find((p: any) => p.name === 'default')
                    || res.data[0];
                if (best) setSelectedProfileId(best.name);
            }
        } catch (e) {
            console.error('[TemplateEditor]', e);
        } finally {
            setIsLoadingProfiles(false);
        }
    };

    const handlePreview = async () => {
        if (isPreviewLoading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsPreviewLoading(true);
        try {
            const previewUrl = await HotspotGenerator.generatePreview(config, profilesMap);
            await WebBrowser.openBrowserAsync(previewUrl, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.OVER_FULL_SCREEN
            });
        } catch (error) {
            console.error('[PreviewError]', error);
            Alert.alert('Erreur Preview', 'Impossible de lancer le serveur de visualisation local.');
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const handleExport = async () => {
        setIsGenerating(true);
        const ok = await HotspotGenerator.generateAndExport(config, profilesMap);
        setIsGenerating(false);
        if (!ok) Alert.alert('Erreur', 'Impossible de générer le portail captif.');
    };

    const handleDeploy = () => {
        if (!activeSession) { Alert.alert('Erreur', 'Aucune session MikroTik active.'); return; }
        if (!selectedProfileId) { Alert.alert('Profil manquant', 'Sélectionnez un profil de serveur Hotspot.'); return; }
        if (config.selectedProfiles.length === 0) { Alert.alert('Aucun plan', 'Cochez au moins un profil à afficher.'); return; }

        Alert.alert(
            'Déployer & Activer',
            `Envoi du portail sur le profil '${selectedProfileId}' (${activeSession.host}). Continuer ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déployer', onPress: async () => {
                        setIsGenerating(true);
                        try {
                            await HotspotGenerator.generateForExport(config, profilesMap);
                            const result = await HotspotUploader.deployToRouter(activeSession);
                            if (result.success) {
                                const act = await HotspotApiService.setHotspotHtmlDirectory(activeSession, selectedProfileId, 'hotspot-pro');
                                if (act.success) {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    Alert.alert('✅ Portail Actif !', `Design déployé et activé sur '${selectedProfileId}'.`);
                                } else {
                                    Alert.alert('Envoyé', "Fichiers sur le routeur. Activez manuellement 'html-directory=hotspot-pro' dans WinBox.");
                                }
                            } else {
                                Alert.alert("Échec", result.error || 'Erreur SFTP.');
                            }
                        } finally {
                            setIsGenerating(false);
                        }
                    }
                }
            ]
        );
    };

    const primaryColor = config.branding.primaryColor || colors.primary;
    const secondaryColor = config.branding.secondaryColor || primaryColor;
    const selectedCount = config.selectedProfiles.length;

    // Profils disponibles : ceux du store hotspot (synchro)
    const availableProfiles: HotspotProfile[] = storedProfiles.filter(p => p.name !== 'default');

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[s.container, { backgroundColor: theme.colors.background }]}
        >
            <SimpleHeader
                title="Portail Captif"
                onBack={() => router.back()}
                rightElement={
                    <TouchableOpacity
                        onPress={handlePreview}
                        disabled={isPreviewLoading}
                        style={[s.headerBtn, { backgroundColor: primaryColor + '20', opacity: isPreviewLoading ? 0.6 : 1 }]}
                    >
                        {isPreviewLoading ? (
                            <ActivityIndicator size="small" color={primaryColor} />
                        ) : (
                            <Eye size={16} color={primaryColor} />
                        )}
                        <Text style={[s.headerBtnText, { color: primaryColor }]}>
                            {isPreviewLoading ? 'Génération...' : 'Aperçu'}
                        </Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView
                contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 110 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[s.mainTitle, { color: colors.text }]}>Configuration du Portail</Text>
                <Text style={[s.mainSub, { color: colors.textSecondary }]}>Suivez les étapes pour créer votre portail captif sur mesure.</Text>

                {/* ── ÉTAPE 1 : CIBLE ── */}
                <Animated.View entering={FadeInDown.delay(100)} style={[s.stepCard, getGlassStyle(), { borderColor: primaryColor + '40' }]}>
                    <View style={s.stepBadge}><Text style={s.stepBadgeText}>1</Text></View>
                    <SectionTitle icon={Send} label="Profil de Serveur MikroTik" color={primaryColor} />
                    <Text style={[s.sectionSub, { color: colors.textSecondary, marginBottom: 16 }]}>
                        Sur quel service de votre routeur souhaitez-vous installer ce design ?
                    </Text>
                    {isLoadingProfiles
                        ? <ActivityIndicator color={primaryColor} size="small" />
                        : (
                            <View style={s.chipGrid}>
                                {serverProfiles.map((p: any) => (
                                    <TouchableOpacity
                                        key={p.name}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setSelectedProfileId(p.name);
                                        }}
                                        style={[
                                            s.chip,
                                            selectedProfileId === p.name
                                                ? { backgroundColor: primaryColor, borderColor: primaryColor }
                                                : { borderColor: colors.border, backgroundColor: 'transparent' }
                                        ]}
                                    >
                                        <Text style={[s.chipText, { color: selectedProfileId === p.name ? '#fff' : colors.textSecondary }]}>
                                            {p.name}{p['dns-name'] ? ` · ${p['dns-name']}` : ''}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                </Animated.View>

                {/* ── ÉTAPE 2 : DESIGN ── */}
                <Animated.View entering={FadeInDown.delay(200)} style={[s.stepCard, getGlassStyle()]}>
                    <View style={s.stepBadge}><Text style={s.stepBadgeText}>2</Text></View>
                    <SectionTitle icon={Palette} label="Branding & Identité" color={colors.text} />

                    <View style={s.inputGroup}>
                        <LabelInput label="Nom de votre Réseau WiFi" colors={colors}>
                            <TextInput
                                style={[s.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                                value={config.branding.name}
                                onChangeText={t => updateBranding({ name: t })}
                                placeholder="ex: MA ZONE WIFI"
                                placeholderTextColor="#55555580"
                                autoCorrect={false}
                                returnKeyType="next"
                            />
                        </LabelInput>
                        <LabelInput label="Nom de l'Établissement / ISP" colors={colors}>
                            <TextInput
                                style={[s.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                                value={config.branding.ispName}
                                onChangeText={t => updateBranding({ ispName: t })}
                                placeholder="ex: MOAILTE SERVICES"
                                placeholderTextColor="#55555580"
                                autoCorrect={false}
                                returnKeyType="next"
                            />
                        </LabelInput>
                    </View>

                    <LabelInput label="Thèmes Rapides" colors={colors}>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                            {[
                                { name: 'Bleu', primary: '#2563eb', secondary: '#60a5fa' },
                                { name: 'Jaune', primary: '#eab308', secondary: '#fde047' },
                                { name: 'Orange', primary: '#f97316', secondary: '#fb923c' },
                            ].map((preset) => (
                                <TouchableOpacity
                                    key={preset.name}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        updateBranding({ primaryColor: preset.primary, secondaryColor: preset.secondary });
                                    }}
                                    style={{
                                        flexDirection: 'row', alignItems: 'center', gap: 6,
                                        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
                                        borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: preset.primary }} />
                                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: preset.secondary, marginLeft: -4 }} />
                                    </View>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>{preset.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </LabelInput>

                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                        <View style={{ flex: 1 }}>
                            <LabelInput label="Couleur Primaire" colors={colors}>
                                <TouchableOpacity
                                    style={[s.colorPicker, { borderColor: colors.border, backgroundColor: colors.surface }]}
                                    activeOpacity={0.8}
                                >
                                    <TextInput
                                        style={{ flex: 1, color: colors.text, fontSize: 13 }}
                                        value={config.branding.primaryColor}
                                        onChangeText={t => updateBranding({ primaryColor: t })}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        spellCheck={false}
                                    />
                                    <View style={[s.swatch, { backgroundColor: config.branding.primaryColor }]} />
                                </TouchableOpacity>
                            </LabelInput>
                        </View>
                        <View style={{ flex: 1 }}>
                            <LabelInput label="Couleur Accent" colors={colors}>
                                <TouchableOpacity
                                    style={[s.colorPicker, { borderColor: colors.border, backgroundColor: colors.surface }]}
                                    activeOpacity={0.8}
                                >
                                    <TextInput
                                        style={{ flex: 1, color: colors.text, fontSize: 13 }}
                                        value={config.branding.secondaryColor}
                                        onChangeText={t => updateBranding({ secondaryColor: t })}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        spellCheck={false}
                                    />
                                    <View style={[s.swatch, { backgroundColor: config.branding.secondaryColor }]} />
                                </TouchableOpacity>
                            </LabelInput>
                        </View>
                    </View>

                    <View style={s.featureGrid}>
                        {[
                            { key: 'darkMode', label: 'Mode Sombre', icon: Globe },
                            { key: 'qrScanner', label: 'Scanner QR', icon: RefreshCw },
                        ].map(({ key, label }) => (
                            <View key={key} style={[s.featureItem, { backgroundColor: (config.features as any)[key] ? primaryColor + '15' : 'transparent', borderColor: (config.features as any)[key] ? primaryColor + '40' : colors.border }]}>
                                <Text style={[s.featureLabel, { color: (config.features as any)[key] ? colors.text : colors.textSecondary }]}>{label}</Text>
                                <Switch
                                    value={(config.features as any)[key]}
                                    onValueChange={v => updateConfig({ features: { ...config.features, [key]: v } })}
                                    trackColor={{ false: colors.border, true: primaryColor + '80' }}
                                    thumbColor={(config.features as any)[key] ? primaryColor : '#9ca3af'}
                                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                />
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* ── ÉTAPE 3 : CATALOGUE ── */}
                <Animated.View entering={FadeInDown.delay(300)} style={[s.stepCard, getGlassStyle()]}>
                    <View style={s.stepBadge}><Text style={s.stepBadgeText}>3</Text></View>
                    <View style={s.rowBetween}>
                        <SectionTitle icon={Layers} label="Catalogue des Forfaits" color={colors.text} />
                        {selectedCount > 1 && (
                            <TouchableOpacity onPress={autoAssignBadges} style={s.magicBtn}>
                                <Sparkles size={14} color="#f59e0b" />
                                <Text style={s.magicBtnText}>Auto-Badges</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={[s.sectionSub, { color: colors.textSecondary, marginBottom: 12 }]}>
                        {selectedCount} profil{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''} sur votre portail.
                    </Text>

                    {availableProfiles.length === 0 ? (
                        <View style={s.emptyState}>
                            <RefreshCw size={24} color={colors.textSecondary} />
                            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8 }}>Aucun profil synchronisé</Text>
                        </View>
                    ) : (
                        <View style={s.profileGrid}>
                            {availableProfiles.map((profile) => (
                                <ProfileAvailableCard
                                    key={profile.name}
                                    profile={profile}
                                    profileMeta={profileMetadata[profile.name]}
                                    isSelected={isProfileSelected(profile.name)}
                                    onToggle={() => toggleProfile(profile)}
                                    primaryColor={primaryColor}
                                    isDarkMode={isDarkMode}
                                    colors={colors}
                                />
                            ))}
                        </View>
                    )}

                    {selectedCount > 0 && (
                        <View style={{ marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 }}>
                            <Text style={[s.optLabel, { color: primaryColor, marginBottom: 12 }]}>Configuration avancée des tarifs :</Text>
                            {config.selectedProfiles
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((plan, index) => (
                                    <SelectedPlanRow
                                        key={plan.profileName}
                                        plan={plan}
                                        profile={profilesMap[plan.profileName]}
                                        profileMeta={profileMetadata[plan.profileName]}
                                        index={index}
                                        total={selectedCount}
                                        onBadge={b => updateProfileBadge(plan.profileName, b)}
                                        onPaymentUrl={url => updateProfilePaymentUrl(plan.profileName, url)}
                                        onReorder={dir => reorderProfile(plan.profileName, dir)}
                                        onRemove={() => removeProfile(plan.profileName)}
                                        primaryColor={primaryColor}
                                        colors={colors}
                                        isDarkMode={isDarkMode}
                                    />
                                ))}
                        </View>
                    )}
                </Animated.View>

                {/* ── ÉTAPE 4 : PAIEMENT ── */}
                <Animated.View entering={FadeInDown.delay(400)} style={[s.stepCard, getGlassStyle()]}>
                    <View style={s.stepBadge}><Text style={s.stepBadgeText}>4</Text></View>
                    <SectionTitle icon={DollarSign} label="Paiement & Monétisation" color={colors.text} />

                    <Text style={[s.sectionSub, { color: colors.textSecondary, marginBottom: 12 }]}>
                        Comment vos clients vont-ils payer leurs codes ?
                    </Text>

                    <View style={s.chipGrid}>
                        {[
                            { id: 'none', label: 'Aucun (Gratuit)', icon: Globe },
                            { id: 'FedaPay', label: 'FedaPay (Direct)', icon: CreditCard },
                            { id: 'MoailteStore', label: 'Moailte Store', icon: Sparkles },
                        ].map((agg) => {
                            const isSelected = config.payment.aggregator === agg.id;
                            const isMoailte = agg.id === 'MoailteStore';
                            const moailteInactif = isMoailte && (!isNativeActive || !isLicensed);

                            return (
                                <TouchableOpacity
                                    key={agg.id}
                                    onPress={() => {
                                        if (moailteInactif) {
                                            Alert.alert('Indisponible', 'Vous devez avoir une licence Moailte Store active pour utiliser cette option.');
                                            return;
                                        }
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        updateConfig({ payment: { ...config.payment, aggregator: agg.id as any } });
                                    }}
                                    disabled={moailteInactif}
                                    style={[
                                        s.chip,
                                        isSelected
                                            ? { backgroundColor: primaryColor, borderColor: primaryColor }
                                            : { borderColor: colors.border, backgroundColor: 'transparent', opacity: moailteInactif ? 0.3 : 1 }
                                    ]}
                                >
                                    <Text style={[s.chipText, { color: isSelected ? '#fff' : colors.textSecondary }]}>
                                        {agg.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Sections spécifiques aux agrégateurs */}
                    {(config.payment.aggregator === 'MoailteStore' || config.payment.aggregator === 'FedaPay') && (
                        <Animated.View entering={FadeInDown} style={s.paymentConfig}>
                            <View style={s.inputGroup}>
                                {/* La clé publique est toujours nécessaire pour identifier le compte du client */}
                                <LabelInput label="Clé API Publique (FedaPay) *" colors={colors}>
                                    <TextInput
                                        style={[s.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                                        value={config.payment.apiKey || ''}
                                        onChangeText={t => updateConfig({ payment: { ...config.payment, apiKey: t } })}
                                        placeholder="pk_live_..."
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        spellCheck={false}
                                    />
                                </LabelInput>

                                {isLicensed && nativeStoreData ? (
                                    /* Si licence active, on affiche le Webhook au lieu du domaine Gateway */
                                    <View style={{ backgroundColor: primaryColor + '10', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: primaryColor + '30' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <CheckCircle2 size={16} color={primaryColor} />
                                            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }}>Liaison Backend Active (Moailte Store)</Text>
                                        </View>
                                        <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 12 }}>
                                            Vos encaissement sont synchronisés automatiquement avec votre ID : <Text style={{ fontWeight: '700', color: colors.text }}>{nativeStoreData.client_id}</Text>.
                                        </Text>

                                        <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>Configuration Webhook obligatoire :</Text>
                                        <Text style={{ color: colors.textSecondary, fontSize: 11, marginBottom: 8 }}>
                                            Copiez cette URL dans votre interface FedaPay pour recevoir les confirmations automatiques :
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const url = `https://live.jmoai.net/api/v1/webhooks/fedapay/${nativeStoreData.client_id}`;
                                                // Note: En production on utiliserait Clipboard.setString()
                                                Alert.alert('Copié !', `L'URL suivante a été préparée : \n\n${url}`);
                                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                            }}
                                            style={{ backgroundColor: colors.surface, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                        >
                                            <Text style={{ color: colors.text, fontSize: 10, flex: 1 }} numberOfLines={1}>
                                                https://live.jmoai.net/api/v1/webhooks/fedapay/{nativeStoreData.client_id}
                                            </Text>
                                            <RefreshCw size={12} color={primaryColor} />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    /* Sinon Fallback sur le domaine Gateway manuel pour FedaPay direct */
                                    config.payment.aggregator === 'FedaPay' && (
                                        <LabelInput label="Nom de domaine Gateway *" colors={colors}>
                                            <TextInput
                                                style={[s.input, {
                                                    color: colors.text,
                                                    borderColor: !config.payment.gatewayUrl ? '#ef4444' : colors.border,
                                                    backgroundColor: colors.surface
                                                }]}
                                                value={config.payment.gatewayUrl || ''}
                                                onChangeText={t => updateConfig({ payment: { ...config.payment, gatewayUrl: t } })}
                                                placeholder="ex: moailtesaler.com"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                spellCheck={false}
                                                keyboardType="url"
                                            />
                                            {!config.payment.gatewayUrl && (
                                                <Text style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>Configuration obligatoire pour FedaPay sans licence.</Text>
                                            )}
                                        </LabelInput>
                                    )
                                )}
                            </View>
                        </Animated.View>
                    )}
                </Animated.View>

                {/* ── ÉTAPE 5 : SUPPORT ── */}
                <Animated.View entering={FadeInDown.delay(500)} style={[s.stepCard, getGlassStyle()]}>
                    <View style={s.stepBadge}><Text style={s.stepBadgeText}>5</Text></View>
                    <SectionTitle icon={Phone} label="Contact & Support Client" color={colors.text} />

                    <View style={s.inputGroup}>
                        <LabelInput label="Ligne d'appel direct" colors={colors}>
                            <TextInput
                                style={[s.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                                value={config.contact.phone}
                                onChangeText={t => updateConfig({ contact: { ...config.contact, phone: t } })}
                                placeholder="+229 00 00 00 00"
                                keyboardType="phone-pad"
                            />
                        </LabelInput>

                        <LabelInput label="Numéro WhatsApp" colors={colors}>
                            <TextInput
                                style={[s.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
                                value={config.contact.whatsapp}
                                onChangeText={t => updateConfig({ contact: { ...config.contact, whatsapp: t } })}
                                placeholder="+229 96 93 78 64"
                                keyboardType="phone-pad"
                            />
                        </LabelInput>

                        <LabelInput label="Adresse ou Message de pied" colors={colors}>
                            <TextInput
                                style={[s.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface, height: 60, textAlignVertical: 'top' }]}
                                value={config.contact.address}
                                onChangeText={t => updateConfig({ contact: { ...config.contact, address: t } })}
                                placeholder="ex: Disponible 24h/7j..."
                                multiline
                            />
                        </LabelInput>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* ── BARRE D'ACTIONS ── */}
            <View style={[s.actionBar, {
                paddingBottom: insets.bottom + 12,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                borderTopColor: colors.border,
            }]}>
                <TouchableOpacity
                    style={[s.iconBtn, { borderColor: colors.border, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9' }]}
                    onPress={handleExport}
                    disabled={isGenerating}
                >
                    <Download size={21} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[s.deployBtn, { opacity: isGenerating ? 0.7 : 1 }]}
                    onPress={handleDeploy}
                    disabled={isGenerating}
                >
                    <LinearGradient
                        colors={[primaryColor, secondaryColor]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={s.deployGrad}
                    >
                        {isGenerating
                            ? <ActivityIndicator color="#fff" size="small" />
                            : <Send size={19} color="#fff" />}
                        <Text style={s.deployText}>
                            {isGenerating ? 'Déploiement...' : `Déployer${selectedCount > 0 ? ` (${selectedCount} forfait${selectedCount > 1 ? 's' : ''})` : ''}`}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

// ── Helpers composants ──
const SectionTitle = ({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Icon size={17} color={color} />
        <Text style={{ color, fontSize: 14, fontWeight: '700' }}>{label}</Text>
    </View>
);

const LabelInput = ({ label, children, colors }: { label: string; children: React.ReactNode; colors: any }) => (
    <View style={{ marginBottom: 14 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>{label}</Text>
        {children}
    </View>
);

// ── STYLES ──
const s = StyleSheet.create({
    container: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 8 },

    // Live preview
    liveCard: { borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 16 },
    liveWifi: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    liveName: { color: '#fff', fontSize: 20, fontWeight: '800' },
    liveIsp: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 10 },
    livePlans: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
    livePill: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center', minWidth: 60 },
    livePillName: { color: '#fff', fontWeight: '700', fontSize: 13 },
    livePillDur: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },

    // ── NOUVEAUX STYLES ÉTAPES ──
    mainTitle: { fontSize: 24, fontWeight: '800', marginTop: 10 },
    mainSub: { fontSize: 14, marginBottom: 20, opacity: 0.7 },

    stepCard: {
        borderRadius: 22, padding: 20, marginBottom: 20,
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
        position: 'relative', overflow: 'hidden'
    },
    stepBadge: {
        position: 'absolute', top: -5, right: -5, width: 40, height: 40,
        borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center', justifyContent: 'center',
    },
    stepBadgeText: { fontSize: 18, fontWeight: '900', opacity: 0.1, transform: [{ scale: 1.5 }] },

    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    inputGroup: { gap: 4 },

    colorPicker: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 46
    },

    featureGrid: { flexDirection: 'row', gap: 10, marginTop: 10 },
    featureItem: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 12, paddingRight: 4, paddingVertical: 4,
        borderRadius: 14, borderWidth: 1
    },
    featureLabel: { fontSize: 13, fontWeight: '600' },

    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    profileGrid: { gap: 8 },
    emptyState: { padding: 40, alignItems: 'center', opacity: 0.5 },

    toggleFeatureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    paymentConfig: { marginTop: 16, gap: 12 },
    errorText: { color: '#ef4444', fontSize: 11, marginTop: 4, fontWeight: '600' },

    // Existing cards (compat)
    card: { borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
    sectionSub: { fontSize: 13, lineHeight: 18, marginBottom: 10 },

    // Server profile chips
    chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
    chipText: { fontSize: 13, fontWeight: '500' },

    // Input
    input: { height: 46, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, fontSize: 14 },
    swatch: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },

    // Toggles
    toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
    toggleLabel: { fontSize: 14, fontWeight: '600' },
    toggleSub: { fontSize: 12 },

    // Profile cards (available)
    profileCard: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 14,
        borderWidth: 1.5, padding: 12, marginBottom: 4,
    },
    profileName: { fontSize: 15, fontWeight: '700' },
    infoChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    infoChipText: { fontSize: 11, fontWeight: '600' },
    selectedBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    selectedBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

    // Selected plan rows
    selectedRow: {
        borderRadius: 14, borderWidth: 1.5, marginBottom: 8, overflow: 'hidden',
    },
    selectedRowLeft: { flexDirection: 'row', alignItems: 'center', padding: 10 },
    orderNum: { fontSize: 13, fontWeight: '800' },
    selectedName: { fontSize: 14, fontWeight: '700' },
    selectedMeta: { fontSize: 12, fontWeight: '500' },
    badgePill: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    badgeDot: { width: 8, height: 8, borderRadius: 4 },
    badgePillText: { fontSize: 11, fontWeight: '600' },

    selectedOptions: { paddingHorizontal: 14, paddingBottom: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 10 },
    optLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 },
    urlInput: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1,
        borderRadius: 10, paddingHorizontal: 10, height: 42,
    },
    removeBtn: {
        alignSelf: 'center', marginTop: 10, paddingHorizontal: 16, paddingVertical: 7,
        borderRadius: 20, borderWidth: 1, borderColor: '#ef444440',
    },

    // Empty
    emptyProfiles: { alignItems: 'center', paddingVertical: 24 },
    refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    refreshBtnText: { fontSize: 13, fontWeight: '600' },
    magicBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: '#f59e0b15', borderWidth: 1, borderColor: '#f59e0b40' },
    magicBtnText: { fontSize: 12, fontWeight: '700', color: '#f59e0b' },

    // Action bar
    actionBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 14, paddingTop: 10, borderTopWidth: 1,
        flexDirection: 'row', gap: 12, alignItems: 'center',
    },
    iconBtn: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    deployBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
    deployGrad: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    deployText: { color: '#fff', fontSize: 15, fontWeight: '700' },

    // Header btn
    headerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    headerBtnText: { fontSize: 14, fontWeight: '600' },
});
