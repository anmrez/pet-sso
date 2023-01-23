import { SSOAddres } from "../config.ts";


export class SSO{


  private readonly address = SSOAddres


  public getAddress( res: any ): void {
    
    res( new Response( this.address, { status: 200 } ) )

  }


}