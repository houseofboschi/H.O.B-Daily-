import { db, collection, addDoc, onSnapshot, serverTimestamp }
from "./firebase.js";

import { calc1RM } from "./rm.js";
import { getAthletes, saveAthlete } from "./storage.js";


/* =====================
   ATHLETEN
=====================*/

const athleteSelect = document.getElementById("athleteSelect");

function renderAthletes(){
  athleteSelect.innerHTML="";
  getAthletes().forEach(a=>{
    const opt=document.createElement("option");
    opt.text=a;
    athleteSelect.add(opt);
  });
}

document.getElementById("addAthleteBtn")
.onclick=()=>{
  const name=document.getElementById("newAthlete").value;
  if(!name) return;
  saveAthlete(name);
  renderAthletes();
};

renderAthletes();


/* =====================
   RM INPUT
=====================*/

for(let i=1;i<=10;i++){
  const o=document.createElement("option");
  o.value=i;
  o.text=i+"RM";
  rmSelect.add(o);
}

document.getElementById("saveRMBtn")
.onclick=()=>{

  const weight=Number(weightInput.value);
  const reps=Number(rmSelect.value);

  const oneRM=calc1RM(weight,reps);

  alert("Berechnetes 1RM: "+oneRM.toFixed(1)+"kg");
};


/* =====================
   FIREBASE LEADERBOARD
=====================*/

document.getElementById("submitLeaderboardBtn")
.onclick=async()=>{

  await addDoc(collection(db,"leaderboard"),{
    name:lbName.value,
    exercise:lbExercise.value,
    weight:Number(lbWeight.value),
    created:serverTimestamp()
  });
};


onSnapshot(collection(db,"leaderboard"),snap=>{

  leaderboardBody.innerHTML="";

  snap.forEach(doc=>{
    const d=doc.data();

    leaderboardBody.innerHTML+=`
      <tr>
        <td>${d.name}</td>
        <td>${d.exercise}</td>
        <td>${d.weight}</td>
      </tr>`;
  });

});
