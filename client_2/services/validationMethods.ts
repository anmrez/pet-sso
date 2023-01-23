import { SendService } from './SendService.ts';



export function isMethodNotGet( req: Request, sendService: SendService ){
  
  if ( req.method !== 'GET' ) {
    sendService.sendNotFound() 
    return true
  }

  return false

}


export function isMethodNotPost( req: Request, sendService: SendService ){
  
  if ( req.method !== 'POST' ) {
    sendService.sendNotFound() 
    return true
  }

  return false

}