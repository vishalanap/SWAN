const express = require('express')
const port = process.env.PORT || 5000
const app = express();
const cors = require("cors")
const bodyParser = require('body-parser')
const router = require('./routes')
const connection = require('./conn')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


app.listen(port, () => {
    console.log(`Listening to ${port}`)
})

app.use('/api',router)

// Route for customer login
app.post('/login', async (req,res) => {
    const {name, pass }= req.body
    connection.query(`SELECT * FROM user WHERE name="${name}" and user_id="${pass}";`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg': 'Some error occured' })
        }
        else{
            if(op.length === 0){
                console.log('yes')
                return res.status(200).json({'msg' : 'Invalid creds'})
            }
            else{
                return res.status(200).json({'msg': 'Success', data : op})
            }
        }
    })
})

// Route for user registration 
app.post('/register', async (req,res) => {
    console.log(req.body)
    const {name, pass ,add, ph}= req.body
    const q = `INSERT INTO users values("${pass}","${name}","${ph}","${add}");`
    connection.query(`${q}`,[1,2,3,4] ,(e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg': 'Some error occured' })
        }
        else{
                return res.status(200).json({'msg': 'Successfully Reigstered',})
        }
    })
})

//  Route for driver login
app.post('/logindriver', async (req,res) => {
    const {name, pass }= req.body
    connection.query(`SELECT * FROM driver WHERE name="${name}" and driver_id="${pass}";`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg': 'Some error occured' })
        }
        else{
            if(op.length === 0){
                console.log('yes')
                return res.status(200).json({'msg' : 'Invalid creds'})
            }
            else{
                return res.status(200).json({'msg': 'Success', data : op})
            }
        }
    })
})


//  Route for getting all the trip history of the user
app.post('/gettrips', async(req,res) => {
    const {user_id} = req.body
    connection.query(`select start_place, destination, fare from trip where user_id ="${user_id}";`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg': 'Some error occured' })
        }
        else{
            if(op.length === 0) 
                return res.status(200).json({data: op})
            const from = op[0].start
            const to = op[0].to_d
            connection.query(`SELECT * FROM trip2 WHERE from_s="${from}" and to_d="${to}"`, (e,opt) =>{
                console.log(opt)
            })
            return res.status(200).json({'msg': 'Sucess',data : op})
        }

    }) 
})

//  Get the driver's taxi details
app.post('/gettaxi',async (req,res) => {
    const {driver_id} = req.body
    connection.query(`SELECT * FROM taxi where taxi_id = ( SELECT taxi_id FROM driver WHERE driver_id="${driver_id}");`, (e,op) => {
        if(e){
            return res.status(400).json({'msg' : 'Error occured'})
        }
        else{
            res.status(200).json({msg : 'Success',data : op})
        }
    })
})

// Get drivers current location
app.get('/getlocation',async (req,res) => {
    connection.query(`SELECT * FROM location`, (e,op) => {
        if(e){
            return res.status(400).json({'msg' : 'Error occured'})
        }
        else{
            res.status(200).json({msg : 'Success',data : op})
        }
    })
})

