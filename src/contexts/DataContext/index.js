import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // ajout état last

  const getData = useCallback(async () => {

    try {
      // mettre dans variable pour reutiliser, load data
      const DataEvent = await api.loadData();
      setData(DataEvent);
   
   
    // Tri des événements par date
    const events = DataEvent?.events.sort((evtA, evtB) => 
      // ordre croissant
      new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
    );
    
    // Assignation du premier événement à setLast
    setLast(events[0]);
   
    } 
       catch (err) {
      setError(err);
    }
  }, []);


  useEffect(() => {
    if (data) return;
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last, // ajout pour qu'il soit envoyé
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
