
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDm40vt670BG5pjsNQLSy5asNZAJG7rNmU",
    authDomain: "gen-lang-client-0696127674.firebaseapp.com",
    projectId: "gen-lang-client-0696127674",
    storageBucket: "gen-lang-client-0696127674.firebasestorage.app",
    messagingSenderId: "272378173364",
    appId: "1:272378173364:web:9c5e7b8cf8d75a8fe744e1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface SeedAsset {
    clientId: string;
    type: string;
    brand: string;
    model: string;
    serialNumber: string;
    installationDate: string;
    lastMaintenance: string;
    organizationId: string;
    updatedAt: string;
}

const SEED_ASSETS: SeedAsset[] = [
    {
        clientId: '3CLilZuSaryJiUJh9FQ6', // Condomínio Aurora
        type: 'Split Hi-Wall Inverter 12k BTU',
        brand: 'Daikin',
        model: 'FTKC12',
        serialNumber: 'DKN-2024-X102',
        installationDate: '12/01/2024',
        lastMaintenance: '15/05/2024',
        organizationId: 'org_123',
        updatedAt: new Date().toISOString()
    },
    {
        clientId: 'K1cu01b4ud6wYsKdgclL', // Hospital São Luiz
        type: 'Chiller Industrial Parafuso',
        brand: 'Carrier',
        model: '30XW',
        serialNumber: 'CRR-9981-P',
        installationDate: '15/03/2023',
        lastMaintenance: '10/01/2024',
        organizationId: 'org_123',
        updatedAt: new Date().toISOString()
    },
    {
        clientId: 'Academia_Fit_Placeholder',
        type: 'Cassette 360 Inverter Central',
        brand: 'LG',
        model: 'Multi V S',
        serialNumber: 'LG-MX-5541',
        installationDate: '05/02/2024',
        lastMaintenance: '20/05/2024',
        organizationId: 'org_123',
        updatedAt: new Date().toISOString()
    }
];

async function seed() {
    console.log('--- Iniciando Semeadura de Inventário (Direto) ---');
    for (const asset of SEED_ASSETS) {
        try {
            const docRef = await addDoc(collection(db, "assets"), asset);
            console.log(`✅ Ativo ${asset.brand} adicionado (ID: ${docRef.id})`);
        } catch (e: any) {
            console.error(`❌ Erro em ${asset.brand}:`, e.message);
        }
    }
    console.log('--- Semeadura Concluída ---');
    process.exit(0);
}

seed();
