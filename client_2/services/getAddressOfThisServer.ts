import { PORT, PROTOCOL } from '../config.ts';


export function getAddressOfThisServer(): string {

  // const ip = getIpServer()
  const ip = '10.0.0.2'
  return PROTOCOL + '://' + ip + ':' + PORT

}



function getIpServer(  ): string {

  const family = 'IPv4'
  const name = 'Ethernet'
  const ipList = Deno.networkInterfaces()

  let index = 0

  while( ipList.length > index ){

    if ( ipList[index].family === family )
      if ( ipList[index].name === name ) 
        return ipList[index].address

    index++

  }

  return 'none'

}