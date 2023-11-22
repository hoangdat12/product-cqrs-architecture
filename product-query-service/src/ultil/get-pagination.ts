import { IPagination } from './interface/pagination.interface';

export const getPaginationData = (query: any): IPagination => {
  const { page, limit, sortBy } = query;
  return {
    page: page ? parseInt(page) : 1,
    limit: limit ? parseInt(limit) : 20,
    sortBy: sortBy ?? 'ctime',
  };
};
