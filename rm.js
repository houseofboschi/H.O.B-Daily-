export function calc1RM(weight, reps){
  return weight * (1 + reps / 30);
}

export function calcFrom1RM(oneRM, reps){
  return oneRM / (1 + reps / 30);
}
