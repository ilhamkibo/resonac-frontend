import api from "../lib/api/api";

export const measurementService = {
    async getMeasurementsDashboardData() {
        const response = await api.get('/measurements/dashboard');
        return response.data;
    }
} 