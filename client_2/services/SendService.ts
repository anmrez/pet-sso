

export class SendService{


  constructor(){}


  sendStatus( res: any, status: number ) {

    res( new Response( undefined, {
      status: status
    } ) )

  }


  redirect( res: any, path: string ){

    res( new Response( undefined, {
      status: 301,
      headers: {
        'Location': path
      }
    } ) )

  }

  
  sendNotFound () {

    return new Response( '404', { status: 404 } )
  
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