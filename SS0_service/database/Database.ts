
export interface IUser{
  name: string
  password: string
  image: string
  token?: string
}


export interface IResponseLogin{
  name?: string
  image?: string
  token?: string
  status: number
  message: string
}


const anmrez: IUser = {
  name: 'anmrez',
  password: '123',
  image: 'client/images/anmrez.png',
  token: 'krKYWPwiOMNVdWoToujUzMTyj'
}

const regularUser: IUser = {
  name: 'user',
  password: '123',
  image: 'client/images/default.png'
} 

export class DataBase{

  
  users: IUser[] = [ anmrez, regularUser ]
  
   
  login( user: IUser ) : IResponseLogin{
  
    const find = this.findUser( user )
  
    if ( find === null ) return {
      status: 500,
      message: 'User not found!',
    }
  
    if ( this.users[find].password === user.password ){

      if ( this.users[find].token ) return {
        status: 200,
        message: 'Authorization is successful',
        token: this.users[find].token,
        name: this.users[find].name,
        image: this.users[find].image
      }

      const token = this.createToken()
      this.users[find].token = token

      return {
        status: 200,
        message: 'Authorization is successful',
        token: token,
        name: this.users[find].name,
        image: this.users[find].image
      }
    } 
  
    return {
      status: 400,
      message: 'Invalid password'
    }
  
  }
  
  
  registration( user: IUser ){
  
    if ( this.findUser( user ) === null ) {
  
      user.image = 'default.png'
      this.users.push( user )
  
      return {
        status: 200,
        message: 'регистрация успешна'
      }
      
    } 
  
    return {
      status: 400,
      message: 'Пользователь с таким именем уже существует'
    }
  
  }


  getUsers(){

    return this.users

  }
   
  
  getUserByToken( token: string ){

    const find = this.findByToken( token )
    if ( find === null ) return null
    return this.users[find]

  }

  
  createToken(){ 
    
    const length = 50
    let token = ''
    let index = 0
    
    while( length > index ){
      
      const random = Math.random()
      if ( random >= 0.5 ) token += this.addSmall()
      if ( random < 0.5 ) token += this.addCapital()
      index++

    } 

    return token
    
  }


  validateToken( token: string ): boolean {

    const find = this.findByToken( token )

    if ( find === null ) return false

    return true

  }


  removeToken( token: string ): void {

    const find = this.findByToken( token )

    if ( find === null ) return

    this.users[find].token = undefined

  }


  
  // PRIVATE === ===

  private findUser( user: IUser ){
  
    let index = 0
  
    while( this.users.length > index ) {
      // if ( this.users[index].name === user.name ) return this.users[index]
      if ( this.users[index].name === user.name ) return index
      index ++
    } 
  
    return null
  
  }


  private findByToken( token: string ){

    let index = 0
    while ( this.users.length > index ) {
      if ( token === this.users[index].token ) return index
      index++
    }

    return null

  }


  private addSmall(): string {

    const smallLetters = 'qwertyuiopasdfghjklzxcvbnmqwertyuiop'

    let random = Math.random() * smallLetters.length
    random = Math.floor( random )

    return smallLetters[ random ]

  }


  private addCapital(): string {

    const capitalLetters = 'QWERTYUIOPASDFGHJKLZXCVBNMQWERT'

    let random = Math.random() * capitalLetters.length
    random = Math.floor( random )

    return capitalLetters[ random ]
    
  }


}