const bcrypt = require('bcrypt')
const saltRounds = 10;
const end = '3PeakMatr!c3z'
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
  const {username, email, password} = req.body
  //first use knex to check if user w/ username or email already exists
  let found = false;
  try{
    const exists = await knex.select('id').from('users').where('username', username).orWhere('email', email)
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
  const word = username.concat(email).concat(end)
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
      await knex('users').insert({
        username: username,
        email: email,
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
