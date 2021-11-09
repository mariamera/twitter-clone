import { ReactNode } from 'react'

import Menu from '../../src/components/Menu';

type Props = {
  children: ReactNode;
}

export default function Layout({ children }: Props) {

  return (
    <>
      <div className="w-full min-h-screen bg-primary pb-12">
        <Menu />
        {children}
      </div>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5273287913596003"
        crossOrigin="anonymous"></script>
    </>
  )

}
