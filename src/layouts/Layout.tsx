import Menu from '../../src/components/Menu';

export default function Layout({ children }) {

  return (
    <>
      <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
      <div className="w-full min-h-screen bg-primary pb-12">
        <Menu />
        {children}
      </div>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5273287913596003"
        crossOrigin="anonymous"></script>
    </>
  )

}
