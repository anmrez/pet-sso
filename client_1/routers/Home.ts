import { Database, ISSOTranfer } from "../database/Database.ts";
import { generateToken } from "../services/generateToken.ts";
import { SendService } from "../services/SendService.ts";
import { isMethodNotGet } from "../services/validationMethods.ts";


export class Home{


  constructor(
    private sendService: SendService
  ){}


  get( req: Request, res: any, database: Database ){

    if ( req.method === 'OPTIONS' ) console.log( req )

    if ( isMethodNotGet( req, this.sendService ) ) return
    if ( this.isValideId( req, res, database ) ) return

    res( this.sendService.sendFile( '/client/index.html' ) )

  }

  
  
  // PRIVATE === ===

  private isValideId( req: Request, res: any, database: Database ): boolean {

    const urlID = new URL( req.url ).searchParams.get( 'id' )
    if ( urlID === null ) return false

    const find = database.findByID( urlID )
    if ( find === null ) return false

    this.login( res, find, database )

    return true

  }


  private login( res: any, data: ISSOTranfer, database: Database ): void {

    const headers = new Headers()
    const token = generateToken()

    database.createSession( data, token )

    headers.append( 'Set-cookie', 'token=' + token + '; simesite=strict; max-age=' + 60 * 60 * 24 * 30 )
    headers.append( 'Location', '/' )

    res( new Response( undefined, {
      status: 301,
      headers: headers
    } ) )

  }


}