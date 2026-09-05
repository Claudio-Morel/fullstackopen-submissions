const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length === 4 || process.argv.length > 5 ) {
  console.log('Use: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://claudiomorel_db_user:${password}@cluster0.wvcsfxj.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const registerSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Register = mongoose.model('Register', registerSchema)

if (process.argv.length === 5) {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const register = new Register({
    name: newName,
    number: newNumber
  })

  register.save().then(result => {
    console.log('register saved!')
    console.log(result)
    mongoose.connection.close()
  })
}
else {
  console.log('Phonebook:')
  Register.find({}).then(result => {
    result.forEach(register => {
      console.log(`${register.name} ${register.number}`)
    })
    mongoose.connection.close()
  })
}
