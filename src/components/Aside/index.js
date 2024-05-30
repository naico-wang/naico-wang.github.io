import { Link, useLocation } from 'react-router-dom'


import styles from './index.module.css'

const Aside = () => {
  const currentLocation = useLocation()
  const getActiveClass = (path) => {
    return path === currentLocation.pathname ? styles.current : null
  }
  return (
    <aside>
      <div className={ styles.avatar }/>
      <div className={ styles.introduction }>
        <section className={ styles.desc }>
          <p className={ styles.name }>Naico Wang</p>
          <p className={ styles.career }>Full-Stack-Engineer</p>
          <p className={ styles.location }>Shanghai, China</p>
        </section>
        <hr />
        <ul className={styles.skills}>
          <li>Front-End Engineering</li>
          <li>React/Vue/React Native</li>
          <li>Nodejs/Express/Nextjs</li>
          <li>Various MiniPrograms</li>
          <li>WeChat/AliPay/RedBook/Tiktok MP</li>
          <li>CI/CD</li>
          <li>ASP.NET/.NET Core/C#</li>
          <li>JAVA/Spring-*</li>
          <li>SOA/MicroService</li>
          <li>Newer-to-Harmony OS</li>
          <li>PMP</li>
        </ul>
      </div>
      <hr/>
      <div className={ styles.category }>
        <ul>
          <li>
            <Link className={ getActiveClass('/') } to='/'>Home</Link>
          </li>
          <li>
            <Link className={ getActiveClass('/blog') } to='/blog'>Blog</Link>
          </li>
          <li>
            <Link className={ getActiveClass('/contact') } to='/contact'>Contact</Link>
          </li>
        </ul>
      </div>
      <hr/>
    </aside>
  )
}

export default Aside
