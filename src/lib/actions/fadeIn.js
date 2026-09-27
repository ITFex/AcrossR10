/**
 * Svelte action: fade-slide an element in when it enters the viewport.
 * Usage: <div use:fadeIn>  or  <div use:fadeIn={{ delay: 100 }}>
 *
 * @param {HTMLElement} node
 * @param {{ delay?: number }} [opts]
 */
export function fadeIn(node, opts = {}) {
  const { delay = 0 } = opts;

  node.style.opacity = '0';
  node.style.transform = 'translateY(24px)';
  node.style.transition = `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      });
    },
    { threshold: 0.12 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
