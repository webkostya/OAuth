;(function () {
    'use strict'

    const oauth = 'https://oauth.vk.com/authorize?'

    const options = {
        client_id: '6119416',
        display: 'page',
        redirect_uri: 'http://devserver.ml/auth',
        response_type: 'code'
    }

    const array = []

    for (const key in options) {
        array.push(encodeURIComponent( key ) + '=' + encodeURIComponent( options[key] ))
    }

    const button = document.getElementById( 'auth' )

    button.addEventListener('click', function () {
        location.href = oauth + array.join( '&' )
    })
})();