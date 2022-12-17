import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

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
  test('user unitary test add', async ({ client, assert }) => {
    const USERTEST = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'http://images.com/',
    }
    const { password, avatar, ...expected } = USERTEST

    const response = await client.post('/users').json(USERTEST)
    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notEqual(response.body().user.password, password)
    assert.notExists(response.body().user.password, 'Password defined')
  })

  test('it should return 409 when email is already in use', async ({ client, assert }) => {
    const { email } = await UserFactory.create()
    const USERTEST = {
      email: email,
      username: 'test',
      password: 'test',
      avatar: 'http://images.com/',
    }
    const response = await client.post('/users').json(USERTEST)
    response.assertStatus(409)

    assert.include(response.body().message, 'email')
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 409)
  })

  test('its should return 409 when username already in use', async ({ client, assert }) => {
    const { username } = await UserFactory.create()
    const USERTEST = {
      email: 'test@test.com',
      username: username,
      password: 'test',
      avatar: 'http://images.com/',
    }
    const response = await client.post('/users').json(USERTEST)

    assert.include(response.body().message, 'username')
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 409)
  })

  test('it should return 422 when required data is not provided', async ({ client, assert }) => {
    const response = await client.post('/users').json({})
    //console.log(response.body())

    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should return 422 whe provided an invalid email', async ({ client, assert }) => {
    const response = await client.post('/users').json({
      email: 'test@',
      username: 'test',
      password: 'test',
    })
    //console.log(response.body())
    assert.exists(
      response.body().errors.filter(({ field, rule }) => field === 'email' && rule === 'email')
    )
  })

  test('it should return 422 whe provided an invalid password', async ({ client, assert }) => {
    const response = await client.post('/users').json({
      email: 'test@test.com',
      username: 'test',
      password: 'tes',
    })
    assert.exists(response.body().errors.filter(({ field }) => field === 'password'))
  })
})
