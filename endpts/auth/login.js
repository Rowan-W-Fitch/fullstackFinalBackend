const bcrypt = require('bcrypt')
const saltRounds = 10;
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
  const {username, password} = req.body
  let token
  //1st hash password and see if it matches anything in db
  const pos = await knex.select('password', 'token').from('users').where('username', username).orWhere('email', username)

  for(let i=0; i<pos.length; i++){
    const crypt = pos[i]
    const same = await bcrypt.compare(password, crypt.password)
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
