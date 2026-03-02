import { expect, it, describe } from 'vitest'
import { isValidActivity, isValidFocus, isValidTime, isValidTodo } from './validator'

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
describe('Focus Validator', () => {
    it('identifies 5 as valid', () => {
        expect(isValidFocus('5')).toBe(true)
    })

    it('identifies 0 as valid', () => {
        expect(isValidFocus('0')).toBe(true)
    })

    it('identifies 10 as valid', () => {
        expect(isValidFocus('10')).toBe(true)
    })

    it('rejects 11', () => {
        expect(isValidFocus('11')).toBe(false)
    })

    it('rejects -1', () => {
        expect(isValidFocus('-1')).toBe(false)
    })

    it('rejects empty string', () => {
        expect(isValidFocus('')).toBe(false)
    })

    it('rejects non-numeric input', () => {
        expect(isValidFocus('abc')).toBe(false)
    })
})

describe('Activity Validator', () => {
    it('identifies empty string as valid', () => {
        expect(isValidActivity('')).toBe(true)
    })

    it('identifies 50 characters as valid', () => {
        expect(isValidActivity('a'.repeat(50))).toBe(true)
    })

    it('identifies normal text as valid', () => {
        expect(isValidActivity('Reading')).toBe(true)
    })

    it('rejects 51 characters', () => {
        expect(isValidActivity('a'.repeat(51))).toBe(false)
    })

    it('rejects 100 characters', () => {
        expect(isValidActivity('a'.repeat(100))).toBe(false)
    })
})

describe('Todo Validator', () => {
    it('identifies empty string as invalid', () => {
        expect(isValidTodo('')).toBe(false)
    })

    it('identifies 50 characters as valid', () => {
        expect(isValidActivity('a'.repeat(50))).toBe(true)
    })

    it('identifies normal text as valid', () => {
        expect(isValidActivity('Reading')).toBe(true)
    })

    it('rejects 51 characters', () => {
        expect(isValidActivity('a'.repeat(51))).toBe(false)
    })

    it('rejects 100 characters', () => {
        expect(isValidActivity('a'.repeat(100))).toBe(false)
    })
})
