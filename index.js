const express = require( 'express' )
const cookie = require( 'cookie-parser' )
const body = require( 'body-parser' )
const env = require( 'dotenv' )
const path = require( 'path' )

// App
const app = express()
env.config()

// Views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Setting
app.use(cookie())
app.use(body.json())
app.use(body.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public/')))

// Router
app.use('/', require( './router' ))

app.use('*', (request, response) => {
    response.send( 'Not Found' )
})

// Start Server
app.listen(3000, () => console.log( 'Example app listening on port 3000!' ))