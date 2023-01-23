import { SendService } from "./SendService.ts"




export function isMethodNotPost( req: Request, sendService: SendService ){

  if ( req.method !== 'POST' ) {
    sendService.sendNotAllowed()
    return true
  } 

  return false

}


export function isMethodNotGet( req: Request, sendService: SendService ){

  if ( req.method !== 'GET' ) {
    sendService.sendNotAllowed()
    return true
  } 

  return false

}