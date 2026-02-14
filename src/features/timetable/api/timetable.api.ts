import type { Activity } from '../types'

const activities: Activity[] = [
    { id: 1, startTime: '15:30', endTime: '16:30', activity: 'Work', focus: '10' },
    { id: 2, startTime: '14:00', endTime: '15:00', activity: 'Study', focus: '9' },
]

export async function fetchActivities(): Promise<Activity[]> {
    return new Promise<Activity[]>((resolve) => {
        setTimeout(() => resolve(activities), 500)
    })
}

export async function createActivity(activity: Activity) {
    return new Promise((resolve) => {
        setTimeout(() => {
            activities.push(activity)
            return resolve('success')
        }, 500)
    })
}

export async function editActivity<K extends keyof Activity>(
    id: number,
    key: K,
    newVal: Activity[K],
) {
    const activity = activities.find((a) => a.id === id)

    if (!activity) throw Error('Activity not found')

    activity[key] = newVal

    return new Promise<string>((resolve) => {
        setTimeout(() => resolve('Activity updated'), 500)
    })
}
