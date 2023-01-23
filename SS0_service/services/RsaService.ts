import { privateKey, publicKey, RSAService } from "https://raw.githubusercontent.com/deno-microfunctions/rsa/main/src/rsa.ts"
import { clientServices } from "../config.ts";
import { getPrivateKey, getPublicKeyJson } from "./rsaReader.ts";



interface IReceivedPublicKey{
  N: string
  E: string
}


export class RsaService{


  private readonly rsaService = new RSAService()
  private publicKeysServices: {
    ip: string,
    key: publicKey
  }[] = []

  private publicKeyJson: Promise< string > = getPublicKeyJson()
  private privateKey: Promise< privateKey > = getPrivateKey()


  constructor(){}


  async exchange( req: Request, res: any ){

    if ( this.itIsNotVerifiedService( req ) ) {
      console.log( '[RSA] - request from an unverified source: ' + req.headers.get( 'referer' ) )
      res( new Response( undefined, { status: 500 } ) )
      return
    } 
    
    if ( req.body === null ) {
      console.log( '[RSA] - empty body: ' + req.headers.get( 'referer' ) )
      res( new Response( undefined, { status: 400 } ) )
      return
    } 

    const publicKeyJson: IReceivedPublicKey = await req.json()
    const save = this.saveKey( req, publicKeyJson )

    if ( save === false ) {
      console.log( '[RSA] - the key has already been recorded from this source: ' + req.headers.get( 'referer' ) )
      return
    }

    console.log( '[RSA] - successful key exchange since: ' + req.headers.get( 'referer' ) )
    res( new Response( await this.publicKeyJson, {
      status: 200,
      headers:{
        'content-type': 'application/json'
      }
    }))

  }


  encrypt( address: string, data: any ): string | undefined {

    const findIndex = this.isFind( address )
    if ( findIndex === null ) return undefined

    const publicKeyService = this.publicKeysServices[findIndex].key
    const encryptedBigint = this.rsaService.encrypt( data, publicKeyService )
    const encryptedString: string[] = []

    encryptedBigint.forEach( item => {
      encryptedString.push( item.toString() )
    })
    
    const encryptedJson = JSON.stringify( encryptedString )
    return encryptedJson
    
  }


  async decrypt( encryptedString: string[] ): Promise< string > {

    const encryptedBigint: bigint[] = []
    encryptedString.forEach( item => {
      encryptedBigint.push( BigInt( item ) )
    })

    const decryptData = this.rsaService.decrypt( encryptedBigint, await this.privateKey )
    return String( decryptData )
    
  }



  // PRIVATE === ===

  private itIsNotVerifiedService( req: Request ): boolean {

    let index = 0
    const referer = req.headers.get( 'referer' )
    if ( referer === null ) return true

    while( clientServices.length > index ){

      console.log( clientServices[index], referer )
      if ( clientServices[index] === referer ) return false
      index++

    }

    return true

  }


  private saveKey( req: Request, publicKeyJson: IReceivedPublicKey ): boolean {

    let referer = req.headers.get( 'referer' )
    if ( referer === null ) return false

    referer += '/'
    if ( this.isFind( referer ) !== null ) return false 

    const publicKey = this.getPublickKey( publicKeyJson )

    this.publicKeysServices.push({
      ip: referer,
      key: publicKey
    })

    return true

  }


  private isFind( address: string ): number | null {

    let index = 0
    while( this.publicKeysServices.length > index ){
      console.log( this.publicKeysServices[index].ip, address )
      if ( this.publicKeysServices[index].ip === address ) return index
      index++
    } 

    return null

  }


  private getPublickKey( publicKeyJson: IReceivedPublicKey ): publicKey {

    return {
      N: BigInt( publicKeyJson.N ),
      E: BigInt( publicKeyJson.E )
    }

  }


}