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
  const {username, password} = req.body
  let token
  //1st hash password and see if it matches anything in db
  const pos = await knex.select('password', 'token').from('admin').where('username', username)

  for(let i=0; i<pos.length; i++){
    const crypt = pos[i]
    const same = bcrypt.compareSync(password, crypt.password)
    if(same) token = crypt.token
  }

  if(!token){
    res.json({
      error: "user not found"
    })
    return res
  }
  //if everything good up to this pt, return good REST response
  res.json({
    token: token
  })
}
