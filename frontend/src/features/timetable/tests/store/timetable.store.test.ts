import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTimetableStore } from '../../store/timetable.store'

vi.mock('../../timetableRepository', () => ({
    timetableRepository: {
        getAll: vi.fn(),
        add: vi.fn(),
        delete: vi.fn(),
        update: vi.fn(),
    },
}))

vi.mock('@productivity/shared/src/utils/validator', () => ({
    isValidTime: vi.fn(() => true),
    isValidFocus: vi.fn(() => true),
    isValidActivity: vi.fn(() => true),
}))

import { timetableRepository } from '../../timetableRepository'

const createActivity = () => ({
    id: '1',
    startTime: '12:00',
    endTime: '13:00',
    activity: 'Study',
    focus: '10',
})

describe('useTimetableStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('load sets activities', async () => {
        vi.mocked(timetableRepository.getAll).mockResolvedValue([createActivity()])

        const store = useTimetableStore()
        await store.load()

        expect(store.activities.length).toBe(1)
        expect(store.loading).toBe(false)
    })

    it('add pushes and persists', async () => {
        vi.mocked(timetableRepository.add).mockResolvedValue(undefined)

        const store = useTimetableStore()
        await store.add(createActivity())

        expect(store.activities.length).toBe(1)
        expect(timetableRepository.add).toHaveBeenCalled()
    })

    it('add rolls back on failure', async () => {
        vi.mocked(timetableRepository.add).mockRejectedValue(new Error())

        const store = useTimetableStore()

        await expect(store.add(createActivity())).rejects.toThrow()

        expect(store.activities.length).toBe(0)
        expect(store.error).toBe('Failed to create activity')
    })

    it('edit updates and persists', async () => {
        vi.mocked(timetableRepository.update).mockResolvedValue(undefined)

        const store = useTimetableStore()
        store.activities = [createActivity()]

        await store.edit('1', 'activity', 'Gym')

        expect(store.activities[0]!.activity).toBe('Gym')
        expect(timetableRepository.update).toHaveBeenCalled()
    })

    it('edit rolls back on failure', async () => {
        vi.mocked(timetableRepository.update).mockRejectedValue(new Error())

        const store = useTimetableStore()
        store.activities = [createActivity()]

        await store.edit('1', 'activity', 'Gym')

        expect(store.activities[0]!.activity).toBe('Study')
    })

    it('delete removes and persists', async () => {
        vi.mocked(timetableRepository.delete).mockResolvedValue(undefined)

        const store = useTimetableStore()
        store.activities = [createActivity()]

        await store.delete('1')

        expect(store.activities.length).toBe(0)
        expect(timetableRepository.delete).toHaveBeenCalled()
    })

    it('delete rolls back on failure', async () => {
        vi.mocked(timetableRepository.delete).mockRejectedValue(new Error())

        const store = useTimetableStore()
        store.activities = [createActivity()]

        await expect(store.delete('1')).rejects.toThrow()

        expect(store.activities.length).toBe(1)
        expect(store.error).toBe('Failed to delete activity')
    })

    it('createDraft creates draft if none exists', () => {
        const store = useTimetableStore()

        store.createDraft()

        expect(store.draftActivity).not.toBeNull()
    })

    it('addDraft persists valid draft', async () => {
        vi.mocked(timetableRepository.add).mockResolvedValue(undefined)

        const store = useTimetableStore()
        store.draftActivity = createActivity()

        await store.addDraft()

        expect(store.activities.length).toBe(1)
        expect(store.draftActivity).toBeNull()
    })

    it('addDraft restores draft on failure', async () => {
        vi.mocked(timetableRepository.add).mockRejectedValue(new Error())

        const store = useTimetableStore()
        store.draftActivity = createActivity()

        await store.addDraft()

        expect(store.draftActivity).not.toBeNull()
    })

    it('isDraftValid returns false for invalid draft if not start time provided', () => {
        const store = useTimetableStore()
        store.draftActivity = {
            id: '1',
            startTime: '',
            endTime: '',
            activity: '',
            focus: '',
        }

        expect(store.isDraftValid()).toBeFalsy()
    })

    it('isDraftValid returns false for invalid draft if not end time provided', () => {
        const store = useTimetableStore()
        store.draftActivity = {
            id: '1',
            startTime: '',
            endTime: '',
            activity: '',
            focus: '',
        }

        expect(store.isDraftValid()).toBeFalsy()
    })

    it('isDraftValid returns false for invalid draft if not activity provided', () => {
        const store = useTimetableStore()
        store.draftActivity = {
            id: '1',
            startTime: '',
            endTime: '',
            activity: '',
            focus: '',
        }

        expect(store.isDraftValid()).toBeFalsy()
    })

    it('isDraftValid returns false for invalid draft if not focus provided', () => {
        const store = useTimetableStore()
        store.draftActivity = {
            id: '1',
            startTime: '',
            endTime: '',
            activity: '',
            focus: '',
        }

        expect(store.isDraftValid()).toBeFalsy()
    })
})
