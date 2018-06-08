const Request = require( 'request' )

const users = 'https://api.vk.com/method/users.get?'
const access = 'https://oauth.vk.com/access_token?'
const friends = 'https://api.vk.com/method/friends.get?'

class Auth {
    constructor () {
        this.version = 5.78
        this.user = {}
    }

    async setToken (request, response) {
        const options = {
            client_id: process.env.ID,
            client_secret: process.env.SECRET,
            redirect_uri: process.env.URI,
            code: request.query.code
        }

        const params = await this.serialize( options )
        const token = await this.request(access + params, data => data)

        if ( token.error ) return

        response.cookie('token', token.access_token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true})
    }

    async hasAuth ( request ) {
        const params = await this.serialize({access_token: request.cookies.token, fields: ['photo_200']})
        const data = await this.request(users + params, data => data)

        if ( data.error ) return data

        this.user = data.response.shift()
        this.user.access_token = request.cookies.token

        return this.user
    }

    async getUsers ( args = {} ) {
        var options = Object.assign({user_id: this.user.id, access_token: this.user.access_token}, args)
        var params = await this.serialize( options )

        var data = await this.request(friends + params, data => data)

        if ( data.error ) return []
        
        options = {user_ids: data.response.items.join( ',' ), access_token: this.user.access_token, fields: ['photo_100']}
        params = await this.serialize( options )

        data = await this.request(users + params, data => data.response)

        if ( data.error ) return []

        return data
    }

    async request (uri, func) {
        const output = await new Promise((resolve, reject) => {
            Request.get(uri + '&v=' + this.version, (error, response, body) => {
                if ( error ) return reject( error )
                resolve( JSON.parse( body ) )
            })
        }).catch(error => {error: error})

        return func( output )
    }

    async serialize ( object ) {
        const array = []

        for (const key in object) {
            array.push(encodeURIComponent( key ) + '=' + encodeURIComponent( object[key] ))
        }

        return array.join( '&' )
    }
}

module.exports = Auth