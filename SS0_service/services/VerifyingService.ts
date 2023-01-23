import { clientServices } from '../config.ts';


export class VerifyingService{


  private verifiedAddresses = clientServices


  public isVerifiedSource( referer: string ): boolean {

    let index = 0
    
    while( this.verifiedAddresses.length > index ){
      
      let item = this.verifiedAddresses[index]
      if ( item[item.length - 1] !== '/' ) item += '/'

      if ( item === referer ) return true

      index++

    }

    return false

  }


}