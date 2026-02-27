export function getAthletes(){
  return JSON.parse(localStorage.getItem("athletes") || "[]");
}

export function saveAthlete(name){
  const athletes = getAthletes();
  athletes.push(name);
  localStorage.setItem("athletes", JSON.stringify(athletes));
}
