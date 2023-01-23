import { DataBase } from '../database/Database.ts';
import { RsaService } from '../services/RsaService.ts';
import { SendService } from '../services/SendService.ts';
import { isMethodNotPost } from '../services/validateMethods.ts';


interface IPayload{
  image: string
  name: string
}


export class SSOTranfer{


  constructor(
    private readonly sendService: SendService,
    private readonly rsaService: RsaService
  ){}


  async post( req: Request, res: any, database: DataBase ){

    if ( isMethodNotPost( req, this.sendService ) ) return;
    
    const referer = req.headers.get( 'referer' )

    if ( referer === null ) {
      this.sendService.sendStatus( res, 400 )
      return;
    } 
    
    if ( !req.body ) {
      this.sendService.sendStatus( res, 400 )
      return;
    }

    const body = await req.json()
    const decryptToken = await this.rsaService.decrypt( body )
    const userData = database.getUserByToken( decryptToken )

    if ( userData === null ) {
      this.sendService.sendStatus( res, 404 )
      return;
    }
    
    const payload: IPayload = {
      image: userData.image,
      name: userData.name
    }
    
    const payloadJson = JSON.stringify( payload )
        
    res( new Response( payloadJson, {
      status: 200,
      headers: {
        'content-type': 'text/plain'
      }
    }))

  }

}