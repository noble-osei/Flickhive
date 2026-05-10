export const validateQueryOptions = (query, options = {}) => {
  if (options.select) {
    query = query.select(options.select);
  }
  if (options.populate) {
    // Populate each element if options.populate is an array
    if (Array.isArray(options.populate)) {
      options.populate.forEach((pop) => {
        query = query.populate(pop);
      });
    } else {
      query = query.populate(options.populate);
    }
  }
  if (options.sort) {
    query = query.sort(options.sort);
  }
  if (options.lean) {
    query = query.lean();
  }

  return query;
};
