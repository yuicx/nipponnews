export interface AppIcon {
  id: string;
  name: string;
  url: string;
  preview: string;
}

export const appIcons: AppIcon[] = [
  {
    id: 'default',
    name: 'デフォルト',
    url: 'https://photo-ten-iota.vercel.app/nipponnews/default.png',
    preview: 'https://photo-ten-iota.vercel.app/nipponnews/default.png'
  },
  {
    id: 'purple',
    name: 'パープル',
    url: 'https://photo-ten-iota.vercel.app/nipponnews/img1.png',
    preview: 'https://photo-ten-iota.vercel.app/nipponnews/img1.png'
  },
  {
    id: 'black',
    name: 'ブラック',
    url: 'https://photo-ten-iota.vercel.app/nipponnews/img2.png',
    preview: 'https://photo-ten-iota.vercel.app/nipponnews/img2.png'
  },
  {
    id: 'bird',
    name: 'バード',
    url: 'https://photo-ten-iota.vercel.app/nipponnews/img3.png',
    preview: 'https://photo-ten-iota.vercel.app/nipponnews/img3.png'
  }
];

const APP_ICON_KEY = 'selected-app-icon';

export const getSelectedIcon = (): AppIcon => {
  const savedIconId = localStorage.getItem(APP_ICON_KEY);
  return appIcons.find(icon => icon.id === savedIconId) || appIcons[0];
};

export const setSelectedIcon = (iconId: string): void => {
  localStorage.setItem(APP_ICON_KEY, iconId);
  updateManifestIcon(iconId);
};

const updateManifestIcon = (iconId: string): void => {
  const selectedIcon = appIcons.find(icon => icon.id === iconId);
  if (!selectedIcon) return;

  // Update the manifest link in the document head
  const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
  if (manifestLink) {
    // Create a new manifest with the selected icon
    const manifest = {
      name: 'ニッポンニュース',
      short_name: 'ニュース',
      description: '複数のニュースソースから最新のニュースをお届けします。',
      theme_color: '#CC0000',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: selectedIcon.url,
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: selectedIcon.url,
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: selectedIcon.url,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: selectedIcon.url,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    };

    // Create a blob URL for the manifest
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    
    // Update the manifest link
    manifestLink.href = manifestUrl;
  }

  // Update favicon
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon) {
    favicon.href = selectedIcon.url;
  }

  // Update apple-touch-icon
  const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
  if (appleTouchIcon) {
    appleTouchIcon.href = selectedIcon.url;
  }
};

export const initializePWA = (): void => {
  // Initialize with selected icon
  const selectedIcon = getSelectedIcon();
  updateManifestIcon(selectedIcon.id);

  // Add install prompt functionality
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    hideInstallButton();
  });
};

const showInstallButton = (): void => {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
};

const hideInstallButton = (): void => {
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
};

export const installPWA = async (): Promise<void> => {
  const deferredPrompt = (window as any).deferredPrompt;
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    (window as any).deferredPrompt = null;
    hideInstallButton();
  }
};
