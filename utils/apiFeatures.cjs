const qs = require("qs");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;

    // Since Hapi does not support parse the query string at default so we have to use qs package to parse the query string to right format
    this.queryString = qs.parse(queryString, { allowDots: true });
  }

  // Filter the query by the query string - example: duration[gte]=7
  filter() {
    const queryObject = { ...this.queryString };
    console.log(queryObject);

    // Exclude fields that not allowed user to use to filter the query
    const excludeFields = ["page", "sort", "limit", "fields"];

    // Remove extra fields from the query
    excludeFields.forEach((val) => delete queryObject[val]);

    // Format the query string to match the mongodb find syntax
    let queryString = JSON.stringify(queryObject);

    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  // Sort the results: sort=a,b,c
  sort() {
    if (this.queryString.sort) {
      if (this.queryString.sort) {
        // Format the query string sort
        const sortBy = this.queryString.sort.split(",").join(" ");

        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
    }
    return this;
  }

  // Explicit the field that needs to be returned - examples:
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
