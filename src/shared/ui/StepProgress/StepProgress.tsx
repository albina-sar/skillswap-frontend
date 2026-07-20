import { StepProgressProps } from "./types";
import styles from './StepProgress.module.css'
import clsx from "clsx";

export const StepProgress = ({ currentStep, stepsAmount }: StepProgressProps) => {
    const stepNumbers = Array.from({ length: stepsAmount }, (_, i) => i + 1);
    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.title}>Шаг {currentStep} из {stepsAmount}</h2>
            <div className={styles.progressList}>
                {stepNumbers.map((step) => {
                    return (
                        <svg
                            key={step}
                            className={clsx(styles.icon, {[styles.filled]: step <= currentStep})}
                        >
                            <rect width="60" height="4" fill="currentColor" rx="2" />
                        </svg>
                    );
                })
                }
            </div>
        </div>
    )
}