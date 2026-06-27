import { type FC, type ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

const ProtectedLayoutComponent: FC<Readonly<IProps>> = async (props) => {
  const { children } = props

  return <>{children}</>
}

export default ProtectedLayoutComponent
