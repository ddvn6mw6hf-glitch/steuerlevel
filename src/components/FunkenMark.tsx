type Props = { small?: boolean }

function FunkenMark({ small = false }: Props) {
  return <span className={`funken-mark${small ? ' funken-mark-small' : ''}`} aria-hidden="true">✧</span>
}

export default FunkenMark