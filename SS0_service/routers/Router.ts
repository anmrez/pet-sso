import { Login } from "./Login.ts";
import { Home } from "./Home.ts";
import { DataBase } from "../database/Database.ts";
import { Logout } from "./Logout.ts";
import { SendService } from "../services/SendService.ts";
import { GetProfile } from "./GetProfile.ts";
import { GetProfileImage } from "./GetProfileImage.ts";
import { RsaService } from "../services/RsaService.ts";
import { SSOTranfer } from "./SSOTranfer.ts";
import { CookieService } from "../services/CookieService.ts";
import { GenerateService } from "../services/GenerateService.ts";
import { VerifyingService } from "../services/VerifyingService.ts";


export class Router{


  private rsaService: RsaService = new RsaService()
  private sendService: SendService = new SendService( this.rsaService )
  private cookieService: CookieService = new CookieService()

  private GenerateService: GenerateService = new GenerateService()
  private verifyingService: VerifyingService = new VerifyingService()

  
  private loginService: Login = new Login( this.sendService, this.cookieService, this.verifyingService )
  private homeService: Home = new Home( this.sendService, this.cookieService,this.GenerateService, this.verifyingService )
  private logoutService: Logout = new Logout( this.sendService, this.cookieService )

  private getProfileService: GetProfile = new GetProfile( this.sendService, this.cookieService )
  private getProfileImageService: GetProfileImage = new GetProfileImage( this.sendService )
  private ssoTranferService: SSOTranfer = new SSOTranfer( this.sendService, this.rsaService )


  constructor(
    private readonly database: DataBase
  ){}


  public login( req: Request, res: any ): void {

    this.loginService.post( req, res, this.database )

  }


  public home( req: Request, res: any ): void {

    this.homeService.get( req, res, this.database )

  }


  public logout( req: Request, res: any ): void {

    this.logoutService.post( req, res, this.database )

  }


  public getProfile( req: Request, res: any ): void {

    this.getProfileService.post( req, res, this.database )

  }


  public getProfileImage( req: Request, res: any ){

    this.getProfileImageService.get( req, res )

  }


  public exchangeKeys( req: Request, res: any ){

    this.rsaService.exchange( req, res )

  }


  public ssoTranfer( req: Request, res: any ){

    this.ssoTranferService.post( req, res, this.database )

  }


  public notFound( res: any ): void {

    res( this.sendService.sendNotFound() )

  }


}