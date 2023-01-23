import { IUser } from '../database/Database.ts';
import { RsaService } from './RsaService.ts';




export class SendService{


  constructor(
    private readonly rsaService: RsaService
  ){}



  async sendDataToClientService( address: string, data: string ): Promise< Response | undefined >{

    const encryptData = await this.rsaService.encrypt( address, data )
    if ( encryptData === undefined ) return undefined

    const request = new Request( address + 'ssoTransfer', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'referer': 'http://localhost:3000'
      },
      body: encryptData
    } )

    const response = await fetch( request )
    console.log( response )
    return response

  }


  removeCookie( cookieName: string ){

    return new Response( undefined, {
      status: 200,
      headers:{
        'Set-cookie': cookieName + '=1; max-age=-1;'
      }
    })

  }


  sendProfile( user: IUser ){

    const body = {
      name: user.name,
      image: user.image
    }

    const bodyJson = JSON.stringify( body )

    return new Response( bodyJson, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    })

  }


  sendStatus( res: any, status: number ){

    res( new Response( undefined, {
      status: status
    } ) )

  }


  sendNotFound () {

    return new Response( '404', { status: 404 } )
  
  }


  sendNotAllowed(){

    return new Response( undefined, {
      status: 406
    } )

  }


  // giveToken( res: any, resLogin: any, referer: string | null ){

  //   const tokenMaxAge = 60 * 60 * 24 * 10

  //   const headers = new Headers()
  //   headers.append( 'content-type', 'application/json' )
  //   headers.append( 'Set-cookie', 'token=' + resLogin.token + '; SameSite=lax; HttpOnly; max-age=' + tokenMaxAge )

  //   const body: {
  //     status: number
  //     message: string
  //     name?: string
  //     image?: string
  //     referer?: string
  //   } = {
  //     status: resLogin.status,
  //     message: resLogin.message
  //   }

  //   if ( resLogin.name ) body.name = resLogin.name
  //   if ( resLogin.image ) body.image = resLogin.image
  //   if ( referer === '192.168.0.2:3005' ) body.referer = referer

  //   const bodyJson = JSON.stringify( body )

  //   res( new Response( bodyJson, {
  //       status: resLogin.status,
  //       headers: headers
  //     }
  //   ))

  // }


  sendErrorEmptyBody( res: any ): void {

    res( new Response( JSON.stringify({
      status: 400,
      message: 'The body is empty'
    }), {
      status: 400,
      headers:{
        'content-type': 'application/json'
      }
    }))

  }
  
    
  sendJSON ( data: any, statusRes?: number ){
  
    let status = 200
    if ( statusRes ) status = statusRes
  
    return new Response( 
      JSON.stringify( data ),
      {
        status: status,
        headers: {
          "content-type": "application/json",
        },
      }  
    )
  
  }
  
  
  sendMessage ( message: string ){
  
    return new Response( message )
  
  }
  
  
  redirectToReferer ( headers: Headers ){
  
    return new Response( undefined, {
      status: 301,
      headers: headers
    })
  
  }
  
  
  async sendFile( filepath: string, headers?: Headers ){
  
    let file: Deno.FsFile
  
    try {
      
      file = await Deno.open( '.' + filepath, { read: true });
      
    } catch ( err ){
  
      console.log( err )
      return new Response( err, { status: 500 } )
  
    }
    
    if ( headers ) return new Response( file.readable, {
      status: 200,
      headers: headers
    })
  
    return new Response( file.readable, {
      status: 200,
    })
    
  
  }




}