/**
 * Utility per lo scroll fluido verso sezioni con offset preciso per l'header fisso.
 */

export const scrollToSectionWithOffset = (targetId: string, customOffset: number = 24) => {
  const element = document.getElementById(targetId);
  if (!element) return false;

  const header = document.querySelector('nav');
  const headerHeight = header ? header.getBoundingClientRect().height : 64;

  // Cerchiamo il titolo h2 principale all'interno della sezione o l'elemento stesso
  const heading = element.querySelector('h2') || element;
  const headingRect = heading.getBoundingClientRect();
  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  
  // Calcolo della coordinata esatta: il titolo si posiziona sotto l'header fisso con un respiro visivo
  const targetScrollY = currentScrollY + headingRect.top - headerHeight - customOffset;

  window.scrollTo({
    top: Math.max(0, targetScrollY),
    behavior: 'smooth'
  });

  return true;
};
