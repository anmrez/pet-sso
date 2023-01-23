// deno-lint-ignore-file no-case-declarations
import { PORT } from "./config.ts";
import { DataBase } from "./database/Database.ts";
import { Router } from "./routers/Router.ts";


const server = Deno.listen({ port: PORT });
console.log( 'Server started at ' + PORT )


const database = new DataBase()
const routerService = new Router( database )


for await ( const conn of server ) serveHttp( conn );
async function serveHttp( conn: Deno.Conn ) {
  
  const httpConn = Deno.serveHttp(conn);

  try {
    for await ( const requestEvent of httpConn ) router( requestEvent.request, requestEvent.respondWith )
  } catch ( err ) {
    console.log( err )
  }

}


function router( req: Request , res: any ){

  const urlPath = new URL( req.url ).pathname
  console.log( '\n' )
  console.log( '[' + req.method + ' ' + urlPath + '] ===>' )

  
  switch ( true ) {

    case urlPath === '/':
      routerService.home( req, res )
    break;


    case urlPath === '/login':
      routerService.login( req, res )
    break;

    
    // urlPath === '/registration':
    //   registration( req, res )
    // break;

    
    case /\/client\/images/.test( urlPath ):
      routerService.getProfileImage( req, res )
    break;

    
    case urlPath === '/getUsers':
      console.log( database.getUsers() )
    break;

    
    case urlPath === '/getProfile':
      routerService.getProfile( req, res )
    break;

    
    case urlPath === '/logout':
      routerService.logout( req, res )
    break;


    case urlPath === '/exchange':
      routerService.exchangeKeys( req, res )
    break;


    case urlPath === '/SSOTranfer':
      routerService.ssoTranfer( req, res )
    break;


    default:
      routerService.notFound( res )
    break;

    
  }


}
