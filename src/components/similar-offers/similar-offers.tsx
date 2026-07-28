import { selectSkills } from "@/entities/skill/model/skillsSlice";
import { selectUsers } from "@/entities/user/model/usersSlice";
import { Skill, User } from "@/shared/types";
import { SimilarOffersUI } from "@/shared/ui/similar-offers/similar-offers";
import { useAppSelector } from "@/store/hooks";
import { FC, memo } from "react";
import { useParams } from "react-router-dom";

// interface SimilarOffersProps {
//   id: string;
// }

export const SimilarOffersComponent: FC = () => {

  const {id} = useParams();
  const skills = useAppSelector(selectSkills) as Skill[];
  const users = useAppSelector(selectUsers) as User[];

   if (!id) return null;

  if (users.length === 0 || skills.length === 0) {
    return <div>Загрузка...</div>;
  }

  console.log("skills", skills);
  console.log('all users', users);

  const currentSkill = skills.find(skill => skill.id === id);
  const currentUser = users.find(user => user.skills.includes(id));

  console.log('currentSkill', currentSkill);
  console.log('currentUser', currentUser);

  const similarSkillsID = skills
  .filter(skill =>
    skill.id !== id &&
    skill.subcategoryId === currentSkill?.subcategoryId)
  .map(skill => skill.id);

  console.log("similarSkillsID", similarSkillsID);

  const similarAuthors = users
    .filter(user =>
      user.id !== currentUser!.id &&
      user.skills.some(id => similarSkillsID.includes(id)))
    .map(user => user.id);


  console.log("similarAuthors", similarAuthors);

  return (
    <SimilarOffersUI users={similarAuthors}/>
  );
};


SimilarOffersComponent.displayName = 'SimilarOffers'

export const SimilarOffers = memo(SimilarOffersComponent)
