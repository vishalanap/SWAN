const express = require('express')
const port = process.env.PORT || 6000
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
    connection.query(`SELECT * FROM user1 WHERE name="${name}" and user_id="${pass}";`, (e,op) => {
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
    const q = `INSERT INTO user1 values("${pass}","${name}");INSERT INTO user2 values("${pass}","${ph}");INSERT INTO user3 values("${pass}","${add}");INSERT INTO user4 values("${ph}","${name}");`
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
    connection.query(`SELECT * FROM driver1 WHERE d_name="${name}" and driver_id="${pass}";`, (e,op) => {
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
