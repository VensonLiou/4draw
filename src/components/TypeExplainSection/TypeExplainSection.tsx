import { Dot } from '../TotalBetSection/TotalBetSection'
import styles from './TypeExplainSection.module.css'

const TypeExplainSection = () => {
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Dot style={{ marginBlock: 9 }} /> Straight: The 4 digits and their order match.
        </li>
        <li className={styles.item}>
          <Dot style={{ marginBlock: 9 }} /> Box: The 4 digits match (regardless of the order).
        </li>
        <li className={styles.item}>
          <Dot style={{ marginBlock: 9 }} /> Set: Applying for straight and box on 1 ticket. Either will result in a win.
        </li>
        <li className={styles.item}>
          <Dot style={{ marginBlock: 9 }} /> Mini: The last 3 digits match (regardless of the order).
        </li>
      </ul>
    </section>
  )
}

export default TypeExplainSection