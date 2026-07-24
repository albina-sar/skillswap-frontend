export interface SectionProps {
  title: string;
  showAllButton?: boolean;
  onSeeAll?: () => void;
  /* Дочерние элементы — карточки */
  children: React.ReactNode;
}