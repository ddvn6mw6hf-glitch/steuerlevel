const celebrationLines = [
  'Das war ein starkes Lern-Manöver. Dein Zukunfts-Ich applaudiert. 👏',
  'Steuerfalle im Übungsmodus entdeckt! 💥',
  'Bürokratie-Boss im Lernlevel besiegt. 🏆',
  'Wissen statt Steuerchaos. Dieser Schritt sitzt. ✨',
  'Dein Taschenrechner meldet: „Sauber hergeleitet.“ 🧮',
  'Der Papierkram-Endgegner? Heute nur ein Lernbeispiel. 😎',
]

export function getCelebrationLine(index: number): string {
  const safeIndex = Number.isFinite(index) ? Math.floor(Math.abs(index)) : 0
  return celebrationLines[safeIndex % celebrationLines.length]
}

export function getCelebrationLineCount(): number {
  return celebrationLines.length
}