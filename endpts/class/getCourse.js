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

  const id = req.params._id
  const course = await knex.select("*").from("class").where("id", id).limit(1)
  if(!course){
    res.json({
      course: null
    })
    return res
  }else{
    res.json({
      course: course
    })
  }

}
