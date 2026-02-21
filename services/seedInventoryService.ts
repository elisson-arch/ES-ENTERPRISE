
import { inventoryService } from '../services/inventoryService';

const SEED_ASSETS = [
    {
        clientId: 'Hospital_Sao_Luiz_ID',
        type: 'Chiller Industrial Parafuso',
        brand: 'Carrier',
        model: '30XW',
        serialNumber: 'CRR-9981-P',
        installationDate: '15/03/2023',
        lastMaintenance: '10/01/2024',
        organizationId: 'org_123'
    },
    {
        clientId: 'Condominio_Aurora_ID',
        type: 'Split Hi-Wall Inverter 12k BTU',
        brand: 'Daikin',
        model: 'FTKC12',
        serialNumber: 'DKN-2024-X102',
        installationDate: '12/01/2024',
        lastMaintenance: '15/05/2024',
        organizationId: 'org_123'
    },
    {
        clientId: 'Academia_Fit_ID',
        type: 'Cassette 360 Inverter Central',
        brand: 'LG',
        model: 'Multi V S',
        serialNumber: 'LG-MX-5541',
        installationDate: '05/02/2024',
        lastMaintenance: '20/05/2024',
        organizationId: 'org_123'
    }
];

export const seedInventory = async () => {
    console.log('[SeedInventory] Iniciando semeadura de ativos...');
    for (const asset of SEED_ASSETS) {
        try {
            await inventoryService.createAsset(asset);
            console.log(`✅ Ativo ${asset.brand} adicionado.`);
        } catch (err) {
            console.error(`❌ Erro ao adicionar ${asset.brand}:`, err);
        }
    }
    console.log('[SeedInventory] Concluído.');
};
