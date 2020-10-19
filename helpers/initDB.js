import mongoose from 'mongoose';
//xMWYyha3t6kVPh9e

//mongodb+srv://sumanth:<password>@cluster0.0k7et.mongodb.net/<dbname>?retryWrites=true&w=majority 
function initDB(){
    if (mongoose.connections[0].readyState){
        console.log("Already connected to mongoDB")
        return;
    }
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    mongoose.connection.on('connected',()=>{
        console.log("Connected to mongoDB")
    })
    mongoose.connection.on('error',(err)=>{
        console.log("Error connecting to mongoDB", err)
    })
}

export default initDB;