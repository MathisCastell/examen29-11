import React, { useState } from "react";
// BatailleCartes.css peut-être utilisé pour des animations. 
// import "./BatailleCartes.css";

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

type Couleur = "red" | "black";

const obtenirCouleur = (famille: string | undefined): Couleur => {
  return famille === "♥" || famille === "♦" ? "red" : "black";
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
  const [cartesARemporter, setCartesARemporter] = useState<{ valeur: number; famille: string; faceCachee: boolean }[]>([]);
  const [message, setMessage] = useState("Cliquer sur le bouton commencer pour lancer la partie");
  const [carteChoisie, setCarteChoisie] = useState<{ valeur: number; famille: string }[]>([]);

  const afficherCartes = () => {
    const nb = Math.min(5, paquetJoueur.length); // Affiche au maximum 5 cartes ou moins si le deck est plus petit
    setCarteChoisie(paquetJoueur.slice(0, nb)); // Met les cartes affichées dans carteChoisie
  };
  

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

  const jouerTour = (carte: { valeur: number; famille: string }) => {
    if (paquetJoueur.length === 0 || paquetOrdinateur.length === 0) {
      setMessage(paquetJoueur.length > 0 ? "Gagné" : "Perdu");
      return;
    }

    const nouvelleCarteJoueur = carte;
    const nouvelleCarteOrdinateur = paquetOrdinateur[0];
    const restePaquetJoueur = paquetJoueur.filter((carte) => carte !== nouvelleCarteJoueur);
    const restePaquetOrdinateur = paquetOrdinateur.slice(1, paquetOrdinateur.length);
    
    
    
    if (nouvelleCarteJoueur.valeur > nouvelleCarteOrdinateur.valeur) {
      
      setPaquetJoueur([
        ...restePaquetJoueur,
        carte, 
        nouvelleCarteOrdinateur, 
        ...cartesARemporter.map((c) => ({ ...c, faceCachee: false })),
      ]);
      
      
      setPaquetOrdinateur(restePaquetOrdinateur);
      
      setCartesARemporter([]);
      
      setMessage("Joueur gagnat");

    } else if (nouvelleCarteJoueur.valeur < nouvelleCarteOrdinateur.valeur) {
      setPaquetJoueur(restePaquetJoueur);
      setPaquetOrdinateur([...restePaquetOrdinateur,
        nouvelleCarteOrdinateur,
        nouvelleCarteJoueur,
        ...cartesARemporter.map((carte) => ({ valeur: carte.valeur, famille: carte.famille })),
      ]);
      setCartesARemporter([]);
      setMessage("Ordinateur remporte les carte");
    } else {

      const nouvellesCartesARemporter = [{ ...nouvelleCarteJoueur, faceCachee: false },{ ...nouvelleCarteOrdinateur, faceCachee: false },...(restePaquetJoueur[5] ? [{ ...restePaquetJoueur[5], faceCachee: true }] : []),...(restePaquetOrdinateur[5] ? [{ ...restePaquetOrdinateur[5], faceCachee: true }] : []),];
      
      setCartesARemporter([...cartesARemporter, ...nouvellesCartesARemporter]);
      
      setPaquetJoueur(restePaquetJoueur);
      setPaquetOrdinateur(restePaquetOrdinateur);

      
      setMessage("Égalité, le prochain qui gagne remporte les cartes posées au centre");
    
    }

    setCarteJoueur(nouvelleCarteJoueur);

    setCarteOrdinateur(nouvelleCarteOrdinateur);
    
    setCarteChoisie([]);
  };

  return (
    
    <div className="bg-green-800 min-h-screen flex flex-col items-center py-8">
      {/* Liste cartes joueur */}
      <div className="w-1/5 p-4 flex flex-col items-center">
        <h2 className="text-white font-bold mb-4">Cartes Joueur</h2>
        {paquetJoueur.map((carte, index) => (
          <div
            key={index}
            className={`bg-white border border-gray-400 shadow-md p-2 w-12 h-16 rounded-md flex items-center justify-center text-sm font-bold ${
              obtenirCouleur(carte.famille) === "red" ? "text-red-500" : "text-black"
            }`}
          >
            {afficherValeur(carte.valeur)} {carte.famille}
          </div>
        ))}
      </div>
      <h1 className="text-4xl font-bold text-white mb-6">Jeu de Cartes Bataille version qui bug encore</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={commencerPartie} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
          Commencer
        </button>
        {carteChoisie.length === 0 ? (
        <button
        onClick={afficherCartes}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        disabled={paquetJoueur.length === 0}
      >
        Afficher Cartes
        </button>
        ) : (
        <button onClick={() => carteJoueur && jouerTour(carteJoueur)} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition" disabled={paquetJoueur.length === 0 || paquetOrdinateur.length === 0}>
          Jouer
        </button>
      )}
      </div>
      <p className="text-lg font-medium text-white mb-6">{message}</p>

      <div className="flex space-x-12">
      {/*future fonctionnalité d'affichage de la carte suivante du joueur*/}
      {/* <div>
      <div className="bg-white border border-gray-400 shadow-md p-4 mt-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold text-red-500">
      {afficherValeur(paquetJoueur[0].valeur)} {paquetJoueur[0].famille}
      </div>
      </div> */}
      
        <div className="text-center">
        <h2 className="text-xl font-semibold text-white">Prochaine Carte</h2>
        {/*Condition obligée car sinon renvoie une erreur lorsque le paquet du joueur n'est pas encore généré*/}
        {paquetJoueur.slice(5, 10).map((carte, index) => (
      <div
        key={index}
        className={`bg-white border border-gray-400 shadow-md p-2 w-12 h-16 rounded-md flex items-center justify-center text-sm font-bold ${
          obtenirCouleur(carte.famille) === "red" ? "text-red-500" : "text-black"
        }`}
      >
        {afficherValeur(carte.valeur)} {carte.famille}
      </div>
    ))}
          
        </div>
        <div className="text-center">
        <h2 className="text-xl font-semibold text-white">Joueur ({paquetJoueur.length} cartes)</h2>
          {carteJoueur ? (
            <div className={`bg-white border border-gray-400 shadow-md p-4 mt-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold ${obtenirCouleur(carteJoueur.famille) === "red" ? "text-red-500" : "text-black"}`}>
              {afficherValeur(carteJoueur.valeur)} {carteJoueur.famille}
            </div>
          ) : (
            <div className="bg-gray-200 p-4 mt-4 w-20 h-32 rounded-md text-xl text-gray-500">Vide</div>
          )}
    </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Cartes à remporter ({cartesARemporter.length})</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {cartesARemporter.map((carte, index) => ( 
              <div key={index} className={`w-16 h-24 rounded-md flex items-center justify-center shadow-md ${carte.faceCachee ? "bg-red-800" : "bg-white border border-gray-400"}`}>
                {!carte.faceCachee && (<span className={`text-lg font-bold ${obtenirCouleur(carte.famille) === "red" ? "text-red-500" : "text-black"}`}> {afficherValeur(carte.valeur)} {carte.famille}</span>)}
            </div>))}
        </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Ordinateur ({paquetOrdinateur.length} cartes)</h2>
          {carteOrdinateur ? (
          <div className={`bg-white border border-gray-400 shadow-md p-4 mt-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold ${obtenirCouleur(carteOrdinateur.famille) === "red" ? "text-red-500" : "text-black"}`}>
          {afficherValeur(carteOrdinateur.valeur)} {carteOrdinateur.famille} </div>) : (
          <div className="bg-gray-200 p-4 mt-4 w-20 h-32 rounded-md text-xl text-gray-500">Vide</div>)}</div>
      </div>
      {carteChoisie.length > 0 && (
  <div className="flex space-x-4 mt-4">
    {carteChoisie.map((carte, index) => (
      <div
        key={index}
        onClick={() => setCarteJoueur(carte)} 
        className={`cursor-pointer bg-white border border-gray-400 shadow-md p-4 w-20 h-32 rounded-md flex items-center justify-center text-2xl font-bold ${
          obtenirCouleur(carte.famille) === "red" ? "text-red-500" : "text-black"
        } ${carte === carteJoueur ? "ring-4 ring-blue-500" : ""}`} 
      >
        {afficherValeur(carte.valeur)} {carte.famille}
      </div>
    ))}
  </div>
  
)}{/* Liste carte ordinateur */}
<div className="w-1/5 p-4 flex flex-col items-center">
  <h2 className="text-white font-bold mb-4">Cartes Ordinateur</h2>
  {paquetOrdinateur.map((carte, index) => (
    <div
      key={index}
      className={`bg-white border border-gray-400 shadow-md p-2 w-12 h-16 rounded-md flex items-center justify-center text-sm font-bold ${
        obtenirCouleur(carte.famille) === "red" ? "text-red-500" : "text-black"
      }`}
    >
      {afficherValeur(carte.valeur)} {carte.famille}
    </div>
  ))}
</div></div>
  );

};


export default JeuDeCartes;
