const express = require("express")
var cors = require('cors');
const Class = require("./models/school");
const bodyParser = require('body-parser')
const User = require("./models/users")
const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();
const secret ="supersecret"
app.use("/api",router);


console.log("works")
//start the server

//creating a new user
router.post("/user",async(req,res)=>{
if(!req.body.username || !req.body.password){
    res.status(400).json({error: "Missing username or password"})
}
 const newUser = await new User({
username: req.body.username,
password: req.body.password,
staus: req.body.status
})
try{
    await newUser.save()
    console.log(newUser)
    res.sendStatus(201)//created
}
catch(err){
 res.status(400).send(err)
}
})

//this is to get everything form the database

router.get("/class",async(req,res)=>{
    try{
const course = await Class.find({})
 res.send(course)
    console.log(course)
    }
    catch(err){
console.log(err)
    }

})

// add class to the database
    router.post("/class", async(req,res)=>{
    try{
        const newClass =  await new Class(req.body)
        await newClass.save()
        res.status(201).json(newClass)
        console.log(newClass)
    }
    catch(err){
        req.status(400).send(err)

    }
})


//grab a single class from the database
router.get("/class/:id", async (req,res)=>{
    try{
      const oneclass = await Class.findById(req.params.id)
      res.json(oneclass)
    }
    catch(err){
        res.status(400).send(err)
    }
})

// Delete a class
router.delete("/class/:id", async (req, res) => {
    try {
        const oneclass = await Class.findById(req.params.id);
        if (!oneclass) {
            return res.status(404).send({ error: "Class not found" });
        }

        await Class.deleteOne({ _id: req.params.id });
        res.sendStatus(204); // No Content
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});


//update a class
router.put("/class/:id", async (req,res)=>{
    //first we need to find and update the class the front wants
    // we need a request the id of class form the request
    try{
         const oneclass = req.body
         await  Class.updateOne({_id :req.params.id},oneclass)
         console.log(oneclass)
         res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
})




//authenticate or login 
//post request - reson why is become when you login you are creating what call a new session
router.post("/auth",async(req,res)=>{
 if(!req.body.username || !req.body.password){
    res.status(400).json({error:"Missing username or password"})
    return 
 }  
 //try to dfind the username in database, then see if it matches with a username and password
 //await finding user
let user = await User.findOne({username: req.body.username})
    //Connection or server error
   
    //if they cannot find user
     if(!user){
        res.status(401).json({error:"Bad Username"})
    }
    //check to see if the user password matches the request password
    else{
        if(user.password != req.body.password){
            res.status(401).json({error:"Bad password"})
        }
        //good login 
        else{
            //create a token that is encoeded with the jwt library, send back the username.. this will be important later
            // we also will send back as part of the token that you current authorized
            //we could do this with a boolean or a number value i.e if auth = 0 your are not authorized,
            //if auth equals 1 you are good
            username2 = user.username
            const token = jwt.endcode({username: user.username},secret)
            const auth = 1
            //respond with the token
            res.json({
                username2,
                token:token,
                auth:auth
            })
        }
    }
 }) 

 //check status of user with a valid token, see if it matches the toekn 
 router.get("/status", async(req,res)=>{
   if(!req.headers["x-auth"]){
    return res.status(401).json({error: "Missing X-Auth"})
   }
   //if x-auth contains the token(it should)
   const token = req.header["x-auth"]
   try{
    const decoded = jwt.decode(token,secret)
    //send back all username and status fields to the user or front end
    let users= User.find({}, "username status")
    res.json(users)
   }
   catch(ex){
res.status(401).json({error: "invalid jwt"})
   }
 })
// this is so that it can be host on a web hosting sit if we want it too 
var port = process.env.PORT || 3000
app.listen(port);