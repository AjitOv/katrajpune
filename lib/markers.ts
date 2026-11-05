export function getMarkerColor(category: string): string {
  const colors: Record<string, string> = {
    shopping: "#10b981",
    restaurants: "#f43f5e",
    healthcare: "#3b82f6",
    education: "#8b5cf6",
    home_services: "#f59e0b",
    automotive: "#ef4444",
    fitness: "#06b6d4",
    professional_services: "#6366f1",
  }
  return colors[category] || "#10b981"
}

export function getMarkerEmoji(category: string): string {
  const map: Record<string, string> = {
    shopping: "🛒",
    restaurants: "🍴",
    healthcare: "🏥",
    education: "🎓",
    home_services: "🔧",
    automotive: "🚗",
    fitness: "💪",
    professional_services: "💼",
  }
  return map[category] || "📍"
}

export function getClusterColor(count: number): string {
  if (count >= 10) return "#ef4444"
  if (count >= 5) return "#f59e0b"
  return "#10b981"
}
