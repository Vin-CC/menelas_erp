export type PaginationMeta = {
    total: number;
    last_page: number;
    per_page: number;
    next_page: string | null;
    prev_page: string | null;
    current_page: number;
    max_page: number;
    limit: number;
};