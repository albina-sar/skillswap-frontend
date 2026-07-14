import styles from './Logo.module.css'
import logo from '../../assets/images/logo.svg'

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <img className={styles.image} src={logo} alt="SkillSwap" />

      <span className={styles.text}>SkillSwap</span>
    </div>
  )
}
