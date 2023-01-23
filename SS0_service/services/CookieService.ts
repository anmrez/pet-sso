import { DataBase } from "../database/Database.ts";
import { userLoggedIn } from "./userLoggedIn.ts";



export interface IToken{

  exist: boolean
  token: string
  existInDatabase: boolean

}


export class CookieService{


  getCookie( cookie: string, name: string ) {

    const matches = cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
  
    return matches ? decodeURIComponent(matches[1]) : undefined;
  
  }


  getToken( req: Request, database: DataBase ): IToken {

    const cookie = req.headers.get( 'cookie' )
  
    if ( cookie === null ) return {
      exist: false,
      token: '',
      existInDatabase: false
    }
  
    const tokenInCookie = this.getCookie( cookie, 'token' )
  
    if ( tokenInCookie === undefined ) return {
      exist: false,
      token: '',
      existInDatabase: false
    }
  
    const existInDatabase = userLoggedIn( tokenInCookie, database )
  
    return {
      exist: true,
      token: tokenInCookie,
      existInDatabase: existInDatabase
    }
  
  }


}