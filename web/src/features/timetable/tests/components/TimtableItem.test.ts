import { mount } from '@web/vue/test-utils'
import { createTestingPinia } from '@web/pinia/testing'
import { useTimetableStore } from '../../store/timetable.store'
import TimetableItem from '../../components/TimetableItem.vue'
import { nextTick } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'

function mountComponent() {
    return mount(TimetableItem, {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn,
                    stubActions: true,
                }),
            ],
            stubs: {
                BaseTableCell: true,
            },
        },
    })
}

describe('TimetableItem', () => {
    it('calls store.load on mount', () => {
        const wrapper = mountComponent()
        const store = useTimetableStore()

        expect(store.load).toHaveBeenCalled()
    })

    it('renders rows for activities', async () => {
        const wrapper = mountComponent()
        const store = useTimetableStore()

        store.activities = [
            {
                id: '1',
                startTime: '08:00',
                endTime: '09:00',
                activity: 'Work',
                focus: 'High',
            },
        ]

        await nextTick()

        const rows = wrapper.findAll('tbody tr')
        expect(rows.length).toBe(1)
    })

    it('calls delete when clicking "-"', async () => {
        const wrapper = mountComponent()
        const store = useTimetableStore()

        store.activities = [
            {
                id: '1',
                startTime: '',
                endTime: '',
                activity: '',
                focus: '',
            },
        ]

        await nextTick()

        await wrapper.find('button').trigger('click')

        expect(store.delete).toHaveBeenCalledWith('1')
    })

    it('creates draft on "+" click', async () => {
        const wrapper = mountComponent()
        const store = useTimetableStore()

        await wrapper.find('.add-draft').trigger('click')

        expect(store.createDraft).toHaveBeenCalled()
    })

    it('renders draft row when draftActivity exists', async () => {
        const wrapper = mountComponent()
        const store = useTimetableStore()

        store.draftActivity = {
            id: 'draft',
            startTime: '',
            endTime: '',
            activity: '',
            focus: '',
        }

        await nextTick()

        const rows = wrapper.findAll('tbody tr')
        expect(rows.length).toBe(1)
    })

    it('calls store.edit when cell commits', async () => {
        const wrapper = mount(TimetableItem, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        stubActions: true,
                    }),
                ],
                stubs: {
                    BaseTableCell: true,
                    EditableCell: {
                        template: `<input @blur="$emit('commit', 'NEW')" />`,
                    },
                },
            },
        })

        const store = useTimetableStore()

        store.activities = [
            {
                id: '1',
                startTime: '08:00',
                endTime: '09:00',
                activity: 'Work',
                focus: 'High',
            },
        ]

        await nextTick()

        await wrapper.find('input').trigger('blur')

        expect(store.edit).toHaveBeenCalledWith('1', 'startTime', 'NEW')
    })

    it('shows loading indicator', async () => {
        const wrapper = mountComponent()
        const store = useTimetableStore()

        store.loading = true
        await nextTick()

        expect(wrapper.text()).toContain('Loading...')
    })
})
