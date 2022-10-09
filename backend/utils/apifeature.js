class ApiFeatures {
    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
    }

    search() {
        const keyword = this.querystr.keyword ? {
            name: {
                $regex: this.querystr.keyword,
                $options: "i",
            }
        } : {}

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter() {
        const querystr_copy = { ...this.querystr }; //{}it makes copy not refernce;

        // removing some fileds for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((ele) => delete querystr_copy[ele]);

        // filter for price and rating
        let queryString= JSON.stringify(querystr_copy);
        queryString=queryString.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);  

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }
    
    pagination(resultPerPage){
        const currentPag=Number(this.querystr.page)||1;
        const skip=resultPerPage*(currentPag-1);
        this.query=this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;