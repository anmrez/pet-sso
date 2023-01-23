import { DataBase } from "../database/Database.ts";




export function userLoggedIn( token: string, database: DataBase ): boolean {

  const tokenExistsInDB = database.validateToken( token ) 
  if ( !tokenExistsInDB ) return false

  // this.sendErrorAlreadyAuth( res )
  return true

}