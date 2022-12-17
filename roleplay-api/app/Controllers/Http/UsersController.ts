import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userpayload = await request.validate(CreateUserValidator)

    const userByEmail = await User.findBy('email', userpayload.email)
    if (userByEmail) throw new BadRequestException('email already in use', 409)

    const userbyUserName = await User.findBy('username', userpayload.username)
    if (userbyUserName) throw new BadRequestException('username already in use', 409)

    const user = await User.create(userpayload)
    return response.created({ user })
  }
}
