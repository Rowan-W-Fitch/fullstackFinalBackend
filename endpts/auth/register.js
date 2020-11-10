const bcrypt = require('bcrypt')
const saltRounds = process.env.salt || 10;
const end = process.env.end || '3PeakMatr!c3z'
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
  const {username, password} = req.body
  //first use knex to check if user w/ username or email already exists
  let found = false;
  try{
    const exists = await knex.select('id').from('admin').where('username', username)
    console.log(exists)
    if(exists.length > 0) found = true
  }catch(e){
    res.status(500).json({
      error: "bad db connection :("
    })
  }
  //if user exists, then send back error
  if(found){
    res.json({
      error: "user already exists"
    })
    return res
  }
  //generate token
  const word = Math.random().toString().concat(username).concat(end)
  const token = await bcrypt.hash(word, saltRounds)
  if(!token){
    res.json({
      error: "our bad here, sorry!"
    })
    return res
  }
  //if all good at this pt, create new user in db
  bcrypt.hash(password, saltRounds, async function(err, hash) {
    try{
      await knex('admin').insert({
        username: username,
        password: hash,
        token: token
      })
    }catch(e){
      console.log(e)
      res.json({
        error: "bad db connection :("
      })
    }

  })
  //if everything good up to this pt, return good REST response
  res.json({
    token: token
  })
}
