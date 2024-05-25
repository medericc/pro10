import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Trier les événements par date décroissante
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    // peut etre empty
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  ) || [];

  // Log data fetched
  console.log('Données récupérées :', data);
  console.log('Événements triés :', byDateDesc);

  // Fonction pour passer à la carte suivante
  const nextCard = () => {
    setIndex(prevIndex => {
      const newIndex = prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0;
      console.log('Nouvel index :', newIndex);
      return newIndex;
    });
  };

  // Utiliser setInterval pour faire défiler régulièrement
  useEffect(() => {
    console.log('Mise en place de l\'intervalle');
    const interval = setInterval(nextCard, 5000);
    return () => {
      console.log('Nettoyage de l\'intervalle');
      clearInterval(interval);
    };
    // dépend de la longueur
    // peut etre indef ou null
  }, [byDateDesc?.length]);

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.id} // clé unique
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={event.id}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
