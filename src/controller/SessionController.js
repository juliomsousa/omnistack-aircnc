const User = require('../model/User')

// index, show, store, update, destroy
// index -> listagem de sessões
// show -> listar uma unica sessão
// store -> criar uma sessão
// update -> alterar uma sessão
// destroy -> remover uma sessão

module.exports = {
  async store(req, res) {
    const { email } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({ email })
    }

    return res.json(user)
  }
}