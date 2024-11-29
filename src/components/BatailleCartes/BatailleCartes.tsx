import React, { useState } from "react";

const familles = ["♥", "♠", "♦", "♣"];
const valeurs = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; 

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
  const [message, setMessage] = useState("Cliquer sur le bouton commencer pour lancer la partie");

  const commencerPartie = () => {
    const paquet = genererPaquet();
    const milieu = Math.floor(paquet.length / 2);
    setPaquetJoueur(paquet.slice(0, milieu));
    setPaquetOrdinateur(paquet.slice(milieu));
    setCarteJoueur(null);
    setCarteOrdinateur(null);
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
      setPaquetJoueur([...restePaquetJoueur, nouvelleCarteJoueur, nouvelleCarteOrdinateur]);
      setPaquetOrdinateur(restePaquetOrdinateur);
      setMessage("Joueur gagnat");
    } else if (nouvelleCarteJoueur.valeur < nouvelleCarteOrdinateur.valeur) {
      setPaquetJoueur(restePaquetJoueur);
      setPaquetOrdinateur([...restePaquetOrdinateur, nouvelleCarteOrdinateur, nouvelleCarteJoueur]);
      setMessage("Ordinateur remporte les carte");
    } else {
      setMessage("Égalité");
    }

    setCarteJoueur(nouvelleCarteJoueur);
    setCarteOrdinateur(nouvelleCarteOrdinateur);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Jeu de Cartes Simplifié</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={commencerPartie}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Commencer
        </button>
        <button
          onClick={jouerTour}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          disabled={paquetJoueur.length === 0 || paquetOrdinateur.length === 0}
        >
          Jouer
        </button>
      </div>
      <p className="text-lg font-medium text-gray-700 mb-6">{message}</p>
      <div className="flex space-x-12">
        <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Joueur ({paquetJoueur.length} cartes)</h2>
        {carteJoueur ? (
<div className="bg-white shadow-md p-4 mt-4 rounded-lg text-2xl font-bold text-red-500">
              {carteJoueur.valeur} {carteJoueur.famille}
</div>
          ) : (
            <div className="bg-gray-200 p-4 mt-4 rounded-lg text-xl text-gray-500">Aucune cartes</div>
          )}
        </div>
        <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Ordinateur ({paquetOrdinateur.length} cartes)</h2>
        {carteOrdinateur ? (
        <div className="bg-white shadow-md p-4 mt-4 rounded-lg text-2xl font-bold text-black">
        {carteOrdinateur.valeur} {carteOrdinateur.famille}
        </div>
        ) : (
        <div className="bg-gray-200 p-4 mt-4 rounded-lg text-xl text-gray-500">Aucune cartes</div>
        )}
        </div>
      </div>
    </div>
  );
};

export default JeuDeCartes;
