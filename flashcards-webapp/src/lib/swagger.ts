import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Turistička Agencija API',
      version: '1.0.0',
      description: 'REST API za web aplikaciju turističke agencije',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'AGENT', 'CLIENT'] },
            status: { type: 'string' },
          },
        },
        Arrangement: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            destination: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            numberOfNights: { type: 'integer' },
            imageUrl: { type: 'string' },
            categoryId: { type: 'integer' },
            isActive: { type: 'boolean' },
            capacity: { type: 'integer' },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] },
            userId: { type: 'integer' },
            arrangementId: { type: 'integer' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
          },
        },
        Discount: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            type: { type: 'string', enum: ['percentage', 'fixed'] },
            value: { type: 'number' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            arrangementId: { type: 'integer' },
          },
        },
      },
    },
    paths: {
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Prijava korisnika',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': { description: 'Uspešna prijava, vraća JWT token' },
            '401': { description: 'Pogrešan email ili lozinka' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registracija korisnika',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Korisnik uspešno registrovan' },
            '400': { description: 'Email već postoji' },
          },
        },
      },
      '/api/arrangements': {
        get: {
          tags: ['Arrangements'],
          summary: 'Lista svih aranžmana',
          responses: { '200': { description: 'Lista aranžmana', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/Arrangement' } } } } } },
        },
        post: {
          tags: ['Arrangements'],
          summary: 'Kreiranje novog aranžmana',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Arrangement' } } } },
          responses: { '201': { description: 'Aranžman kreiran' }, '401': { description: 'Neautorizovan' } },
        },
      },
      '/api/arrangements/{id}': {
        get: {
          tags: ['Arrangements'],
          summary: 'Detalji aranžmana',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Detalji aranžmana' }, '404': { description: 'Nije pronađen' } },
        },
        put: {
          tags: ['Arrangements'],
          summary: 'Izmena aranžmana',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Arrangement' } } } },
          responses: { '200': { description: 'Aranžman izmenjen' } },
        },
        delete: {
          tags: ['Arrangements'],
          summary: 'Brisanje aranžmana',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Aranžman obrisan' } },
        },
      },
      '/api/reservations': {
        get: {
          tags: ['Reservations'],
          summary: 'Lista rezervacija',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Lista rezervacija' } },
        },
        post: {
          tags: ['Reservations'],
          summary: 'Kreiranje rezervacije',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Reservation' } } } },
          responses: { '201': { description: 'Rezervacija kreirana' } },
        },
      },
      '/api/reservations/{id}': {
        get: {
          tags: ['Reservations'],
          summary: 'Detalji rezervacije',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Detalji rezervacije' } },
        },
        put: {
          tags: ['Reservations'],
          summary: 'Izmena statusa rezervacije',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Rezervacija izmenjena' } },
        },
        delete: {
          tags: ['Reservations'],
          summary: 'Otkazivanje rezervacije',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Rezervacija otkazana' } },
        },
      },
      '/api/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Lista kategorija',
          responses: { '200': { description: 'Lista kategorija' } },
        },
        post: {
          tags: ['Categories'],
          summary: 'Kreiranje kategorije',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Category' } } } },
          responses: { '201': { description: 'Kategorija kreirana' } },
        },
      },
      '/api/discounts': {
        get: {
          tags: ['Discounts'],
          summary: 'Lista popusta',
          responses: { '200': { description: 'Lista popusta' } },
        },
        post: {
          tags: ['Discounts'],
          summary: 'Kreiranje popusta',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { '$ref': '#/components/schemas/Discount' } } } },
          responses: { '201': { description: 'Popust kreiran' } },
        },
      },
      '/api/users': {
        get: {
          tags: ['Users'],
          summary: 'Lista korisnika (samo admin)',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Lista korisnika' } },
        },
      },
      '/api/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Detalji korisnika',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Detalji korisnika' } },
        },
        put: {
          tags: ['Users'],
          summary: 'Izmena korisnika',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Korisnik izmenjen' } },
        },
        delete: {
          tags: ['Users'],
          summary: 'Brisanje korisnika',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Korisnik obrisan' } },
        },
      },
    },
  },
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(options)