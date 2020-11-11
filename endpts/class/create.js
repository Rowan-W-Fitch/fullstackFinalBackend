const bcrypt = require('bcrypt')
const saltRounds = process.env.salt || 10;
const moment = require("moment")
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
  // connection: {
  //   host : process.env.DB_HOST || '127.0.0.1',
  //   user : process.env.DB_USER || 'postgres',
  //   password : process.env.DB_PASSWORD || '',
  //   database : process.env.DATABASE || 'fullstack'
  // }
})

module.exports = async(req, res) => {
  //1st need to check if this is an admin user
  const token = req.headers && req.headers.token || null
  if(!token){
    res.status(403).json({
      msg: "access denied"
    })
  }
  const admin = knex.select('id').from('admin').where('token', token).limit(1)
  if(!admin){
    res.status(403).json({
      msg: "access denied"
    })
    return res
  }
  //check user input for faulty data
  const {number, name, description, prof, classroom, days, start, over} = req.body
  if(
    typeof number !== 'number' ||
    !Number.isInteger(number) ||
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof prof !== 'number' ||
    !Number.isInteger(prof) ||
    typeof classroom !== 'string'||
    typeof days !== 'string' ||
    !moment(start, 'HH:mm', true).isValid()||
    !moment(over, 'HH:mm', true).isValid()
  ){
    console.log("here")
    res.status(500).json({
    error: "invalid input"
    })
    return res
  }
  //check prof id is valid
  const profExists = await knex.select("id").from("prof").where("id", prof).limit(1)
  if(!profExists || profExists.length < 1){
    res.status(500).json({
      error: "invalid input"
    })
    return res
  }
  //check class doesn't already exist
  const classExists = await knex.select("id")
    .from("class")
    .where("number", number)
    .andWhere("name", name)
    .andWhere("description", description)
    .andWhere("professor", prof)
    .andWhere("days", days)
    .andWhere("start", start)
    .andWhere("over", over)
    .limit(1)

  if(classExists && classExists.length > 0){
    res.json({
      error: "class already exists"
    })
    return res
  }
  //if all good, insert into db
  let insrt
  try{
    insrt = await knex('class').insert({
      number: number,
      name: name,
      description: description,
      professor: prof,
      classroom: classroom,
      days: days,
      start: start,
      over: over
    }).returning("id")
  }catch(e){
    res.status(500).json({
      error: "bad db connection"
    })
    return res
  }
  res.json({
    insert: insrt
  })
}
