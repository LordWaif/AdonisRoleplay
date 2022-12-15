import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

/*
 {
    "users": {
        "id": number,
        "email": string,
        "username": string,
        "password": string,
        "avatar": string
    }
 }
*/
test.group('user', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('user unitary test add', async ({ client }) => {
    const USERTEST = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'http://images.com/',
    }
    const response = await client.post('/users').json(USERTEST)
    response.assertStatus(201)
    response.assertBodyContains({ user: USERTEST })
  })
})
