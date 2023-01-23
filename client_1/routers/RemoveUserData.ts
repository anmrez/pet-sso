import { Database } from '../database/Database.ts';
import { SendService } from '../services/SendService.ts';
import { CookieService } from '../services/CookieService.ts';
import { isMethodNotGet } from '../services/validationMethods.ts';


export class RemoveUserData{


  constructor(
    private readonly sendService: SendService,
    private readonly cookieService: CookieService
  ){}


  post( req: Request, res: any, database: Database ){

    if ( isMethodNotGet( req, this.sendService ) ) return;

    const token = this.cookieService.getToken( req )
    if ( token === null ) {
      this.sendService.sendStatus( res, 400 )
      return;
    }

    database.reoveUserData( token )

    res( new Response( undefined, {
      status: 200,
      headers: {
        'Set-Cookie': 'token=1; max-age=-1; samesite=strict;',
      } 
    } ) )

  }

}