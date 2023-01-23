import { DataBase, IResponseLogin } from "../database/Database.ts";
import { CookieService, IToken } from "../services/CookieService.ts";
import { SendService } from "../services/SendService.ts";
import { isMethodNotPost } from "../services/validateMethods.ts";
import { VerifyingService } from "../services/VerifyingService.ts";


export class Login{

  
  constructor(  
    private readonly sendService: SendService,
    private readonly cookieService: CookieService,
    private readonly verifyingService: VerifyingService
  ){}


  async post( req: Request, res: any, database: DataBase ){

    if ( isMethodNotPost( req, this.sendService ) ) return
    
    if ( this.reqBodyNotExist( req, res ) ) return;
    const body = await req.json()

    const headers = new Headers()
    headers.append( 'content-type', 'application/json' )

    const token: IToken = this.cookieService.getToken( req, database )
    if ( this.isTokenExistInDatabase( res, token ) ) return;

    const responseLogin = database.login( body )
    if ( this.isResponseLoginError( res, responseLogin, headers ) ) return;

    headers.set( 'Set-cookie', 'token=' + responseLogin.token + '; max-age=' + 60 * 60 * 24 * 30 + '; samesite=lax; HttpOnly' )

    const cookie = req.headers.get( 'cookie' )
    if ( cookie === null ) {
      console.log( 'cookie === null' )
      this.sendBody( res, responseLogin, headers )
      return;
    } 

    const referer = this.cookieService.getCookie( cookie, 'referer' )
    if ( referer === undefined ) {
      console.log( 'referer === undefined' )
      this.sendBody( res, responseLogin, headers )
      return;
    } 

    const isVerifiedSource = this.verifyingService.isVerifiedSource( referer )
    if ( isVerifiedSource === false ){
      this.sendBody( res, responseLogin, headers )
      return
    }

    res( new Response( JSON.stringify({ status: 301 }), {
      status: 200,
      headers: headers
    }))

  }



  /// PRIVATE === ===

  private reqBodyNotExist( req: Request, res: any ): boolean {

    if ( !req.body ) {
      this.sendService.sendErrorEmptyBody( res )
      return true
    }

    return false

  }


  private sendBody( res: any, body: any, headers: Headers ){

    let resBody: any

    if ( body.status === 400 ) resBody = {
      status: body.status,
      message: body.message,
    }

    if ( body.status === 200 ) resBody = {
      status: body.status,
      message: body.message,
      name: body.name,
      image: body.image
    }

    res( new Response( JSON.stringify( resBody ), {
      status: body.status,
      headers: headers
    }))

  }


  private isTokenExistInDatabase( res: any, token: IToken ): boolean {

    if ( token.existInDatabase ) {

      res( new Response( undefined, {
        status: 404
      } ) )

      return true

    }

    return false

  }


  private isResponseLoginError( res: any, responseLogin: IResponseLogin, headers: Headers ){

    if ( responseLogin.name === undefined ) {
      this.sendBody( res, responseLogin, headers )
      return true
    } 

    return false

  }


}