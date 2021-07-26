const mongoose = require("mongoose");
const { deleteOneDish } = require("./dishes.controllers");
const Dish = mongoose.model("Dish");


module.exports.ingredientsGetAll = function (req, res) {
 
  const dishId = req.params.dishId;
  Dish.findById(dishId).select("ingredients").exec(function (err, dish) {
    const response = {
      status: 200,
      message: dish

    }

    if (err) {
    
      response.status = 500;
      response.message = err;
    } else if (!dish) {
      response.status = 404;
      response.message = { "message": "dish Id not found " + dishId };
    } else {
      response.message = dish.ingredients;
    }

    res.status(response.status).json(response.message);

  });
};

const _addIngredient = function (req, res, dish) {
 

  const newIngredients = {
    name:req.body.name,
    price: req.body.price,
    location: req.body.location
  }
  if(!dish.ingredients){
        dish.ingredients = [];
  }
  dish.ingredients.push(newIngredients);
    console.log("bodyyyyyyy");
  dish.save(function (err, updatedDish) {
    const response = {
      status: 200,
      message: dish

    };
    if (err) {
      response.status = 500;
      response.message = err;

    } else {
      response.message = updatedDish;
      console.log(updatedDish)
    }
    res.status(response.status).json(response.message);

  });
};

module.exports.ingredientsAddOne = function (req, res) {
 console.log("bodieeeeeeeeeee")
  const dishId = req.params.dishId;
  Dish.findById(dishId).select("ingredients").exec(function (err, dish) {
    const response = {
      status: 201,
      message: dish
    };
    if (err) {
      response.status = 500;
      response.message = err;
    } else if (!dish) {
   
      response.status = 404;;
      response.message = { "message": "Dish id not found: " + dishId };
    }

    if (dish) {
      _addIngredient(req, res, dish);
    } else {
      res.status(response.status).json(response.message);
    }

  });

};

module.exports.ingredientFullUpdate = function (req, res) {
 
 
  const dishId = req.params.dishId;
 
  console.log("PUT dishId", dishId);

  Dish.findById(dishId).select("ingredients").exec(function (err, dish) {
    const response = {
      status: 204,
     
    };
    if (err) {
      console.log("Error finding dish");
      response.status = 500;
      response.message = err;

    } else if (!dish) {
     
      response.status = 404;
      response.message = { "message": "dish ID not found" };
    }
    if (response.status !== 204) {
      res.status(response.status).json(response.message);
      return;

    } 
      _updateIngredient(req, res, dish);

  });
};

const _updateIngredient = function (req, res, dish) {

  
   dish.ingredients.name = req.body.name;
   dish.ingredients.price = req.body.price;
   dish.ingredients.location = req.body.location;
  
  dish.save(function (err, dish) {  
    const response = {
      status: 204,
      message:dish
    };
    if (err) {
      response.status = 500;
      response.message = err;
      res.status(500).json(err);
          return;
    } 
    
    res.status(response.status).json(response.message);
  });
};

//PATCH:
module.exports.ingredientsPartialUpdate = function(req, res) {
  
  const dishId = req.params.dishId;
  Dish.findById(dishId).select("ingredients").exec(function(err, dish) {
      const response = {
          status: 204
      };

      if (err) {
          response.status = 500;
          response.message = err;

      } else if (!dish) {
          response.status = 404;
          response.message = { statusMessage: "dish not found!" };
      }
      if (response.status !== 204) {
          res.status(response.status).json(response.message);
          return;
      }

      _partialUpdateIngredients(dish, req, res);
  });
};

const _partialUpdateIngredients = function(dish, req, res) {

  if (req.body.name) 
      { dish.ingredients.name = req.body.name; }

  if (req.body.price) 
      { dish.ingredients.price = req.body.price; }
      if (req.body.location) 
      { dish.ingredients.location = req.body.location; }

  
  dish.save(function(err, updatedDish) {
      const response = {
          status: 204,
          message: updatedDish.ingredients
      };

      if (err) {
          response.status = 500;
          response.message = err;
      }
      res.status(response.status).json(response.message)
  });
};

//DELETE

module.exports.ingredientsDeleteOne = function (req, res) {
  const dishID = req.params.dishID;

  Dish.findById(dishID).exec(function (err, dish) {
      console.log("Found dish ", dish);
      if (err) {
          res.status(500).json(err);
      } else if (!dish) {
          res.status(404).json({ "message": "dishId not found" });
      }

      if (dish) {
          dish.ingredients.remove();
          dish.save(function (err, updatedDish) {
              if (err) {
                  res.status(500).json(err);
              } else {
                  res.status(204).json(updatedDish.ingredients);
              }
          });
       
      }
      
  });
};