import { ToastContainer } from 'react-toastify'
import Head from 'next/head'

export default function Layout({ children }) {
    const title = '「〜」サービス'
    const description = '〜ができるサービスです。'

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta name="description" key="description" content={description} />
                <meta property="og:title" key="ogTItle" content={title} />
                <meta property="og:site_name" key="ogSiteName" content={title} />
                <meta
                    property="og:description"
                    key="ogDescription"
                    content={description}
                />
            </Head>
            <nav
                className="navbar navbar-expand-lg navbar-light mb-3"
                style={{ backgroundColor: '#e3f2fd' }}
            >
                <div className="container">
                    <div className="mr-auto">
                        <a className="navbar-brand" href="#">
                            Navbar
                        </a>
                    </div>
                    <form className="d-flex">
                        <button className="btn btn-outline-primary" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </nav>
            <div className="container">{children}</div>
            <ToastContainer />
        </div>
    )
}