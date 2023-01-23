import { DataBase, IUser } from "../database/Database.ts";
import { CookieService, IToken } from "../services/CookieService.ts";
import { SendService } from "../services/SendService.ts";
import { isMethodNotPost } from "../services/validateMethods.ts";


export class GetProfile{


  constructor(  
    private readonly sendService: SendService,
    private readonly cookieService: CookieService
  ){}

  
  post( req: Request, res: any, database: DataBase ){

    if ( isMethodNotPost( req, this.sendService ) ) {
      res( new Response( undefined, {
        status: 406
      }))
      return
    } 

    const token: IToken = this.cookieService.getToken( req, database )
    if ( token.exist === false ){
      res( new Response( undefined, {
        status: 404
      }))
      return
    } 

    const user: IUser | null = database.getUserByToken( token.token )
    if ( user === null ) {
      res( new Response( undefined, {
        status: 404
      }))
      return
    } 

    res( this.sendService.sendProfile( user ) )

  }

}