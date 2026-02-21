
import { clientService } from "./clientService";

const SEED_CLIENTS = [
    { name: 'Condomínio Residencial Aurora', document: '12.345.678/0001-90', email: 'contato@aurora.com.br', phone: '(11) 98765-4321', address: 'Av. das Flores, 450 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Ativo' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Hospital São Luiz', document: '98.765.432/0001-21', email: 'adm@saoluiz.com.br', phone: '(11) 5566-7788', address: 'Rua das Palmeiras, 100 - SP', type: 'Comercial' as const, origin: 'Google' as const, status: 'Prospecção' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Padaria Pão de Mel', document: '11.222.333/0001-44', email: 'contato@paodemel.com.br', phone: '(11) 2233-4455', address: 'Rua do Comércio, 12 - SP', type: 'Comercial' as const, origin: 'Site' as const, status: 'Ativo' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Academia Fit Life', document: '22.333.444/0001-55', email: 'vendas@fitlife.com', phone: '(11) 3344-5566', address: 'Av. Brasil, 1500 - SP', type: 'Comercial' as const, origin: 'WhatsApp' as const, status: 'Ativo' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Pizzaria Bella Italia', document: '33.444.555/0001-66', email: 'bella@italia.com', phone: '(11) 4455-6677', address: 'Rua de Roma, 80 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Prospecção' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Oficina do João', document: '44.555.666/0001-77', email: 'joao@oficina.com', phone: '(11) 5566-7788', address: 'Rua dos Motores, 5 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Inativo' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Clínica Sorriso', document: '55.666.777/0001-88', email: 'cli@sorriso.com', phone: '(11) 6677-8899', address: 'Av. Central, 200 - SP', type: 'Comercial' as const, origin: 'Site' as const, status: 'Ativo' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Escola Pequeno Príncipe', document: '66.777.888/0001-99', email: 'coord@principe.edu', phone: '(11) 7788-9900', address: 'Rua das Crianças, 45 - SP', type: 'Comercial' as const, origin: 'Manual' as const, status: 'Ativo' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Restaurante Sabor Caseiro', document: '77.888.999/0001-00', email: 'sabor@caseiro.com', phone: '(11) 8899-0011', address: 'Rua da Comida, 10 - SP', type: 'Comercial' as const, origin: 'WhatsApp' as const, status: 'Prospecção' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] },
    { name: 'Loja Variedades', document: '88.999.000/0001-11', email: 'loja@variedades.com', phone: '(11) 9900-1122', address: 'Av. Principal, 500 - SP', type: 'Comercial' as const, origin: 'Site' as const, status: 'Prospecção' as const, organizationId: 'org_123', updatedAt: new Date().toISOString(), assets: [] }
];

export const seedService = {
    async seedClients() {
        console.log('[SeedService] Iniciando semeadura de clientes...');
        for (const client of SEED_CLIENTS) {
            try {
                await clientService.createClient(client as any);
                console.log(`[SeedService] Cliente ${client.name} criado.`);
            } catch (err) {
                console.error(`[SeedService] Erro ao criar ${client.name}:`, err);
            }
        }
        console.log('[SeedService] Semeadura concluída.');
    }
};
