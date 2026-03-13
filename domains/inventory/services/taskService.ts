
import { firestoreService } from '@shared/services/firestoreService';
import { OrderDocV2 } from '@domains/inventory/types/inventory.types';
import { where } from 'firebase/firestore';

const COLLECTION_NAME = 'orders';

export const taskService = {
    /**
     * Get all tasks for a specific technician
     */
    subscribeToTechnicianTasks(technicianId: string, callback: (tasks: OrderDocV2[]) => void) {
        return firestoreService.subscribe<OrderDocV2>(
            COLLECTION_NAME,
            (tasks) => {
                const sorted = [...tasks].sort((a, b) => 
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                );
                callback(sorted);
            },
            where('technicianId', '==', technicianId)
        );
    },

    /**
     * Get all tasks for an organization (for management)
     */
    subscribeToOrgTasks(orgId: string, callback: (tasks: OrderDocV2[]) => void) {
        return firestoreService.subscribe<OrderDocV2>(
            COLLECTION_NAME,
            (tasks) => {
                const sorted = [...tasks].sort((a, b) => 
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                );
                callback(sorted);
            },
            where('organizationId', '==', orgId)
        );
    },

    /**
     * Update task status (Check-in, Check-out, etc.)
     */
    async updateTaskStatus(taskId: string, status: OrderDocV2['status'], metadata?: { location?: { lat: number, lng: number }, report?: any }) {
        const updateData: Partial<OrderDocV2> & Record<string, unknown> = { status, updatedAt: new Date().toISOString() };
        
        if (status === 'in_progress') {
            updateData.checkIn = {
                time: new Date().toISOString(),
                location: metadata?.location
            };
        } else if (status === 'completed') {
            updateData.checkOut = {
                time: new Date().toISOString(),
                location: metadata?.location
            };
            updateData.technicalReport = metadata?.report;
        }

        return firestoreService.update(COLLECTION_NAME, taskId, updateData);
    },

    /**
     * Create a new task
     */
    async createTask(task: Omit<OrderDocV2, 'id' | 'createdAt' | 'updatedAt'>) {
        const payload = {
            ...task,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return firestoreService.add(COLLECTION_NAME, payload);
    }
};
