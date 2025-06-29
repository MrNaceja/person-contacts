import { axios } from '@/lib/axios'
import type { PersonWithContacts } from '@/models/person'
import { queryOptions } from '@tanstack/react-query'

export const personsQuery = (searchName?: string | null) => queryOptions({
    queryKey: ['persons'],
    async queryFn() {
        const result = await axios.get<PersonWithContacts[]>('/person', {
            params: {
                name: searchName
            }
        })
        return result.data
    }
})