export interface EarthquakeInfo {
  id: string;
  code: number;
  time: string;
  issue: {
    source: string;
    time: string;
    type: string;
    correct: string;
  };
  earthquake?: {
    time: string;
    hypocenter: {
      name: string;
      code: number;
      coordinate: {
        lat: number;
        lon: number;
      };
      depth: number;
      magnitude: number;
    };
    maxScale: number;
    domesticTsunami: string;
    foreignTsunami: string;
  };
  points?: Array<{
    pref: string;
    addr: string;
    isArea: boolean;
    scale: number;
  }>;
}

export interface EarthquakeAlert {
  id: string;
  magnitude: number;
  maxScale: number;
  hypocenter: string;
  time: string;
  issuedAt: string;
  isActive: boolean;
  type: 'forecast' | 'report';
}

const P2P_API_BASE = 'https://api.p2pquake.net/v2/history';
const EARTHQUAKE_STORAGE_KEY = 'last-earthquake-check';
const ALERT_DURATION = 10 * 60 * 1000; // 10 minutes

class EarthquakeService {
  private alerts: EarthquakeAlert[] = [];
  private listeners: ((alerts: EarthquakeAlert[]) => void)[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startMonitoring();
  }

  // Start monitoring for earthquakes
  startMonitoring() {
    // Check immediately
    this.checkForEarthquakes();
    
    // Check every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkForEarthquakes();
    }, 30000);
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Add listener for alert updates
  addListener(callback: (alerts: EarthquakeAlert[]) => void) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback: (alerts: EarthquakeAlert[]) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.alerts));
  }

  // Check for new earthquakes
  private async checkForEarthquakes() {
    try {
      const lastCheck = localStorage.getItem(EARTHQUAKE_STORAGE_KEY);
      const lastCheckTime = lastCheck ? new Date(lastCheck) : new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Fetch earthquake data from P2P API (removed codes parameter to avoid 400 error)
      const response = await fetch(`${P2P_API_BASE}?limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const earthquakes: EarthquakeInfo[] = await response.json();
      
      // Filter for earthquake-related events and significant earthquakes (震度4以上)
      const significantEarthquakes = earthquakes.filter(eq => {
        // Filter by event codes: 551, 552, 554, 556 (earthquake-related events)
        const isEarthquakeEvent = [551, 552, 554, 556].includes(eq.code);
        
        if (!eq.earthquake || !isEarthquakeEvent) return false;
        
        const earthquakeTime = new Date(eq.earthquake.time);
        const isRecent = earthquakeTime > lastCheckTime;
        const isSignificant = eq.earthquake.maxScale >= 40; // 震度4以上 (P2P APIでは震度は10倍で表現)
        
        return isRecent && isSignificant;
      });
      
      // Create alerts for new earthquakes
      const newAlerts: EarthquakeAlert[] = significantEarthquakes.map(eq => ({
        id: eq.id,
        magnitude: eq.earthquake!.hypocenter.magnitude,
        maxScale: eq.earthquake!.maxScale / 10, // Convert back to normal scale
        hypocenter: eq.earthquake!.hypocenter.name,
        time: eq.earthquake!.time,
        issuedAt: eq.issue.time,
        isActive: true,
        type: eq.code === 551 ? 'forecast' : 'report'
      }));
      
      // Add new alerts and remove old ones
      this.alerts = [
        ...newAlerts,
        ...this.alerts.filter(alert => {
          const alertTime = new Date(alert.issuedAt);
          return Date.now() - alertTime.getTime() < ALERT_DURATION;
        })
      ];
      
      // Remove duplicates
      this.alerts = this.alerts.filter((alert, index, self) => 
        index === self.findIndex(a => a.id === alert.id)
      );
      
      // Update last check time
      localStorage.setItem(EARTHQUAKE_STORAGE_KEY, new Date().toISOString());
      
      // Notify listeners if there are new alerts
      if (newAlerts.length > 0 || this.alerts.length > 0) {
        this.notifyListeners();
      }
      
    } catch (error) {
      console.error('Error checking for earthquakes:', error);
    }
  }

  // Get current active alerts
  getActiveAlerts(): EarthquakeAlert[] {
    return this.alerts.filter(alert => alert.isActive);
  }

  // Dismiss an alert
  dismissAlert(alertId: string) {
    this.alerts = this.alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: false } : alert
    );
    this.notifyListeners();
  }

  // Get scale intensity text
  static getScaleText(scale: number): string {
    if (scale >= 7) return '震度7';
    if (scale >= 6.5) return '震度6強';
    if (scale >= 6) return '震度6弱';
    if (scale >= 5.5) return '震度5強';
    if (scale >= 5) return '震度5弱';
    if (scale >= 4) return '震度4';
    if (scale >= 3) return '震度3';
    if (scale >= 2) return '震度2';
    if (scale >= 1) return '震度1';
    return '震度不明';
  }

  // Get scale color
  static getScaleColor(scale: number): string {
    if (scale >= 7) return 'bg-purple-600';
    if (scale >= 6.5) return 'bg-red-600';
    if (scale >= 6) return 'bg-red-500';
    if (scale >= 5.5) return 'bg-orange-600';
    if (scale >= 5) return 'bg-orange-500';
    if (scale >= 4) return 'bg-yellow-500';
    if (scale >= 3) return 'bg-yellow-400';
    return 'bg-gray-500';
  }
}

export const earthquakeService = new EarthquakeService();
