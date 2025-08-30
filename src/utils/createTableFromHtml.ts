// Helper function to easily generate a DOM table from a readable HTML string
export default function createTableFromHtml(html: string): HTMLTableElement {
  const container = document.createElement("div");
  container.innerHTML = html.trim();

  document.body.appendChild(container);
  return container.querySelector("table") as HTMLTableElement;
}
