import { type FC, type ReactNode } from 'react'

import { LayoutComponent } from '@/app/modules/layout'

interface IProps {
  children: ReactNode
}

const ProtectedLayoutComponent: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  return <LayoutComponent>{children}</LayoutComponent>
}

export default ProtectedLayoutComponent
