import Menu from '../../src/components/Menu';

export default function Layout({ children}) {

  return (
    <div className="w-full min-h-screen bg-primary pb-12">
      <Menu />
      {children}
    </div>
  )
}
