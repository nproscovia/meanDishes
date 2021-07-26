const mongoose = require("mongoose");


  
const ingredientsSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: Number,

    location: {
        type: String
    },
});

const dishesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    ingredients: [ingredientsSchema],
    
});


mongoose.model("Dish", dishesSchema, "dishes");
mongoose.model("Ingredients", ingredientsSchema,"ingredients");
