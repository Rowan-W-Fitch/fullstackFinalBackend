const knex = require('knex')({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST || '127.0.0.1',
    user : process.env.DB_USER || 'postgres',
    password : process.env.DB_PASSWORD || '',
    database : process.env.DATABASE || 'fullstack'
  }
})

module.exports = async(req, res) => {

  const courses = await knex.select("*").from("class")
  if(!courses){
    res.json({
      courses: null
    })
    return res
  }else{
    res.json({
      courses: courses
    })
  }

}
