export const filterOperator = {
  _eq: '=',
  _neq: '!=',
  _lt: '<',
  _lte: '<=',
  _gt: '>',
  _gte: '>=',
  _in: 'in',
  _nin: 'not in',
  _null: 'is null',
  _nnull: 'is not null',
  _contains: 'like',
  _icontains: 'ilike',
  _ncontains: 'not like',
  _starts_with: 'like',
  _istarts_with: 'ilike',
  _nstarts_with: 'not like',
  _nistarts_with: 'not ilike',
  _ends_with: 'like',
  _iends_with: 'ilike',
  _nends_with: 'not like',
  _niends_with: 'not ilike',
  _between: 'between',
  _nbetween: 'not between',
  _empty: 'is null or = false',
  _nempty: 'is not null and != false',
  _intersects: '&&',
  _nintersects: 'not &&',
};

export function getFilter(key: string, operator: string, value: any) {
  if (operator in filterOperator) {
    const _filterOperator = filterOperator[operator];
    switch (operator) {
      /*case '_in':
      case '_nin':
        return (query) => query.where(key, _filterOperator, value);
	*/
      case '_between':
      case '_nbetween':
        if (Array.isArray(value) && value.length === 2) {
          return (query) => query.whereBetween(key, value);
        }
        break; // Invalid _between or _nbetween value
      case '_intersects':
      case '_nintersects':
        return (query) =>
          query.whereRaw(`${key} ${_filterOperator} ?`, [value]);
		default:
			return (query) => query.where(key, _filterOperator, value);
    }
  }
  throw new Error(`Unsupported operator: ${operator}`);
}
