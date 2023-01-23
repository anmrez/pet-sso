// deno-lint-ignore-file no-case-declarations
import { PORT } from "./config.ts";
import { Database } from "./database/Database.ts";
import { Router } from "./routers/Router.ts";



// const PORT = 3005
const server = Deno.listen({ port: PORT });
console.log( 'Server started at ' + PORT )


const database = new Database()
const routerService = new Router( database )


for await ( const conn of server ) serveHttp( conn );
async function serveHttp( conn: Deno.Conn ) {
  
  const httpConn = Deno.serveHttp(conn);

  try {
    for await ( const requestEvent of httpConn ) await router( requestEvent.request, requestEvent.respondWith )
  } catch ( err ) {

    console.log( err )

  }

}



async function router( req: Request , res: any ){
  
  const urlPath = new URL( req.url ).pathname
  console.log( '\n' )
  console.log( '•<' + req.method + ' | ' + urlPath + '> ==>' )

  switch ( true ) {
    case urlPath === '/':
      routerService.home( req, res )
    break;

    case urlPath === '/getProfile':
      routerService.getProfile( req, res )
    break;

    case urlPath === '/getSSOAddress':
      routerService.getSSOAddress( res )
    break;

    case urlPath === '/ssoTransfer':
      routerService.ssoTransfer( req, res )
    break;

    case urlPath === '/removeUserData':
      routerService.removeUserData( req, res )
    break;

    case urlPath === '/getUser':
      console.log( database.getAll() )
    break;

    default:
      routerService.notFound( res )
    break;
  }

  console.log( '<== </' + req.method + ' | ' + urlPath + '>' )
  console.log( '\n' )

}

