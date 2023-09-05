import type { Filter } from './filter';

export type Query = {
  fields?: string[] | null;
  sort?: string | null;
  filter?: Filter | null;
  limit?: number | null;
  offset?: number | null;
  page?: number | null;
};

/*
export type Aggregate = {
	avg?: string[];
	avgDistinct?: string[];
	count?: string[];
	countDistinct?: string[];
	sum?: string[];
	sumDistinct?: string[];
	min?: string[];
	max?: string[];
};
*/
