import { privateKey, publicKey, RSAService } from "https://raw.githubusercontent.com/deno-microfunctions/rsa/main/src/rsa.ts"
import { SSOAddres } from "../config.ts";
import { getAddressOfThisServer } from "./getAddressOfThisServer.ts";
import { getPrivateKey, getPublicKeyJson } from "./rsaReader.ts";


interface IReceivedPublicKey{
  N: string
  E: string
}


interface IDecryptRedirect{
  token: string
  id: string
}

export type IDecrypt = {
  token: string
  id: string
}

export class RsaService{

  private readonly rsaService = new RSAService()
  private SSOPublicKey: publicKey | undefined
  
  private readonly address: string = getAddressOfThisServer(  )
  private publicKeyJson: Promise< string > = getPublicKeyJson()
  private privateKey: Promise< privateKey > = getPrivateKey()


  constructor(){
    
    this.exchangeKeysWithSSOService()

  }


  encrypt( data: any ): string | undefined {

    if ( this.SSOPublicKey === undefined ) throw '[Encrypt] - SSOPublicKey undefined'

    const encryptedBigint = this.rsaService.encrypt( data, this.SSOPublicKey )
    const encryptedString: string[] = []

    encryptedBigint.forEach( item => {
      encryptedString.push( item.toString() )
    })
    
    const encryptedJson = JSON.stringify( encryptedString )
    return encryptedJson
    
  }


  async decrypt( encryptedString: string[] ): Promise< IDecrypt > {

    const encryptedBigint: bigint[] = []
    encryptedString.forEach( item => {
      encryptedBigint.push( BigInt( item ) )
    })

    const decryptData = this.rsaService.decrypt( encryptedBigint, await this.privateKey )
    const decryptText: string = String( decryptData )

    const decryptObj = JSON.parse( decryptText )

    return decryptObj

  }



  // PRIVATE === ===

  private async exchangeKeysWithSSOService(){

    let request = new Request( SSOAddres + '/exchange', {
      method: 'POST',
      headers:{
        'referer': this.address,
        'content-type': 'application/json'
      },
      body: await this.publicKeyJson
    })
  
    try {
  
      const response = await fetch( request )
      if ( response.status >= 300 ) {
        console.log( '[RSA] - SSO server refused to issue a public key;' )
        return
      }

      const publicKeyJson: IReceivedPublicKey = await response.json()
      this.savePublicKey( publicKeyJson )
      
    } catch {
      
      console.log( '[RSA] - ' + SSOAddres + '/exchange not available;' )
  
    }


  }


  private savePublicKey( publicKeyJson: IReceivedPublicKey ) {

    this.SSOPublicKey = {
      N: BigInt( publicKeyJson.N ),
      E: BigInt( publicKeyJson.E )
    }

    console.log( '[RSA] - the public key was successfully received;' )

  }
 

}