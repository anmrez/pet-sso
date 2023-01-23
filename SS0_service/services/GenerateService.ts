

export class GenerateService{


  public number( length: number ): string {

    let result = ''
    const number = '5647382910564'
    let index = 0

    while( length > index ){

      const random = Math.random() * number.length
      const floor = Math.floor( random )
      result += number[floor]

      index++

    }

    return result

  }


}