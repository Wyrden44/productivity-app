import { expect, it, describe } from 'vitest'
import { isValidTime } from './validator'

describe('Time Validator', () => {
    it('identifies 14:00 as valid', () => {
        expect(isValidTime('14:00')).toBe(true)
    })

    it('identifies 00:00 as valid', () => {
        expect(isValidTime('00:00')).toBe(true)
    })

    it('identifies 09:05 as valid', () => {
        expect(isValidTime('09:05')).toBe(true)
    })

    it('identifies 1:05 as valid', () => {
        expect(isValidTime('09:05')).toBe(true)
    })

    it('identifies 9:05 as valid', () => {
        expect(isValidTime('09:05')).toBe(true)
    })

    it('identifies 20:00 as valid', () => {
        expect(isValidTime('20:00')).toBe(true)
    })

    it('identifies 23:59 as valid', () => {
        expect(isValidTime('23:59')).toBe(true)
    })

    it('rejects 24:00', () => {
        expect(isValidTime('24:00')).toBe(false)
    })

    it('rejects 12:60', () => {
        expect(isValidTime('12:60')).toBe(false)
    })

    it('rejects malformed 3:5', () => {
        expect(isValidTime('3:5')).toBe(false)
    })

    it('rejects non-numeric input', () => {
        expect(isValidTime('ab:cd')).toBe(false)
    })

    it('identifies 009:00 as invalid', () => {
        expect(isValidTime('009:00')).toBe(false)
    })
})
