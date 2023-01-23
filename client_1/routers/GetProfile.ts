import { SSOAddres } from "../config.ts";
import { Database } from "../database/Database.ts";
import { CookieService } from "../services/CookieService.ts";
import { getAddressOfThisServer } from "../services/getAddressOfThisServer.ts";
import { RsaService } from "../services/RsaServices.ts";
import { SendService } from "../services/SendService.ts";
import { isMethodNotPost } from "../services/validationMethods.ts";


interface IPayload{
  name: string
  image: string
}


export class GetProfile{


  constructor(
    private readonly sendService: SendService,
    private readonly rsaService: RsaService,
    private readonly cookieService: CookieService
  ){}


  async post( req: Request, res: any, database: Database ){

    if ( isMethodNotPost( req, this.sendService ) ) return;

    const clientToken = this.cookieService.getToken( req )
    if ( clientToken === null ) {
      this.sendService.sendStatus( res, 404 )
      return;
    } 

    const ssoToken = database.getSSOTokenByClientToken( clientToken )
    if ( ssoToken === null ){
      this.sendService.sendStatus( res, 404 )
      return;
    }

    const encryptToken = this.rsaService.encrypt( ssoToken )
    const request = new Request( SSOAddres + '/SSOTranfer', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        'referer': getAddressOfThisServer() + '/'
      },
      body: encryptToken
    })

    const response = await fetch( request )

    if ( response.status === 400 ) {
      this.sendService.sendStatus( res, 400 )
      return;
    }

    if ( response.status === 404 ) {
      this.sendService.redirect( res, '/removeUserData' )
      return;
    }
    
    const responseObj: IPayload = await response.json()
    responseObj.image = SSOAddres + '/' + responseObj.image

    const responseJson = JSON.stringify( responseObj )

    res( new Response( responseJson, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    }))

  }

}