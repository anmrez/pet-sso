import { privateKey } from "https://raw.githubusercontent.com/deno-microfunctions/rsa/main/src/rsa.ts";


export async function getPublicKeyJson(): Promise< string >{

  const pubKeyFile = await readFile( './RSA_keys/pubKey.json' )
  return new TextDecoder().decode( pubKeyFile )

}


export async function getPrivateKey(): Promise< privateKey > {

  const privKeyFile = await readFile( './RSA_keys/privKey.json' )
  const privKeyJson = new TextDecoder().decode( privKeyFile )
  const data: {
    N: string
    D: string
  } = JSON.parse( privKeyJson )

  const privKey: privateKey = {
    N: BigInt( data.N ),
    D: BigInt( data.D )
  }

  return privKey

}


function readFile( path: string ): Promise< Uint8Array > {

  return Deno.readFile( path )

}