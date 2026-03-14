import { apiClient } from '@/services/apiClient'
import type { TodoDB } from './types/todo.db-model'

export const todoApi = {
    /*     async getAll() {
        const res = await apiClient.get('/api/todos')
        return res.data
    }, */

    async pull(lastSyncedAt: number) {
        const res = await apiClient.post('/api/todos/pull', { lastSyncedAt })
        return res.data
    },

    async upsert(todo: TodoDB) {
        const res = await apiClient.post('/api/todos/upsert', { ...todo })
        return res.data
    },

    /*   async update(id: string, data: any) {
        const res = await apiClient.patch(`/todos/${id}`, data)
        return res.data
    },

    async delete(id: string) {
        await apiClient.delete(`/todos/${id}`)
    },
    */
}
