export const doc = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cenicero.com.ar',
            version: '1.0.0',
            description: 'Ecommerce realizado con: Node, Express, MongoDB y React JS'
        },
        servers: [
            { url: 'http://localhost:8080' }
        ]
    },
    apis: ['./src/docs/*.yml']
}