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
