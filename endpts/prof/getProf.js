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
