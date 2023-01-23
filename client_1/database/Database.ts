import { IDecrypt } from "../services/RsaServices.ts";


export interface ISSOTranfer{
  token: string
  id: string
  recordingTime: number
}


interface IUser{
  SSOToken: string
  token: string
}


export class Database{


  private storeSSOtransfer: ISSOTranfer[] = []
  private users: IUser[] = []


  constructor(){

    const timeStore = 60_000 // 1 minute
    setInterval( this.removeOldData.bind( this ), 60_000, timeStore )

  }

  write( data: IDecrypt ){

    const date = new Date().getTime()

    const SSOData: ISSOTranfer = {
      token: data.token,
      id: data.id,
      recordingTime: date
    }
    
    this.storeSSOtransfer.push( SSOData )

  }


  getAll(){

    return this.storeSSOtransfer

  }


  getSSOTokenByClientToken( clientToken: string ){

    let index = 0
    while( this.users.length > index ){

      const item = this.users[index]
      if ( item.token === clientToken ) return this.users[index].SSOToken

      index++
    }

    return null

  }


  findByID( id: string ): ISSOTranfer | null {

    let index = 0
    while( this.storeSSOtransfer.length > index ){

      const item = this.storeSSOtransfer[index]
      if ( item.id === id ) return this.storeSSOtransfer[index]

      index++
    }

    return null

  }


  createSession( data: ISSOTranfer, token: string ){

    this.removeById( data.id )

    this.users.push({
      SSOToken: data.token,
      token: token
    })

  }


  reoveUserData( clientToken: string ): void {

    let index = 0
    while( this.users.length > index ){

      const item = this.users[index]
      
      if ( item.token === clientToken ) {

        this.users.splice( index, 1 )
        return;

      }

      index++
    }

  }


  // PRIVATE === ===

  private removeById( id: string ): void {

    let index = 0

    while( this.storeSSOtransfer.length > index ){

      const item = this.storeSSOtransfer[index]
      
      if ( item.id === id ) {
        this.storeSSOtransfer.splice( index, 1 )
        return
      }

      index++

    }

    return

  }


  private removeOldData( timeStore: number  ){

    
    if ( this.storeSSOtransfer.length === 0 ) return;

    let index = 0
    const nowDate = new Date().getTime()

    while( this.storeSSOtransfer.length > index ) {

      const item = this.storeSSOtransfer[index]
      const totalTimeStore = item.recordingTime + timeStore

      if ( ( totalTimeStore - nowDate ) < 0 ) {
        this.storeSSOtransfer.splice( index, 1)
        index--
      }

      index++

    }

  }

}