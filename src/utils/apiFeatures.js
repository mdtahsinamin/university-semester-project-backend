class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    // search depend on title
    search(){
        const keyword = this.queryStr.keyword ? {
            title:{
                $regex: this.queryStr.keyword,
                $options : "i"
            }
        } : {}

        //console.log(keyword);
        this.query = this.query.find({...keyword});
        return this;
    }
    // filter depend on categories
    filter(){
       const queryCopy = {...this.queryStr};
       // remove some field for categories
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key =>{
            delete queryCopy[key];
        })
         // filter for price and rating

         let queryStr = JSON.stringify(queryCopy);
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
       
         this.query = this.query.find(JSON.parse(queryStr));
         return this;
    }
    pagination(resultPerPage){
        // what is the page number you want to access
        const currentPage = Number(this.queryStr.page || 1);

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
    
}

module.exports = ApiFeatures;


/* 
     
     normal assignment just reference pass in javascript 
     ... operator used for copy the whole object 
    
 */ 