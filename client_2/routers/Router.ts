import { RsaService } from "../services/RsaServices.ts";
import { SendService } from "../services/SendService.ts";
import { SSO } from "../services/SSO.ts";
import { Home } from "./Home.ts";
import { SSOTransfer } from './SSOTransfer.ts';
import { Database } from '../database/Database.ts';
import { GetProfile } from "./GetProfile.ts";
import { RemoveUserData } from "./RemoveUserData.ts";
import { CookieService } from '../services/CookieService.ts';




export class Router{


  private readonly sendService: SendService = new SendService()
  private readonly rsaService: RsaService = new RsaService( )
  private readonly cookieService: CookieService = new CookieService()

  private readonly homeService: Home = new Home( this.sendService )
  private readonly SSOService: SSO = new SSO(  )
  private readonly ssoTransferService: SSOTransfer = new SSOTransfer( this.sendService, this.rsaService )
  
  private readonly getProfileService: GetProfile = new GetProfile( this.sendService, this.rsaService, this.cookieService )
  private readonly removeUserDataService: RemoveUserData = new RemoveUserData( this.sendService, this.cookieService )

  
  constructor(
    private database: Database
  ){}


  public home( req: Request, res: any ): void {

    this.homeService.get( req, res, this.database )

  }


  public getProfile( req: Request, res: any ): void {

    this.getProfileService.post( req, res, this.database )

  }


  public getSSOAddress( res: any ): void {

    this.SSOService.getAddress( res )

  }


  public ssoTransfer ( req: Request, res: any ): void {

    this.ssoTransferService.post( req, res, this.database )

  }


  public removeUserData ( req: Request, res: any ): void {

    this.removeUserDataService.post( req, res, this.database )

  }


  public notFound( res: any ): void {

    res( this.sendService.sendNotFound() )

  }


}