const mongoose = require("mongoose");
const Dish = mongoose.model("Dish");
require("./ingredients.controllers");


module.exports.getalldishes = function(req,res){

let count =5;
let offset = 0;
const maxCount = 7;

if(require.query && require.query.count){
    count = parseInt(req.query.count, 10);

}

if(req.query && req.query.offset){
    offset = parseInt(req.query.offset, 10);
}

if (count > maxCount) {
    console.log("Error count exceeded");
    res.status(userError).json({ "message": "Connot exceede the count" });
}

if (isNaN(offset) || isNaN(count)) {
    res.status(400).json({ "message": "Querystring offset " });
    return;
}

Dish.find().skip(offset).limit(count).exec(function (err, dishes) {
    const response = {
        status: 200,
        message: dishes
    };
    if(err) {
        console.log("Error finding dishes", err);
       
        response.status = 500;
        response.message = err;
    }    
  
    res.status(response.status).json(response.message);
});
};

module.exports.getOneDish = function (req, res) {
    const dishId = req.params.dishId;
    Dish.findById(dishId).exec(function (err, dish) {
      console.log("GET dish  with dishid", dishId);
      res.status(200).json(dish);
    });
  };


module.exports.addOneDish = function (req, res) {

    console.log(req.body);

    const newDish = {
        name: req.body.name,
        country: req.body.country,
        ingredients: [req.body.ingredients]
        
    };

    Dish.create(newDish, function(err, dish) {
        const response = {
            status: 201,
            message: dish
        };

        if(err) {
            console.log("Error Creating dish");
            response.status = 400;
            response.message = err;
        } 
        res.status(response.status).json(response.message);
    });
}

module.exports.dishesFullUpdateOne = function (req, res) {
   
    const dishID = req.params.dishId;

    console.log("checking id")

    Dish.findById(dishID).select("-ingredients").exec(function (err, dish) {

      console.log("heyyyyyyyyyy")
        const response = {
            status: 204,
            
        };

        if (err) {
            console.log("Error finding dish");
            response.status = 500;
            response.message = err;
         } 
         else if (!dish) {
            response.status = 404;
            response.message = { "message": "dish ID not found" };
        }

        if (response.status !== 204) {
            res.status(response.status).json(response.message);
            return
            console.log("statussssesss")
        } ;
        console.log("statussssesss yessssss")
           
          dish.name= req.body.name;
          dish.country= req.body.country;
          dish.ingredients= req.body.ingredients;


         
            
           console.log("body reading")
        
                console.log("created")
            dish.save(function (err, updatedDish) {
                const response = {
                    status:204,
                    message:updatedDish
                };
                if (err) {
                    response.status = 500;
                    response.message = err;
                    res.status(500).json(err);
                    return;
                } 
                res.status(response.status).json(response.message);

                console.log("statussssesss created")
            });
            console.log("status end")
    });

    
};


module.exports.dishesPartialUpdateOne = function (req, res) {

    console.log("found6")
    
    const dishId = req.params.dishId;

    console.log("found7")

    Dish.findById(dishId).select("-ingredients").exec(function (err, dish) {
        const response = {
            status: 204,
            //message: game
        };

        console.log("found8")

        if (err) {

            response.status = 500;
            response.message = err;
        } 
       else if (!dish) {
            response.status = 400;
            response.message = { message: "Dish ID not found" };

            console.log("found9")
        }

        if (response.status !== 204) {
            res.status(response.status).json(response.message);
            console.log("found10")
            return;
        } 
          
            if (req.body.name) {
                dish.title = req.body.title;
            }
            console.log("found11")
            if (req.body.country) {
                dish.country = req.body.country;
            }
            console.log("found12")
            if (req.body.ingredients) {
                dish.ingredients = req.body.ingredients;
            }

            console.log("found")
            dish.save(function (err, updatedDish) {
                console.log("found2")
                const response={
                    status:204,
                    message:updatedDish
                }
                console.log("found3")
                if (err) {
                    response.status = 500;
                    response.message = err;
                    res.status(500).json(err);
                    return;
                } 
                console.log("found4")

                res.status(response.status).json(response.message);
                console.log("found5")
            })

    });
};


module.exports.deleteOneDish = function (req, res) {
  
    const dishId = req.params.dishId;
    Dish.findByIdAndDelete(dishId).exec(function (err, deletedDish) {
      const response = {
        status: 200,
        message: deletedDish
      }
      
      if (err) {
        res.status = 500;
        response.message = error;
      } else if (!deletedDish) {
       
        response.status = 404;
        response.message = { "message": "Dish ID not found" };
      }
      res.status(response.status).json({message: "Delete successful"});
    });
  }



