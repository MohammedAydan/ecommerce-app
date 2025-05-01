import { apiBaseUrl } from '@/app/utils/strings';
import { getAccessToken } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface QueryParams {
    endpoint: string;
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortBy?: string;
    ascending?: boolean;
    filters?: Record<string, string | number | boolean>;
}

export const useGetTableData = <T>({
    endpoint,
    page = 1,
    limit = 20,
    searchTerm = '',
    sortBy,
    ascending = true,
    filters = {}
}: QueryParams) => {
    const { data, error, isLoading } = useQuery<T[]>({
        queryKey: [endpoint, page, limit, searchTerm, sortBy, ascending, filters],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(searchTerm && { search: searchTerm }),
                ...(sortBy && { sortBy }),
                ...(ascending !== undefined && { ascending: ascending.toString() }),
                ...Object.fromEntries(
                    Object.entries(filters).map(([key, value]) => [key, value.toString()])
                )
            });

            const url = `${apiBaseUrl}/api/v1/${endpoint}?${params.toString()}`;

            const accessToken = getAccessToken();

            const res = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            return res.json();
        },
    });

    return { data, error, isLoading };
};
