import React, { useState } from "react";
// BattleGame.css non utilisé surement plus tard pour des animations
// import "./BattleGame.css";

const familles = ["♥", "♠", "♦", "♣"];
const valeurs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const afficherValeur = (valeur: number): string => {
  const figures: Record<number, string> = {
    11: "J",
    12: "Q",
    13: "K",
    14: "A",
  };
  return figures[valeur] || valeur.toString();
};

const genererPaquet = () => {
  const paquet: { valeur: number; famille: string }[] = [];
  for (const famille of familles) {
    for (const valeur of valeurs) {
      paquet.push({ valeur, famille });
    }
  }
  return paquet.sort(() => Math.random() - 0.5);
};

const JeuDeCartes = () => {
  const [paquetJoueur, setPaquetJoueur] = useState<{ valeur: number; famille: string }[]>([]);
  const [paquetOrdinateur, setPaquetOrdinateur] = useState<{ valeur: number; famille: string }[]>([]);
  const [carteJoueur, setCarteJoueur] = useState<{ valeur: number; famille: string } | null>(null);
  const [carteOrdinateur, setCarteOrdinateur] = useState<{ valeur: number; famille: string } | null>(null);
  const [cartesARemporter, setCartesARemporter] = useState<
    { valeur: number; famille: string; faceCachee: boolean }[]
  >([]);
  const [message, setMessage] = useState("Cliquer sur le bouton commencer pour lancer la partie");

  const commencerPartie = () => {
    const paquet = genererPaquet();
    const milieu = Math.floor(paquet.length / 2);
    setPaquetJoueur(paquet.slice(0, milieu));
    setPaquetOrdinateur(paquet.slice(milieu));
    setCarteJoueur(null);
    setCarteOrdinateur(null);
    setCartesARemporter([]);
    setMessage("Début de la partie");
  };

  const jouerTour = () => {
    if (paquetJoueur.length === 0 || paquetOrdinateur.length === 0) {
      setMessage(paquetJoueur.length > 0 ? "Gagné" : "Perdu");
      return;
    }

    const nouvelleCarteJoueur = paquetJoueur[0];
    const nouvelleCarteOrdinateur = paquetOrdinateur[0];
    const restePaquetJoueur = paquetJoueur.slice(1);
    const restePaquetOrdinateur = paquetOrdinateur.slice(1);

    if (nouvelleCarteJoueur.valeur > nouvelleCarteOrdinateur.valeur) {
      
      setPaquetJoueur([...restePaquetJoueur,nouvelleCarteJoueur,nouvelleCarteOrdinateur,...cartesARemporter.map((carte) => ({ valeur: carte.valeur, famille: carte.famille })),]);
      
      setPaquetOrdinateur(restePaquetOrdinateur);
      
      setCartesARemporter([]);
      
      setMessage("Joueur gagnat");

    } else if (nouvelleCarteJoueur.valeur < nouvelleCarteOrdinateur.valeur) {
      setPaquetJoueur(restePaquetJoueur);
      setPaquetOrdinateur([
        ...restePaquetOrdinateur,
        nouvelleCarteOrdinateur,
        nouvelleCarteJoueur,
        ...cartesARemporter.map((carte) => ({ valeur: carte.valeur, famille: carte.famille })),
      ]);
      setCartesARemporter([]);
      setMessage("Ordinateur remporte les carte");
    } else {

      const nouvellesCartesARemporter = [{ ...nouvelleCarteJoueur, faceCachee: false },{ ...nouvelleCarteOrdinateur, faceCachee: false },...(restePaquetJoueur[0] ? [{ ...restePaquetJoueur[0], faceCachee: true }] : []),...(restePaquetOrdinateur[0] ? [{ ...restePaquetOrdinateur[0], faceCachee: true }] : []),];
      
      setCartesARemporter([...cartesARemporter, ...nouvellesCartesARemporter]);
      
      setPaquetJoueur(restePaquetJoueur.slice(1));
      
      setPaquetOrdinateur(restePaquetOrdinateur.slice(1));
      
      setMessage("Égalité, le prochain qui gagne remporte les cartes posées au centre");
    
    }

    setCarteJoueur(nouvelleCarteJoueur);

    setCarteOrdinateur(nouvelleCarteOrdinateur);

  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
      {/*h1 est un indicateur concernant la version du code et non pas le titre définitif*/}
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Jeu de Cartes Amélioré ++ cartes suivante affichée</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={commencerPartie} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
          Commencer
        </button>
        <button onClick={jouerTour} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition" disabled={paquetJoueur.length === 0 || paquetOrdinateur.length === 0}>
          Jouer
        </button>
      </div>
      <p className="text-lg font-medium text-gray-700 mb-6">{message}</p>

      <div className="flex space-x-12">
      {/*future fonctionnalité d'affichage de la carte suivante du joueur*/}
      {/* <div>
      <div className="bg-white border border-gray-400 shadow-md p-4 mt-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold text-red-500">
      {afficherValeur(paquetJoueur[0].valeur)} {paquetJoueur[0].famille}
      </div>
      </div> */}
      
        <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Prochaine Carte</h2>
        <div className="bg-white border border-gray-400 shadow-md p-4 mt-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold text-red-500">
          {afficherValeur(paquetJoueur[0].valeur)} {paquetJoueur[0].famille}
        </div>
          
        </div>
        <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Joueur ({paquetJoueur.length} cartes)</h2>
          {carteJoueur ? (
            <div className="bg-white border border-gray-400 shadow-md p-4 mt-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold text-red-500">
              {afficherValeur(carteJoueur.valeur)} {carteJoueur.famille}
            </div>
          ) : (
            <div className="bg-gray-200 p-4 mt-4 w-20 h-32 rounded-md text-xl text-gray-500">Vide</div>
          )}
    </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Cartes à remporter ({cartesARemporter.length})</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {cartesARemporter.map((carte, index) => ( 
              <div key={index} className={`w-16 h-24 rounded-md flex items-center justify-center shadow-md ${carte.faceCachee ? "bg-blue-500" : "bg-white border border-gray-400"}`}>
                {!carte.faceCachee && (<span className="text-lg font-bold text-black"> {afficherValeur(carte.valeur)} {carte.famille}</span>)}
            </div>))}
        </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Ordinateur ({paquetOrdinateur.length} cartes)</h2>
          {carteOrdinateur ? (
          <div className="bg-white border border-gray-400 shadow-md p-4 mt-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold text-black">
          {afficherValeur(carteOrdinateur.valeur)} {carteOrdinateur.famille} </div>) : (
          <div className="bg-gray-200 p-4 mt-4 w-20 h-32 rounded-md text-xl text-gray-500">Vide</div>)}</div>
      </div>
    </div>
  );
};

export default JeuDeCartes;
