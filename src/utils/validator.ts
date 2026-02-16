export function isValidTime(s: string) {
    return /^(1[0-9]|2[0-3]|0[0-9]):[0-5][0-9]$/.test(s)
}

export function isValidFocus(focus: string) {
    // 0 <= focus <= 10
    const num = Number(focus)
    return focus !== '' && !isNaN(num) && num >= 0 && num <= 10
}

export function isValidActivity(activity: string) {
    return activity.length <= 50
}
