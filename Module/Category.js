const mongoose = require('mongoose');

const Shema= mongoose.Schema;

const CatShema= new Shema ({

   name:{
       type:String
   },
   slug:{
       type:String
   },
   parentId:{
       type:String
   },
   img:{
       type:String
   }

},{
    timestamps:true
})
module.exports= mongoose.model('category',CatShema)