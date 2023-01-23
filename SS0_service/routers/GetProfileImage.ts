// deno-lint-ignore-file
import { SendService } from '../services/SendService.ts';
import { isMethodNotGet } from "../services/validateMethods.ts";


export class GetProfileImage{


  constructor(
    private readonly sendService: SendService
  ){}


  get( req: Request, res: any ){

    if ( isMethodNotGet( req, this.sendService ) ) return

    const filePath = new URL( req.url ).pathname
    res( this.sendService.sendFile( filePath ) )

  }

}