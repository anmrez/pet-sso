import { DataBase } from "../database/Database.ts";
import { SendService } from '../services/SendService.ts';
import { isMethodNotGet } from "../services/validateMethods.ts";
import { CookieService, IToken } from '../services/CookieService.ts';
import { GenerateService } from "../services/GenerateService.ts";
import { VerifyingService } from "../services/VerifyingService.ts";


interface IReferer{

  exist: boolean
  link: string
  verified: boolean

}


export class Home{


  constructor(  
    private readonly sendService: SendService,
    private readonly cookieService: CookieService,
    private readonly generateService: GenerateService,
    private readonly verifyingService: VerifyingService
  ){}


  async get( req: Request, res: any, database: DataBase ){

    if ( isMethodNotGet( req, this.sendService ) ) return
    
    const headers = new Headers()
    const referer: IReferer = this.getReferer( req )
    const token: IToken = this.cookieService.getToken( req, database )

    if ( referer.verified ) 
      headers.append( 'Set-cookie', 'referer=' + referer.link + '; samesite=strict;' )
    
    if ( token.existInDatabase === false ) 
      headers.append( 'Set-cookie', 'token=1; max-age=-1; samesite=strict;' )
      
    if ( token.existInDatabase && referer.verified ) {
      const result = await this.redirectUser( res, token, referer )
      if ( result === true ) return
    }

    res( this.sendService.sendFile( '/client/index.html', headers ) )

  }


  
  // PRIVATE === ===

  private getReferer( req: Request ): IReferer {

    const refererLink: string | null = req.headers.get( 'referer' )
    
    if ( refererLink === null ) return {
      exist: false,
      link: '',
      verified: false
    }

    if ( this.verifyingService.isVerifiedSource( refererLink ) ) return {
      exist: true,
      link: refererLink,
      verified: true
    }

    return {
      exist: true,
      link: refererLink,
      verified: false
    }

  }


  private async redirectUser( res: any, token: IToken, referer: IReferer ):Promise< boolean > {

    const headers = new Headers()
    const id = this.generateService.number( 30 )

    const response = await this.sendService.sendDataToClientService( referer.link, JSON.stringify({
      token: token.token,
      id: id
    }) )

    if ( response === undefined ) {
      console.log( '[Router | Home] - данные не смогли зашифроваться' )
      res( this.sendService.sendFile( '/client/index.html', headers ) )
      return true
    } 

    if ( response.status === 200 ) {
      headers.append( 'Location', referer.link + '?id=' + id )
      res( this.sendService.redirectToReferer( headers ) )
      return true
    }

    console.log( '[Router | Home] - Плохой ответ от сервиса' )
    return false

  }


}