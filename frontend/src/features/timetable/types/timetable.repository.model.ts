import type { Activity } from './activity.model'

export interface TimetableRepository {
    getAll(): Promise<Activity[]>
    add(activity: Activity): Promise<void>
    update<K extends keyof Activity>(id: Activity['id'], key: K, val: Activity[K]): Promise<void>
    delete(id: Activity['id']): Promise<void>
}
