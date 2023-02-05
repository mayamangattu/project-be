const express = require('express')
const { ObjectId } = require('mongodb')
const restaurantsMiniApp = express.Router()
const mongoUtil = require('../mongoutil')

//read the body
restaurantsMiniApp.use(express.json())

// gets all the restaurants
 restaurantsMiniApp.get('/',async (req,res)=>{
   //   get the docs from restaurants coll
    try{
     const cursor = await mongoUtil.getDocs('Eator','restaurants')
     const restaurants = await cursor.toArray()
     res.send(restaurants)
    }catch(err){
      res.send(err.message)
         .status(500)
    }
 })

// gets all the locations
restaurantsMiniApp.get('/locations',async (req,res)=>{
   //   get the docs from locations coll
    try{
     const cursor = await mongoUtil.getDocs('Eator','locations')
     const locations = await cursor.toArray()
     res.send(locations)
    }catch(err){
      res.send(err.message)
         .status(500)
    }
 })





restaurantsMiniApp.get('/:city?',async (req,res)=>{
   // get the docs from locations coll
   const city=req.params.city
   let query={}
   query={"city":city}

   try{
    const cursor = await mongoUtil.getDocs('Eator','restaurants',query)
    const restaurants = await cursor.toArray()
    res.send(restaurants)
   }catch(err){
     res.send(err.message)
        .status(500)
   }
})







// the filters 

// http://8888/restaurants/filters          [post]
restaurantsMiniApp.post('/filters/:order/:pg',async (req,res)=>{
   /*  The below is the post object
         {
            "city":"Pune",
            "address": "FC Road",
            "costfortwo": "1000 - 1500",
            "mealtypes": "NightLife",
            "cuisines": {"$in":["North Indian","Fast Food"]}
         }
   */
   const query = req.body
   try {
     const cursor = await mongoUtil.getDocs("Eator","restaurants",query)
     const restaurants = await cursor.toArray()
     res.json(restaurants)
   } catch (error) {
      res.send(error.message)
         .sendStatus(500)
   }
})

//gets restaurant details for the given id
// here id is optional hence ? is put
 restaurantsMiniApp.get('/:id?',async (req,res)=>{
//     // get the docs from locations coll
     try{
//      //get the id from the parameters
      const {id} = req.params
//      //get the city and address the query strings
      const {city,address}=req.query

     let cursor
      if(id){
//         //that means id is passed
        cursor = await mongoUtil.getDocs('Eator','restaurants',{"_id":ObjectId(id)})
     }else if(city && address){
        //that means city and address is passed
         cursor = await mongoUtil.getDocs('Eator',
                                        'restaurants',
                                        {"city":city, "address":address})
      }else{
         // that means there is no id, no city and no address
         // in this case we will return all the restaurants
        cursor = await mongoUtil.getDocs('Eator','restaurants')
      }
     
      const restaurant = await cursor.toArray()
      res.send(restaurant)
     }catch(err){
       res.send(err.message)
          .sendStatus(500)
     }
  })

module.exports= restaurantsMiniApp