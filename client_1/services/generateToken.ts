

export function generateToken(): string {

  let string = ''
  let index = 0
  const length = 50


  while( length > index ){

    const random = Math.random()
    
    if ( random > 0.5 ) string += getChar( 'letter' )
      else string += getChar( 'capital' )

    index++

  }


  return string

}


function getChar( type: 'letter' | 'capital' ){

  const letter = 'qwertyuiopasdfghjklzxcvbnmqwertyuiop'
  const capital = 'QWERTYUIOPASDFGHJKLZXCVBNMQWERTYUIOP'

  const random = Math.random() * letter.length
  const floor = Math.floor( random )

  if ( type === 'letter' ) return letter[floor]
  if ( type === 'capital' ) return capital[floor]

}
