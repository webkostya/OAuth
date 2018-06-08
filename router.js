const express = require( 'express' )
const Auth = require( './app/auth' )
const path = require( 'path' )

const router = express.Router()
const auth = new Auth()

router.get('/', async (request, response) => {    
    const data = await auth.hasAuth( request )

    if ( data.error ) return response.render('index', {title: 'Index'})

    const users = await auth.getUsers({order: 'random', count: 10})

    return response.render('account', {
        title: 'Account',
        data: data,
        users: users
    })
})

router.get('/auth', async (request, response) => {   
    await auth.setToken(request, response)
    response.redirect( '/' )
})

router.get('/logout', async (request, response) => {   
    response.clearCookie( 'token' )
    response.redirect( '/' )
})

module.exports = router