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

// Approves the current trip request
router.post('/approve', async(req,res) => {
    const {trip_id, start, end,  duration, fare, user_id} = req.body
    let from_s = ''
    let to_d = ''
    await connection.query(`INSERT INTO ongoing values("${trip_id}","${user_id}")`,  (e,o) => {
        if(e){
            console.log(e)
        }
    })
    await connection.query(`SELECT from_s, to_d from trip3 WHERE trip_id="${trip_id}"`,async (e,op) => {
        if(e){
            console.log(e)
            return res.status(400).json({'msg' : 'err'})
        }
        else{
            from_s = op[0].from_s
            to_d = op[0].to_d
            await connection.query(`UPDATE trip2 SET duration="${duration}",fare=${fare} WHERE from_s="${from_s}" and to_d="${to_d}" and trip_id="${trip_id}";UPDATE trip4 SET status=TRUE WHERE trip_id="${trip_id}"`,[1,2], (e,op) => {
                if(e){
                    console.log(e)
                    return res.status(400).json({'msg' : 'err'})
                }
                else{
                    connection.query(`INSERT INTO trip1 values("${start}","${end}","${duration}","${trip_id}")`, (e,o) => {
                        if(e){
                            console.log(e)
                            return res.status(400).json({'msg' : 'err'})
                        }
                        else{
                            return res.status(200).json({'msg' : 'Accepted'})
                        }
                    })
                }
            })
        }
    })
    
})

// Declines the current trip request
router.post('/decline', async(req,res) => {
    const {trip_id} = req.body
    connection.query(`DELETE FROM trip3 where trip_id="${trip_id}"; DELETE FROM books where trip_id="${trip_id}"`,[1,2],(e,op) => {
        if(e){
            console.log(e)
        }
        res.status(200).json({msg : 'Done'})
    })
})

// Checks the details of the last trip that was booked by the user
router.post('/checkstatus', async(req,res) => {
    const {user_id, trip_id} = req.body
    console.log(user_id, trip_id)
    connection.query(`SELECT * FROM ongoing where user_id="${user_id}"`, (e,op) => {
        if(e) {
            console.log(e)
            return res.status(400).json({msg: 'Error'})
        }
        else{
            if(op.length !== 0){
                return res.status(200).json({'msg' : 'approved'})
            }
            else{
                connection.query(`SELECT * FROM trip4 where trip_id="${trip_id}" and status=0`, (err,opt) => {
                    if(err){
                        console.log(err)
                    }
                    else if(opt.length !== 0){
                            console.log('in')
                            return res.status(200).json({'msg' : 'wait'})
                    }
                    else{
                        return res.status(200).json({'msg' : 'declined'})
                    }
                })
            }
        }
    })
})


//  Adding a new driver
router.post('/addnew', async(req,res) => {
    const {driver_id, taxi_id, d_name, d_phone_no, rating, number, color, model, cclass, capacity} = req.body
    console.log(number)
    const sql = `insert into taxi1 values("${taxi_id}","${color}","${number}", NULL,"${model}");
            insert into taxi2 values("${taxi_id}","${model}");
            insert into taxi3 values("${model}", ${capacity}, "${cclass}");
            insert into driver1 values("${driver_id}","${d_name}","${d_phone_no}","${taxi_id}",${rating});
            insert into driver2 values("${driver_id}","${d_phone_no}");
            insert into driver3 values("${d_phone_no}","${d_name}");
            UPDATE taxi1 SET driver_id="${driver_id}" where taxi_id="${taxi_id}";
            insert into works values("${driver_id}","2");
            insert into drives values("${driver_id}","${taxi_id}");
            insert into present_at values("${driver_id}","410078");
            insert into availability values("${taxi_id}","410078");`
    connection.query(sql,[1,2,3,4,5,6,7,8,9,10,11], (e,op) => {
        if(e){
            console.log(e)
            res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({'msg' : 'Inserted'})
        }
    })
})

// Retrieve information about the garage

router.get('/getgarage', async(req,res) => {
    connection.query('select * from garage;', (e,op) =>{
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({garage : op})
        }
    })
})


// Retrieve information about owner

router.get('/getowner', async(req,res) => {
    connection.query('select * from owner;', (e,op) =>{
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({owner : op})
        }
    })
})


// Get details about a trip
router.post('/curtrip', async(req,res) => {
    const {trip_id } = req.body
    connection.query(`SELECT * FROM trip2 where trip_id="${trip_id}"`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(400).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({ongoing : op})
        }
    })
})

// Give rating to the driver
router.post('/setrating', async(req,res) => {
    const {rating , trip_id} = req.body
    let prevrating = 0
    connection.query(`SELECT rating from trip4 where trip_id="${trip_id}"`,(err,op) => {
        if(err){
            return res.status(404)
        }
        else{
            prevrating = op[0].rating
        }
    })
    console.log(prevrating)
    const r = Math.ceil((rating + prevrating) / 2)
    connection.query(`UPDATE trip4 set rating="${r}" where trip_id="${trip_id}";DELETE from ongoing where trip_id="${trip_id}"`,[1,2], (e,op) => {
        if(e){
            console.log(e)
            return res.status(400).json({'msg' : 'Error'})
        }
        return res.status(200).json({'msg' : 'Updated'})
    })

})

// Get details about the ongoing trip
router.post('/getongoing', async(req,res) => {
    const {user_id} = req.body

    connection.query(`SELECT trip_id from ongoing where user_id="${user_id}";`, (e,op) => {
        if(e){
            console.log(e)
        }
        else{
            return res.status(200).json({ongoing : op})
        }
    })
})

module.exports = router