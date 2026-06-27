import { type FC, type ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

const LayoutComponent: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return <div className="relative z-0">{children}</div>
}

export default LayoutComponent
