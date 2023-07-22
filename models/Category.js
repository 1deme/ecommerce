const { Schema, model ,models } = require("mongoose");

const CategoryScheam = new Schema({
    name:{type:String, required:true},
});

export const Category = models?.Category || model('Category', CategoryScheam); 