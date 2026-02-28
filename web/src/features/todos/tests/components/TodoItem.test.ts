import { describe, it, expect } from 'vitest'
import { mount } from '@web/vue/test-utils'
import TodoItem from '../../components/TodoItem.vue'

describe('TodoItem', () => {
    const todo = {
        id: '1',
        text: 'Test todo',
        done: false,
    }

    it('renders todo text', () => {
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        expect(wrapper.text()).toContain('Test todo')
    })

    it('renders checkbox as checked when todo is done', () => {
        const wrapper = mount(TodoItem, {
            props: {
                todo: {
                    ...todo,
                    done: true,
                },
            },
        })

        const checkbox = wrapper.findComponent({ name: 'BaseCheckbox' })

        expect(checkbox.props('checked')).toBe(true)
    })

    it('emits done event when checkbox is checked', async () => {
        const wrapper = mount(TodoItem, {
            props: { todo },
        })

        const checkbox = wrapper.findComponent({ name: 'BaseCheckbox' })

        await checkbox.vm.$emit('check', true)

        expect(wrapper.emitted()).toHaveProperty('done')
        expect(wrapper.emitted('done')![0]).toEqual([true])
    })

    it('emits done event when checkbox is unchecked', async () => {
        const wrapper = mount(TodoItem, {
            props: {
                todo: {
                    ...todo,
                    done: true,
                },
            },
        })

        const checkbox = wrapper.findComponent({ name: 'BaseCheckbox' })

        await checkbox.vm.$emit('check', false)

        expect(wrapper.emitted('done')).toBeTruthy()
        expect(wrapper.emitted('done')![0]).toEqual([false])
    })
})
