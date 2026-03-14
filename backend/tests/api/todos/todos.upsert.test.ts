import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/todos/upsert/route'
import * as service from '@/services/todo.service'
import { TodoInput } from '@productivity/shared/src/todos/todo.schema'

vi.mock('@/services/todo.service')

describe('POST /api/todos/upsert', () => {
    const validBody: TodoInput = {
        id: crypto.randomUUID(),
        text: 'Test',
        done: false,
        deleted: false,
        updatedAt: 1000,
    }

    it('returns 401 if x-user-id missing', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify(validBody),
        })

        const res = await POST(req)
        expect(res.status).toBe(401)
    })

    it('returns 400 if payload invalid', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            headers: { 'x-user-id': 'user1' },
            body: JSON.stringify({}),
        })

        const res = await POST(req)
        expect(res.status).toBe(400)
    })

    it('calls service when valid', async () => {
        vi.spyOn(service, 'upsertTodo').mockResolvedValue('created')

        const req = new Request('http://localhost', {
            method: 'POST',
            headers: { 'x-user-id': 'user1' },
            body: JSON.stringify(validBody),
        })

        const res = await POST(req)
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(service.upsertTodo).toHaveBeenCalledWith('user1', validBody)
        expect(json).toEqual({ status: 'created' })
    })
})
