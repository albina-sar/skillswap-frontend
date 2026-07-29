export interface SectionProps {
  title: string;
  showAllButton?: boolean;
  onSeeAll?: () => void;
  titleClassName?: string
  className?: string
  /* Дочерние элементы — карточки */
  children: React.ReactNode;
  isExpanded?: boolean;
}
