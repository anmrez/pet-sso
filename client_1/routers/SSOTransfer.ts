import { SendService } from "../services/SendService.ts";
import { isMethodNotPost } from "../services/validationMethods.ts";
import { SSOAddres } from '../config.ts';
import { RsaService } from "../services/RsaServices.ts";
import { Database } from "../database/Database.ts";


export class SSOTransfer{

  private readonly refererSSO = SSOAddres

  constructor(
    private readonly sendService: SendService,
    private readonly rsaService: RsaService
  ){}


  async post( req: Request, res: any, database: Database ): Promise< void > {

    if ( isMethodNotPost( req, this.sendService ) ) return

    if ( !this.isRefrerFromVerifiedSource( req ) ){
      console.log( '[SSOTransfer] - the resource is not verified!' )
      return
    } 

    if ( !req.body ) {
      console.log( '[SSOTransfer] - empty body' )
      return
    } 

    const data = await req.json()
    const decryptData = await this.rsaService.decrypt( data )

    database.write( decryptData )
    console.log( database.getAll() )
    res( new Response( undefined, { status: 200 } ) )

  }



  // PRIVATE === ===

  private isRefrerFromVerifiedSource( req: Request ): boolean {

    const referer = req.headers.get( 'referer' )
    if ( referer === null ) return false

    const origin = new URL( referer ).origin
    if ( origin === this.refererSSO ) return true

    return false

  }


}