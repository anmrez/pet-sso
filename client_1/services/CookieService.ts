

export class CookieService{



  constructor(){}


  getCookie( cookie: string, name: string ) {

    const matches = cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
  
    return matches ? decodeURIComponent(matches[1]) : undefined;
  
  }


  getToken( req: Request ): string | null {

    const cookie = req.headers.get( 'cookie' )
  
    if ( cookie === null ) return null
  
    const tokenInCookie = this.getCookie( cookie, 'token' )
    if ( tokenInCookie === undefined ) return null
  
    return tokenInCookie
  
  }



}