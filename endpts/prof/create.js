const bcrypt = require('bcrypt')
const saltRounds = process.env.salt || 10;
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
  const {name, email, office} = req.body
  if(
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof office !== 'string'
  ){
    res.status(500).json({
    error: "invalid input"
    })
    return res
  }
  const profExists = await knex.select("id").from("prof").where("email", email).limit(1)
  if(profExists && profExists.length > 0){
    res.json({
      error: "professor already exists"
    })
    return res
  }
  //if all good, insert into db
  let insrt
  try{
    insrt = await knex('prof').insert({
      name: name,
      email: email,
      office: office
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
