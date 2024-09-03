import { useEffect } from 'react';

export function useCenterDialog(isDialogOpen) {
  useEffect(() => {
    if (isDialogOpen) {
      const centerDialog = () => {
        const dialog = document.querySelector('.dialog');
        if (dialog) {
          const h = window.innerHeight;
          const divH = dialog.offsetHeight;

          // Adjust positioning to include scroll position
          const scrollY = window.scrollY;

          dialog.style.top = `${(h / 2) - (divH / 2) + scrollY}px`;
          dialog.style.left = '50%'; // Horizontally center using CSS transform
          dialog.style.transform = 'translateX(-50%)'; // Ensure it is centered horizontally
        }
      };

      centerDialog();
      window.addEventListener('resize', centerDialog);
      window.addEventListener('scroll', centerDialog);

      return () => {
        window.removeEventListener('resize', centerDialog);
        window.removeEventListener('scroll', centerDialog);
      };
    }
  }, [isDialogOpen]);
}
