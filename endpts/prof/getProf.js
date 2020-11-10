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

  const id = req.params._id
  const prof = await knex.select("*").from("prof").where("id", id).limit(1)
  if(!prof){
    res.json({
      prof: null
    })
    return res
  }else{
    res.json({
      prof: prof
    })
  }

}
