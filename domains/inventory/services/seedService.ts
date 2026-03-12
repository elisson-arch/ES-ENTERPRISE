import { clientService } from '@domains/clients/services/clientService';
import { tenantService } from '@domains/auth/services/tenantService';

const buildSeedClients = (organizationId: string) => {
    const now = new Date().toISOString();
    return [
        { name: 'Condominio Residencial Aurora', document: '12.345.678/0001-90', email: 'contato@aurora.com.br', phone: '(11) 98765-4321', address: 'Av. das Flores, 450 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Ativo' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Hospital Sao Luiz', document: '98.765.432/0001-21', email: 'adm@saoluiz.com.br', phone: '(11) 5566-7788', address: 'Rua das Palmeiras, 100 - SP', type: 'Comercial' as const, origin: 'Google' as const, status: 'Prospec\u00e7\u00e3o' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Padaria Pao de Mel', document: '11.222.333/0001-44', email: 'contato@paodemel.com.br', phone: '(11) 2233-4455', address: 'Rua do Comercio, 12 - SP', type: 'Comercial' as const, origin: 'Site' as const, status: 'Ativo' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Academia Fit Life', document: '22.333.444/0001-55', email: 'vendas@fitlife.com', phone: '(11) 3344-5566', address: 'Av. Brasil, 1500 - SP', type: 'Comercial' as const, origin: 'WhatsApp' as const, status: 'Ativo' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Pizzaria Bella Italia', document: '33.444.555/0001-66', email: 'bella@italia.com', phone: '(11) 4455-6677', address: 'Rua de Roma, 80 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Prospec\u00e7\u00e3o' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Oficina do Joao', document: '44.555.666/0001-77', email: 'joao@oficina.com', phone: '(11) 5566-7788', address: 'Rua dos Motores, 5 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Inativo' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Clinica Sorriso', document: '55.666.777/0001-88', email: 'cli@sorriso.com', phone: '(11) 6677-8899', address: 'Av. Central, 200 - SP', type: 'Comercial' as const, origin: 'Site' as const, status: 'Ativo' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Escola Pequeno Principe', document: '66.777.888/0001-99', email: 'coord@principe.edu', phone: '(11) 7788-9900', address: 'Rua das Criancas, 45 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Ativo' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Restaurante Sabor Caseiro', document: '77.888.999/0001-00', email: 'sabor@caseiro.com', phone: '(11) 8899-0011', address: 'Rua da Comida, 10 - SP', type: 'Comercial' as const, origin: 'WhatsApp' as const, status: 'Prospec\u00e7\u00e3o' as const, organizationId, updatedAt: now, assets: [] },
        { name: 'Loja Variedades', document: '88.999.000/0001-11', email: 'loja@variedades.com', phone: '(11) 9900-1122', address: 'Av. Principal, 500 - SP', type: 'Comercial' as const, origin: 'Site' as const, status: 'Prospec\u00e7\u00e3o' as const, organizationId, updatedAt: now, assets: [] }
    ];
};

export const seedService = {
    async seedClients() {
        const organizationId = tenantService.getCurrentOrgId();
        const seedClients = buildSeedClients(organizationId);
        console.log('[SeedService] Iniciando semeadura de clientes...');
        for (const client of seedClients) {
            try {
                await clientService.createClient(client as any);
                console.log(`[SeedService] Cliente ${client.name} criado.`);
            } catch (err) {
                console.error(`[SeedService] Erro ao criar ${client.name}:`, err);
            }
        }
        console.log('[SeedService] Semeadura concluida.');
    }
};
