import { selectSkills } from "@/entities/skill/model/skillsSlice";
import { selectUsers } from "@/entities/user/model/usersSlice";
import { CATEGORIES_DATA } from "@/shared/lib/constants";
import { Skill, Subcategory, User } from "@/shared/types";
import { UserCard } from "@/shared/ui/UserCard";
import { FC } from "react";
import { useSelector } from "react-redux";

interface UserCardElementProps {
  authorid: string;
  variant?: 'catalog' | 'skill';
}

export const UserCardElement: FC<UserCardElementProps> = ({authorid, variant}) => {

  const skills = useSelector(selectSkills) as Skill[];
  const users = useSelector(selectUsers) as User[];

  if (users.length === 0 || skills.length === 0) {
    return <div>Загрузка...</div>;
  }

  // получаем пользователя
  const getedUser = users.find(user => user.id === authorid) as User;

  if(!getedUser) {
    return <div>Автор не найден</div>
  }

  //чему может научить
  console.log("skills", skills);
  const getTeachSkill = skills.find(skill => getedUser.skills.includes(skill.id)) as Skill;

  console.log("getTeachSkill", getTeachSkill);

  //чему хочет научиться
  const getLearnSkills: Subcategory[] = CATEGORIES_DATA
    .flatMap(category => category.subcategories)
    .filter(sub => getedUser.wantsToLearn.includes(sub.id));

  console.log("getLearnSkills", getLearnSkills);

  const handleclick = () => {
    console.log("заглушка для клика по карточке");
  }

  return (
    <UserCard user={getedUser} teachSkill={getTeachSkill} learnSkills={getLearnSkills} onDetailsClick={handleclick} variant={variant} />
  )
}
