import type { Activity } from './activity.model'

export interface ActivityDB extends Activity {
    synced: 0 | 1
    deleted?: 0 | 1
    updatedAt: number
}
