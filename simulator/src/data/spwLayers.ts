export type RegulatoryLayerKey =
  | 'captage'
  | 'pollution'
  | 'karst'
  | 'natura'
  | 'zi'
  | 'drigm'

export type RegulatoryLayerDefinition = {
  key: RegulatoryLayerKey
  label: string
  color: string
  ok: string
  ko: string
  wmsUrl: string
  wmsLayers: string
  restUrl: string
  restLayers: string
  tolerance: string
}

export const REGULATORY_LAYERS: RegulatoryLayerDefinition[] = [
  {
    key: 'captage',
    label: 'Captages',
    color: '#C62828',
    ok: 'Hors zone de prévention de captage',
    ko: 'Zone de prévention de captage — vérification nécessaire',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/EAU/PROTECT_CAPT/MapServer/WMSServer',
    wmsLayers: '0,1,2,3',
    restUrl: 'https://geoservices.wallonie.be/arcgis/rest/services/EAU/PROTECT_CAPT/MapServer',
    restLayers: 'all:0,1,2,3',
    tolerance: '1',
  },
  {
    key: 'pollution',
    label: 'Pollution du sol',
    color: '#E65100',
    ok: 'Aucune donnée BDES identifiée',
    ko: 'Donnée BDES identifiée — vérification nécessaire',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/SOL_SOUS_SOL/BDES_INVENTAIRE/MapServer/WMSServer',
    wmsLayers: '0,1',
    restUrl: 'https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/BDES_INVENTAIRE/MapServer',
    restLayers: 'all:0,1',
    tolerance: '1',
  },
  {
    key: 'karst',
    label: 'Karst',
    color: '#6A1B9A',
    ok: 'Hors contrainte karstique identifiée',
    ko: 'Contrainte karstique potentielle — prudence',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/AMENAGEMENT_TERRITOIRE/CONTR_KARST/MapServer/WMSServer',
    wmsLayers: '0,1,2,3',
    restUrl: 'https://geoservices.wallonie.be/arcgis/rest/services/AMENAGEMENT_TERRITOIRE/CONTR_KARST/MapServer',
    restLayers: 'all:0,1,2,3',
    tolerance: '1',
  },
  {
    key: 'natura',
    label: 'Natura 2000',
    color: '#2E7D32',
    ok: 'Hors zone Natura 2000',
    ko: 'Zone Natura 2000 — vérification nécessaire',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/FAUNE_FLORE/NATURA2000/MapServer/WMSServer',
    wmsLayers: '0',
    restUrl: 'https://geoservices.wallonie.be/arcgis/rest/services/FAUNE_FLORE/NATURA2000/MapServer',
    restLayers: 'all:0',
    tolerance: '1',
  },
  {
    key: 'zi',
    label: 'Zones inondables',
    color: '#1565C0',
    ok: 'Hors zone inondable réglementaire',
    ko: 'Zone inondable — précautions spécifiques',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/EAU/ZI/MapServer/WMSServer',
    wmsLayers: '0,1,2,3,4,5',
    restUrl: 'https://geoservices.wallonie.be/arcgis/rest/services/EAU/ZI/MapServer',
    restLayers: 'all:0,2,4,6',
    tolerance: '1',
  },
  {
    key: 'drigm',
    label: 'Risques miniers / DRIGM',
    color: '#6A1B9A',
    ok: 'Hors zone de consultation DRIGM',
    ko: 'Zone DRIGM — consultation requise avant forage',
    wmsUrl: 'https://geoservices.wallonie.be/arcgis/services/SOL_SOUS_SOL/CONSULT_SSOL/MapServer/WMSServer',
    wmsLayers: '0,1,2,3,4',
    restUrl: 'https://geoservices.wallonie.be/arcgis/rest/services/SOL_SOUS_SOL/CONSULT_SSOL/MapServer',
    restLayers: 'all',
    tolerance: '2',
  },
]

export const REGULATORY_LAYER_KEYS = REGULATORY_LAYERS.map((layer) => layer.key)

export const REGULATORY_LAYER_BY_KEY = Object.fromEntries(
  REGULATORY_LAYERS.map((layer) => [layer.key, layer])
) as Record<RegulatoryLayerKey, RegulatoryLayerDefinition>

export function isRegulatoryLayerKey(value: string): value is RegulatoryLayerKey {
  return value in REGULATORY_LAYER_BY_KEY
}
