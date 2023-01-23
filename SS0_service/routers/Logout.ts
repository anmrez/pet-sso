import { DataBase } from '../database/Database.ts';
import { CookieService, IToken } from "../services/CookieService.ts";
import { SendService } from "../services/SendService.ts";
import { isMethodNotPost } from "../services/validateMethods.ts";


export class Logout{


  constructor(  
    private readonly sendService: SendService,
    private readonly cookieService: CookieService
  ){}


  post( req: Request, res: any, database: DataBase ){

    if ( isMethodNotPost( req, this.sendService ) ) return

    const token: IToken = this.cookieService.getToken( req, database )
    if ( token.exist === false ) return
   
    database.removeToken( token.token )
    res( this.sendService.removeCookie( 'token' ) )

  }

}