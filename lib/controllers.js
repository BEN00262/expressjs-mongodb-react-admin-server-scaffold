const mongoose = require('mongoose');

const convertRawIDToMongoDBId = (rawID) => mongoose.Types.ObjectId(rawID);

// used to massage mongodb _id to react admin's id
const renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => ({
    [newProp]: old,
    ...others
})

const rename_IdToId = (rawMongoDBObject) => renameProp('_id','id',rawMongoDBObject.toObject());

const massageResponses = (status,response) => ({
    status,
    response
});

// working
const getList = async (model,params = {}) => {
    const { _sort,_order,_start,_end } = params;

    try {
        let filteredDocuments = await model.find()
            .limit(+_end)
            .skip(+_start)
            .sort({[_sort]:_order.toLowerCase()});

        return massageResponses(200,{
            data: (filteredDocuments && filteredDocuments.map(rename_IdToId) ) || [],
            total: (filteredDocuments && filteredDocuments.length) || 0
        });

    }catch(error){
        console.log(error);
        return massageResponses(500,{
            data: [],
            total: 0
        })
    }
}

// getOne
// working
const getOne = async (model,params = {}) => {
    const { id } = params;

    try{
        let foundDocument = await model.findOne({ _id: convertRawIDToMongoDBId(id) });

        return massageResponses(200,{
            data:(foundDocument && rename_IdToId(foundDocument)) || {}
        })

    }catch(error){
        console.log(error);
        return massageResponses(500,{ data: {} })
    }
}

// partially working
const getMany = async (model,params = {}) => {
    const { ids } = params;

    try{
        ids = ids.map(convertRawIDToMongoDBId);

        let foundDocuments = await model.find({_id:{
            $in: ids
        }});

        return massageResponses(200,{
            data:(foundDocuments && foundDocuments.map(rename_IdToId)) || []
        });
    }catch(error){
        console.log(error);
        return massageResponses(500,{ data: [] })
    }
};

// getManyReference
// not working currently

const getManyReference = async (model,params = {}) => {
    const { _sort,_order,_start,_end,...rest } = params;

    try{
        // loop through the rest and try to find the target
        let targetKey = Object.entries(rest).find(x => mongoose.isValidObjectId(x[1]))[0];

        const {[targetKey]:target,...filter} = rest;

        let foundDocumentReferences = await model.find({_id: convertRawIDToMongoDBId(target)})
            .populate(filter)
            .limit(+_end)
            .skip(+_start)
            .sort({[_sort]:_order.toLowerCase()});

        return massageResponses(200,{
            data:(foundDocumentReferences && rename_IdToId(foundDocumentReferences)) || [],
            total: (foundDocumentReferences && foundDocumentReferences.length) || 0
        });

    }catch(error){
        console.log(error);
        return massageResponses(500,{ data:[],total: 0 })
    }
}

// create
// working
const create = async (model,params = {}) => {
    try{
        let createdModel = await new model(params).save();
        return massageResponses(201,{ data: rename_IdToId(createdModel) });
    }catch(error){
        console.log(error);
        return massageResponses(500,{ data: {} });
    }
}

// update
// working
const update = async (model,params = {}) => {
    const { id, ...rest } = params;
    try{
        let updatedModel = await model.findOneAndUpdate({
            _id: convertRawIDToMongoDBId(id)
        },{$set:rest},{ $new: true});

        return massageResponses(200,{ data: rename_IdToId(updatedModel) });
    }catch(error){
        console.log(error);
        return massageResponses(500,{ data: {} });
    }
}

// working
const deleteOne = async (model,params = {}) => {
    const { id } = params;

    try {
        await model.deleteOne({
            _id: convertRawIDToMongoDBId(id)
        });

        return massageResponses(200,{
            data: { id }
        });
    }catch(error){
        console.log(error);
        return massageResponses(500,{
            data: {}
        });
    }
}

module.exports = {
    getOne,
    getMany,
    create,
    update,
    deleteOne,
    getList,
    getManyReference
}