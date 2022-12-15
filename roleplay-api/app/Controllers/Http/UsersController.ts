import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userpayload = request.only(['email', 'username', 'password', 'avatar'])
    const user = await User.create(userpayload)
    return response.created({ user })
  }
}
