/**
 * Waiter Service
 * Handles real-time waiter call logic.
 * Currently using a simulated real-time approach, easily pluggable to Pusher/Socket.io.
 */

export interface WaiterCallRequest {
    businessId: string;
    tableId: string;
    type: 'BILL' | 'SERVICE' | 'OTHER';
    status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
    createdAt: Date;
}

class WaiterService {
    async callWaiter(request: WaiterCallRequest): Promise<boolean> {
        console.log(`[WaiterService] Calling waiter for Table ${request.tableId} at Business ${request.businessId}`);

        try {
            // Logic for sending real-time notification goes here
            // e.g., await api.post('/waiter/call', request);

            // For now, we simulate success
            return true;
        } catch (error) {
            console.error('[WaiterService] Error calling waiter:', error);
            return false;
        }
    }

    // Real-time listener placeholder
    subscribeToCalls(businessId: string, callback: (call: WaiterCallRequest) => void) {
        console.log(`[WaiterService] Subscribing to calls for business ${businessId}`);
        // implementation for Pusher/Socket.io
    }
}

export const waiterService = new WaiterService();
