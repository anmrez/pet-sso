import { RSAService } from "https://raw.githubusercontent.com/deno-microfunctions/rsa/main/src/rsa.ts"


const rsaService = new RSAService()
const newRSAKeyPair = rsaService.generateKeyPair()


await writePubKey()
await writePrivKey()


async function writeFile( jsonData: string, path: string ){

  const encoder = new TextEncoder()
  const data = encoder.encode( jsonData )
  const file = await Deno.open( path, { write: true } )

  await Deno.write( file.rid, data )
  Deno.close( file.rid )

}


export async function writePubKey(){

  const path = './RSA_keys/pubKey.json'
  const pubKey = newRSAKeyPair.publicKey

  const jsonData = JSON.stringify({
    N: pubKey.N.toString(),
    E: pubKey.E.toString()
  })

  await writeFile( jsonData, path )
  
}


export async function writePrivKey(){

  const path = './RSA_keys/privKey.json'
  const privKey = newRSAKeyPair.privateKey

  const jsonData = JSON.stringify({
    N: privKey.N.toString(),
    D: privKey.D.toString()
  })

  await writeFile( jsonData, path )
  
}