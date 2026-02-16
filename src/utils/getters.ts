export function getDateDayMonth(now: Date) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(now)
    const day = String(now.getDate()).padStart(2, '0')

    return `${month} ${day}`
}
