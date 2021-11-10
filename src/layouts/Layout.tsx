import { ReactNode } from 'react'

import Menu from '../../src/components/Menu';

type Props = {
  children: ReactNode;
}

export default function Layout({ children }: Props) {

  return (
    <div className="w-full min-h-screen bg-primary pb-12">
      <Menu />
      {children}
    </div>
  )
}
