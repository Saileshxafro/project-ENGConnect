const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const mysql = require("mysql")
const crypto = require("crypto")
// const {require} = require("http")
// const {error} = require("console")

var engconnect=express()
engconnect.use(cors())
engconnect.use(bodyparser.json())
engconnect.use(express.json())
engconnect.use(bodyparser.urlencoded({extended:true}))
engconnect.use(express.static('public'))

let localdb=mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"Sailesh123!",
    database:"engineerconnect"
})
localdb.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("db connected")
    }
})
engconnect.post('/signup',(request,response)=>{
    let sno = crypto.randomUUID().toString()
    let date = new Date()
    let todaydate = date.toISOString().slice(0,10)
    let {fname,lname,email,phone,password,location,dob,age,role}=request.body
    let insertquery =`insert into engineerconnect.signup(sno,fname,lname,email,phone,password,location,dob,age,role,createdby,updatedby,createddate,updateddate)values('${sno}',?,?,?,?,?,?,?,?,?,'${sno}','${sno}','${todaydate}','${todaydate}')`
    localdb.query(insertquery,[fname,lname,email,phone,password,location,dob,age,role],(error,result)=>{
        if(error){
            response.send({"status":"error"})
            console.log(error)
        }
        else{
            response.send({"status":"success"})
        }
    })
})

engconnect.post('/signin',(request,response)=>{
    let{email,password}=request.body
    let loginquery='select* from engineerconnect.signup where email=?'
    localdb.query(loginquery,[email],(error,result)=>{
        if(error){
            response.send({"status":"error"})
        }
        else if(result.length>0){
            let dbusername=result[0].email
            let dbpassword=result[0].password
            let id=result[0].id
            let role=result[0].role
            if(dbusername===email && dbpassword===password){
                response.send({"status":"success","id":id,"role":role})
            }
            else{
                response.send({"status":"invalid"})
            }
        }
        else{
            response.send({"status":"empty_set"})
        }
    })
})
engconnect.get('/getuser',(request,response)=>{
    let selectallquery='select * from engineerconnect.signup where role = "user"'

    localdb.query(selectallquery,(error,result)=>{
        if(error){
            response.send(error)
        }
        else{
            response.send(result)
            console.log(result)
        }
    })
})

engconnect.get('/getemployee',(request,response)=>{
    let selectallquery='select * from engineerconnect.signup where role = "employee"'

    localdb.query(selectallquery,(error,result)=>{
        if(error){
            response.send(error)
        }
        else{
            response.send(result)
            console.log(result)
        }
    })
})

engconnect.get('/getempdetails',(request,response)=>{
    let selectallquery='select * from engineerconnect.signup where role = "employee"'

    localdb.query(selectallquery,(error,result)=>{
        if(error){
            response.send(error)
        }
        else{
            response.send(result)
            console.log(result)
        }
    })
})

engconnect.post('/deletebyadmin',(request,response)=>{
    let sno = request.body.sno
    let deletequery = 'delete from engineerconnect.signup where sno=?'
    localdb.query(deletequery,[sno],(error,result)=>{
        if(error){
            response.send({"status":"error"})
            console.log(error)
        }
        else{
            response.send({"status":"success"})
        }
    })
})

engconnect.get('/getone/:sno',(request,response)=>{
    let {sno} = request.params
    let getonequery = 'select * from engineerconnect.signup where sno=?'
    localdb.query(getonequery,[sno],(error,result)=>{
        if(error){
            response.send({"status":"error"})
        }
        else{
            response.send(result)
            console.log(result)
        }
    })
})

engconnect.get('/getone/:role',(request,response)=>{
    let {role} = request.params
    let getonequery = 'select * from engineerconnect.signup where role=?'
    localdb.query(getonequery,[role],(error,result)=>{
        if(error){
            response.send({"status":"error"})
        }
        else{
            response.send(result)
            console.log(result)
        }
    })
})

engconnect.put('/updateaduser/:sno',(request,response)=>{
    let {sno} =request.params
    let {fname,lname,email,phone,location,dob,age,role,updatedby} = request.body
    let updatequery = 'update engineerconnect.signup set fname=?,lname=?,email=?,phone=?,location=?,dob=?,age=?,role=?, updatedby=? where sno=?'
    localdb.query(updatequery,[fname,lname,email,phone,location,dob,age,role,updatedby,sno],(error,result)=>{
        if(error){
            response.send({"status":"error"})
            console.log(error)
        }
        else{
            response.send({"status":"success"})
        }
    })
})

engconnect.listen(3005,()=>{
    console.log("Your port is running in 3005")
})