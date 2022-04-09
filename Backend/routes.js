const router = require('express').Router()
const connection = require('./conn')

// Fetches current location details of the driver
router.post('/mylocation', async (req,res) => {
    const {driver_id} = req.body
    console.log(driver_id)
    connection.query(`SELECT * from location where zipcode in (select zipcode from present_at where driver_id="${driver_id}");`, (e,op) => {
        if(e){
            console.log(e)
            res.status(404).json({'msg' : "Error"})
        }
        else{
            res.status(200).json({'msg': 'Success', data: op})
        }
    })
})

// Updates the drivers location
router.post('/update', async(req,res) => {
    const {driver_id, zipcode} = req.body
    
    connection.query(`UPDATE present_at set zipcode="${zipcode}" where driver_id="${driver_id}";UPDATE availability set zipcode="${zipcode}" WHERE taxi_id in (SELECT taxi_id from driver1 where driver_id ="${driver_id}")`, [1,2],(e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        return res.status(200).json({'msg' : 'Success'})

    })
})

//  Fetches the drivers shift details
router.post('/getshift', async(req,res) => {
    const {driver_id} = req.body
    connection.query(`SELECT * FROM shifts where shift_id in (SELECT shift_id from works where driver_id="${driver_id}")`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({'msg' : 'Success', shifts : op})
        }
    })
})

// Get the names of all the locations
router.get('/getnames', async (req,res) => {
    connection.query(`SELECT * FROM location`,(e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Not found'})
        }
        else{
            return res.status(200).json({location : op})
        }
    })
})

// Get all nearby taxis from the current location
router.post('/getnearby', async(req,res) => {
    const {start} = req.body
    connection.query(`select * from driver1 d inner join taxi1 t on d.taxi_id = t.taxi_id where t.taxi_id in (SELECT taxi_id from availability where zipcode="${start}");`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({'msg' :'Success' , taxi : op})
        }
    })
})

// Get the user details from the user id
router.post('/getuser', async(req,res) => {
    const {user_id } = req.body
    connection.query(`select phone,name from user1 inner join user2 on user1.user_id=user2.user_id and user1.user_id="${user_id}";`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(400).json({msg : 'Error'})
        }
        else{
            return res.status(200).json({msg : 'Success', data : op})
        }
    })  
})


// Get the user details from the user id
router.post('/grievance', async(req,res) => {
    const grievance_id = Math.floor(Math.random() * 1000000).toString()
    const { grievanceText, user_id } = req.body
    connection.query(`INSERT INTO grievance values("${grievance_id}","${user_id}","${grievanceText}");`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(400).json({msg : 'Error'})
        }
        else{
            return res.status(200).json({msg : 'Success', data : op})
        }
    })  
})

// Get the grievance of users.

router.get('/getgrievance', async(req,res) => {
    connection.query('select * from grievance;', (e,op) =>{
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({grievance : op})
        }
    })
})

// Book a trip from source to destination
router.post('/booktrip', async(req,res) => {
    const {user_id, taxi_id, from_s, to_d, trip_id} = req.body
    let driver_id = ""
    
    await connection.query(`INSERT INTO trip3 values("${user_id}","${from_s}","${to_d}","${trip_id}");INSERT INTO trip2 values("${from_s}","${to_d}","00:00:00",0,"${trip_id}");`,[1,2], (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
    })
    await connection.query(`SELECT driver_id from taxi1 where taxi_id="${taxi_id}"`, async (e,op)=>{
        if(e){
            return res.status(400).json({'msg' : 'Error'})
        }
        else{
            console.log(op)
            driver_id = op[0].driver_id
            console.log(driver_id)
            await connection.query(`INSERT INTO trip4 values("${trip_id}",1,FALSE,"${taxi_id}","${driver_id}")`, (e,op) => {
                if(e){
                    console.log(e)
                    return res.status(404).json({'msg' : 'Error'})
                }
                else{
                    return res.status(200).json({'msg' : 'Request made'})
                }
            })
        }
    })
    await connection.query(`INSERT INTO books values("${trip_id}","${user_id}")`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
    })    
})


//  Retrieve all the trip requests for the driver
router.post('/getrequests', async(req,res) => {
    const {taxi_id} = req.body
    connection.query(`SELECT * FROM trip4 WHERE taxi_id="${taxi_id}" and status=0`, async (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            if(op.length > 0){
                let trip_id = ''
                let dataRes = []
                let k = op.length
                await op.map( async (val,key) => {
                    trip_id = val.trip_id
                    
                    await connection.query(`SELECT * FROM trip3 where trip_id="${trip_id}"`, (err, opt) => {
                        if(err){
                            console.log(err)
                            return res.status(404).json({'msg' : 'Lol'})
                        }
                        else{
                            let dataObj = {
                                r : opt
                            }
                            dataRes.push(dataObj)
                            if(k === key + 1){
                                return res.status(200).json({'msg':'Success',data : dataRes})
                            }
                            console.log(key,k)
                        } 
                    })
                })
        }
        else{
            return res.status(200).json({data : {}})
        }
        }
    })
})