const { 
    getOne,getMany,
    create,update,
    deleteOne,
    getList,getManyReference 
} = require("./controllers.js");

function generateCRUD(router,modelName,model){

    // getList, getMany, getManyReference endpoint
    router.get(`/${modelName}`,async (req,res) => {
        const params = req.query;

        if (params.ids) {
            // GET http://my.api.url/modelName?id=id&id=456&id=789
            getMany(model,params).then(({status,response:{ data,total }}) => {
                res.set({
                    'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': total
                });
    
                res.status(status).json(data);
            })
        } else if(params._sort){
            // GET http://my.api.url/modelName?author_id=345
            getManyReference(model,params).then(({status,response:{total,data}}) => {
                res.set({
                    'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': total
                });
    
                res.status(status).json(data);
            })
        }else{
            // GET http://my.api.url/modelName?_sort=title&_order=ASC&_start=0&_end=24
            getList(model,params).then(({status,response:{total,data}}) => {
                res.set({
                    'Access-Control-Expose-Headers': 'X-Total-Count',
                    'X-Total-Count': total
                });
    
                res.status(status).json(data);
            })
        }
    });

    // getOne endpoint
    // GET http://my.api.url/modelName/id
    router.get(`/${modelName}/:id`,async (req,res) => {
        const params = req.params;
        getOne(model,params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });

    // create
    // POST http://my.api.url/modelName
    router.post(`/${modelName}`,async (req,res) => {
        const params = req.body;

        create(model,params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });

    // update
    // PUT http://my.api.url/modelName/id
    router.put(`/${modelName}/:id`,async (req,res) => {
        const params = { ...req.body, ...req.params };

        update(model,params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });

    // delete
    // DELETE http://my.api.url/modelName/id
    router.delete(`/${modelName}/:id`,async (req,res) => {
        deleteOne(model,req.params).then(({status,response:{data}}) => {
            res.status(status).json(data);
        })
    });
}

module.exports = {
    generateCRUD
}