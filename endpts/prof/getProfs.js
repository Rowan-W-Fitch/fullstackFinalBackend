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

  const profs = await knex.select("*").from("prof")
  if(!profs){
    res.json({
      profs: null
    })
    return res
  }else{
    res.json({
      profs: profs
    })
  }

}
