const http = require('http');

const HeroFactory = require('./factories/heroFactory');

const PORT = 3000;
const DEFAULT_HEADER = { 'Content-Type': 'application/json' }

const heroService = HeroFactory.generateInstance();
const Hero = require('./entities/hero')

const routes = {
    '/heroes:get': async (request, response) => {
        //await Promise.reject('/heroes:get') para capturar o erro de internal server error
        const { id } = request.queryString;
        const heroes = await heroService.find(id);
        response.write(JSON.stringify({ results: heroes }));
        return response.end();
    },
    '/heroes:post': async (request, response) => {
        //async iterator - for await serve para iterar dentro de funções asincronas
        //cada novo evento(nesse caso request) que chegar entrará no for await
        for await (const data of request) {
            try {
                //await Promise.reject('/heroes:get') para capturar o erro de internal server error
                const item = JSON.parse(data)
                const hero = new Hero(item);
                const { error, valid } = hero.isValid()
                if (!valid) {
                    response.writeHead(400, DEFAULT_HEADER);
                    response.write(JSON.stringify({ error: error.join(',') }));
                    return response.end();
                }

                const id = await heroService.create(hero);
                response.writeHead(200, DEFAULT_HEADER);
                response.write(JSON.stringify({ success: 'User Created with success!', id }));

                //* o return existe aqui pois é um objeto body por requisição
                // se fosse um arquivo que sobe sob demanda
                // ele poderia entrar mais vezes em um mesmo evento, ai removeriamos esse return
                return response.end();// resumindo, cada client envia um request por vez
            } catch (error) {
                return handleError(response)(error);
            }
        }
    },
    default: (request, response) => {
        response.write('Hello World!');
        response.end();
    }
}

const handleError = (response) => {
    return (error) => {
        console.error('Deu ruim', error);
        response.writeHead(500, DEFAULT_HEADER);
        response.write(JSON.stringify({ error: 'Internal Server Error!!!' }));

        return response.end();
    }
}

const handler = (request, response) => {
    const { url, method } = request;
    const [first, route, id] = url.split('/');
    request.queryString = { id: isNaN(id) ? id : Number(id) };
    const key = `/${route}:${method.toLowerCase()}`;
    console.log(key)

    response.writeHead(200, DEFAULT_HEADER);

    const chosenMethod = routes[key] || routes.default;
    return chosenMethod(request, response).catch(handleError(response));
}

http.createServer(handler)
    .listen(PORT, () => console.log('server running at', PORT));
