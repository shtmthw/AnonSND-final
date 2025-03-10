export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}
import GetUserProfile from "./getUserProfile/page"
import Navbar from "./navbar/page"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div>
        {<Navbar/>}
        {<GetUserProfile/>}

        {children}
      </div>
  )
}
