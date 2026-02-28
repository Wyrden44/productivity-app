import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@web/vue/test-utils'
import EditableCell from '../../components/EditableCell.vue'

function mountComponent(resetOnInvalidate = true) {
    return mount(EditableCell<string>, {
        props: {
            modelValue: 'Initial',
            validator: (v: string) => v.length > 3,
            resetOnInvalidate,
        },
        global: {
            stubs: {
                BaseTableCell: { template: '<div><slot /></div>' },
            },
        },
    })
}

describe('EditableCell', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    it('emits commit on blur when value is valid', async () => {
        const wrapper = mountComponent()

        const input = wrapper.find('input')

        await input.setValue('Valid value')
        await input.trigger('blur')

        expect(wrapper.emitted('commit')).toBeTruthy()
        expect(wrapper.emitted('commit')![0]).toEqual(['Valid value'])
    })

    it('emits commit on enter key when valid', async () => {
        const wrapper = mountComponent()

        const input = wrapper.find('input')

        await input.setValue('Valid value')
        await input.trigger('keydown.enter')

        expect(wrapper.emitted('commit')).toBeTruthy()
    })

    it('does not emit commit when invalid', async () => {
        const wrapper = mountComponent()

        const input = wrapper.find('input')

        await input.setValue('no') // too short
        await input.trigger('blur')

        expect(wrapper.emitted('commit')).toBeFalsy()
    })

    it('resets to original value when invalid and resetOnInvalidate is true', async () => {
        const wrapper = mountComponent(true)

        const input = wrapper.find('input')

        await input.setValue('no')
        await input.trigger('blur')

        expect((input.element as HTMLInputElement).value).toBe('Initial')
    })

    it('keeps invalid value when resetOnInvalidate is false', async () => {
        const wrapper = mountComponent(false)

        const input = wrapper.find('input')

        await input.setValue('no')
        await input.trigger('blur')

        expect((input.element as HTMLInputElement).value).toBe('no')
    })

    it('updates local value when modelValue changes', async () => {
        const wrapper = mountComponent()

        await wrapper.setProps({ modelValue: 'Updated' })

        const input = wrapper.find('input')

        expect((input.element as HTMLInputElement).value).toBe('Updated')
    })
})
