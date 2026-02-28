import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@web/vue/test-utils'
import { createTestingPinia } from '@web/pinia/testing'
import TodoList from '../../components/TodoList.vue'
import { useTodoListStore } from '../../store/todolist.store'
import TodoItem from '../../components/TodoItem.vue'

describe('TodoList', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    function mountComponent() {
        return mount(TodoList, {
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn,
                        stubActions: false,
                    }),
                ],
            },
        })
    }

    it('hides completed todos when hideDone is true', async () => {
        const wrapper = mountComponent()
        const store = useTodoListStore()

        store.todos = [
            { id: '1', text: 'Active', done: false },
            { id: '2', text: 'Completed', done: true },
        ]

        store.hideDone = true

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('Active')
        expect(wrapper.text()).not.toContain('Completed')
    })

    it('shows and hides menu', async () => {
        const wrapper = mountComponent()

        expect(wrapper.find('.shadow-md').exists()).toBe(false)

        await wrapper.findComponent({ name: 'BaseBurger' }).vm.$emit('update:modelValue', true)

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.shadow-md').exists()).toBe(true)
    })

    it('calls store.edit when todo toggled', async () => {
        const wrapper = mountComponent()

        const store = useTodoListStore()
        store.todos = [{ id: '1', text: 'Todo 1', done: false }]

        await wrapper.vm.$nextTick()

        const todoItem = wrapper.findComponent(TodoItem)
        expect(todoItem.exists()).toBe(true)

        const spy = vi.spyOn(store, 'edit')

        todoItem.vm.$emit('done', true)

        expect(spy).toHaveBeenCalledWith('1', 'done', true)
    })
})
