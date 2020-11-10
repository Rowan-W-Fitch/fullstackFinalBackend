const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'fullstack'
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
